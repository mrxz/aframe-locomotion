import * as AFRAME from 'aframe';
import { ListenerFor } from 'aframe';
import { rotateAroundWorldUp } from './turn';
import { strict } from 'aframe-typescript';

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const DONE = 3;
// States in case of delay
const PRE = 4;
const POST = 5;
type State = typeof NONE | typeof LEFT | typeof RIGHT | typeof DONE | typeof PRE | typeof POST;

/**
 * Component for reading the input of a thumbstick and using that to effectively rotate the reference
 * in place in discrete steps. This is accomplished by rotating and moving the target. It's assumed that
 * the reference is a descendant of the target. This can be used on the camera rig to achieve snap turning.
 *
 * @emits rotation Target was rotated through this component. No movement is also signalled through
 *      the `motion` event
 * @emits prerotation  Target is about to rotate (only when a `delay` is configured)
 * @emits postrotation Target has just rotated (only when a `delay` is configured)
 *
 * @example
 * The `snap-turn` component needs to be applied to an entity that will emit the `axismove` event,
 * commonly one of the hands. Below is an example using a camera rig:
 * ```HTML
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>
 *
 *     <a-entity vive-controls="hand: right"
 *               oculus-touch-controls="hand: right"
 *               snap-turn="target: #rig; reference: #camera">
 *     </a-entity>
 * </a-entity>
 * ```
 *
 * In case a transition needs to be shown a delay can be configured. This delay is applied twice: before and
 * after the actual snap rotation. This can be used to make a quick fade transition for each snap turn,
 * see {@link AlSnapTurnFadePrimitive}
 */
const SnapTurnComponent = AFRAME.registerComponent('snap-turn', strict<{
    /**
     * The internal State of the snap turning process.
     */
    state: State,
    action: State,
    timer: number,
    nextAction: State,
    axisMoveListener: ListenerFor<'axismove'>
}>().component({
    schema: {
        /** Whether or not the snapturning is enabled */
        enabled:             { default: true },
        /** Selector for the target to apply rotation and translation to */
        target:              { type: 'selector' },
        /** Selector for the reference to 'effectively' rotate */
        reference:           { type: 'selector' },
        /** The rotation per snap (degrees) */
        turnSize:            { default: 45 },
        /** The amount the thumbstick needs to be pushed to activate a snap turn */
        activateThreshold:   { default: 0.9 },
        /** The threshold the thumbstick needs to cross before a new activation may take place */
        deactivateThreshold: { default: 0.8 },
        /** Optional delay applied before and after the actual snap rotation takes place */
        delay:               { default: 0, min: 0 }
    },
    init: function() {
        this.state = NONE;
        this.action = NONE;
        this.timer = 0;
        this.nextAction = NONE;

        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            const amount = axis.length > 2 ? axis[2] : axis[0];

            if(Math.abs(amount) > this.data.activateThreshold) {
                this.state = amount < 0 ? LEFT : RIGHT;
            } else if(Math.abs(amount) < this.data.deactivateThreshold) {
                this.state = NONE;
                if(this.action === DONE) {
                    this.action = NONE;
                }
            }

            if(this.state !== NONE && this.action === NONE) {
                if(this.data.delay) {
                    this.nextAction = this.state;
                    this.timer = this.data.delay;
                    this.action = PRE;
                } else {
                    this.action = this.state;
                }
            }
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: function(_t, dt) {
        if(!dt || !this.data.enabled || !this.data.reference || !this.data.target) {
            return;
        }

        if(this.action === PRE || this.action === POST) {
            this.timer -= dt/1000;
            if(this.timer < 0) {
                this.action = this.nextAction;
            } else {
                const event = this.action === PRE ? 'prerotation' : 'postrotation';
                const progress = (this.data.delay - this.timer) / this.data.delay;
                this.data.target.emit(event, { progress, source: this.el });
            }
        }

        let degrees = 0;
        if(this.action === LEFT) {
            degrees = this.data.turnSize;
        } else if(this.action === RIGHT) {
            degrees = -this.data.turnSize;
        } else {
            return;
        }

        this.data.target.emit('rotation', { degrees, source: this.el });
        rotateAroundWorldUp(this.data.target.object3D, this.data.reference.object3D, degrees);

        if(this.action === LEFT || this.action === RIGHT) {
            if(this.data.delay) {
                this.action = POST;
                this.nextAction = DONE;
                this.timer = this.data.delay;
            } else {
                this.action = DONE;
            }
        }
    },
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
}));

declare module "aframe" {
    export interface Components {
        "snap-turn": InstanceType<typeof SnapTurnComponent>,
    }
}