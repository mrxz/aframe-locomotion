import * as AFRAME from 'aframe';
import { ListenerFor, StrictComponent } from 'aframe';
import { rotateAroundWorldUp } from './turn';

const EPSILON = 0.00001;

/**
 * Component for reading the input of a thumbstick and using that to effectively
 * rotate the reference in place. This is accomplished by rotating and moving the target.
 * It's assumed that the reference is a descendant of the target. This can be used on the camera rig
 * to achieve smooth turning.
 *
 * @emits rotation Target was rotated through this component. No movement is also signalled through
 *      the `motion` event
 *
 * @example
 * The `smooth-turn` component needs to be applied to an entity that will emit the `axismove` event,
 * commonly one of the hands. Below is an example using a camera rig:
 * ```HTML
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>
 *
 *     <a-entity vive-controls="hand: right"
 *               oculus-touch-controls="hand: right"
 *               smooth-turn="target: #rig; reference: #camera">
 *     </a-entity>
 * </a-entity>
 * ```
 */
const SmoothTurnComponent = AFRAME.registerComponent('smooth-turn', {
    schema: {
        /** Whether the smooth turn is active or not */
        enabled:             { default: true },
        /** Selector for the target to apply rotation and translation to */
        target:              { type: 'selector' },
        /** Selector for the reference to 'effectively' rotate */
        reference:           { type: 'selector' },
        /** The (max) rotation speed (degrees/s) */
        turnSpeed:           { default: 20 },
        /**
         * The mode for interpreting the input. With the `binary` mode even small inputs will
         * result in maximum speed being applied. The `analog` mode will scale the applied speed
         * between 0 and `turnSpeed` based on the input magnitude
         */
        inputMode:           { default: 'binary' }
    },
    init: function() {
        this.input = 0;
        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            this.input = axis.length > 2 ? axis[2] : axis[0];
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: function(_t, dt) {
        if(!dt || !this.data.enabled || !this.data.reference || !this.data.target) {
            return;
        }

        if(Math.abs(this.input) <= EPSILON) {
            return;
        }

        let input = this.input;
        if(this.data.inputMode === 'binary') {
            if(input < 0) {
                input = -1;
            } else {
                input = 1;
            }
        }

        const degrees = -input * this.data.turnSpeed * dt / 1000;
        this.data.target.emit('rotation', { degrees, source: this.el });
        rotateAroundWorldUp(this.data.target.object3D, this.data.reference.object3D, degrees);
    },
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
}) satisfies StrictComponent<{input: number, axisMoveListener: ListenerFor<'axismove'> }>;

declare module "aframe" {
    export interface Components {
        "smooth-turn": InstanceType<typeof SmoothTurnComponent>,
    }
}