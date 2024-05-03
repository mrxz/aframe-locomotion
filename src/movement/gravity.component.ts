import * as AFRAME from "aframe";
import { THREE } from "aframe";
import type { EntityEvents } from "aframe";
import type { SmoothLocomotionComponent } from "../movement/smooth-locomotion.component";

/**
 * This component is a 'velocity' component and can be used to influence
 * motion based components like {@link SmoothLocomotionComponent}.
 * On its own the component won't do anything.
 *
 * @remarks
 * The `gravity` component should be applied to the target of motion.
 * When using {@link SmoothLocomotionComponent} with the default camera rig,
 * the rig element is the target and should have the `gravity` component on it.
 *
 * @example
 * ```HTML
 * <a-entity id="rig" gravity>
 *   <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>
 *
 *   <a-entity vive-controls="hand: left"
 *             oculus-touch-controls="hand: left"
 *             smooth-locomotion="target: #rig; reference: #camera">
 *   </a-entity>
 * </a-entity>
 * ```
 */
export const GravityComponent = AFRAME.registerComponent('gravity', {
    schema: {
        /** The gravitational acceleration in m/s^2 */
        strength: { default: 9.81 }
    },
    __fields: {} as {
        inAir: boolean;
        velocity: THREE.Vector3;
        motionEventHandler: AFRAME.ListenerFor<'motion'>;
    },
    init: function() {
        this.inAir = false;
        this.velocity = new THREE.Vector3();
        this.motionEventHandler = (event: EntityEvents['motion']) => {
            this.inAir = event.detail.inAir;
            if(!this.inAir) {
                this.velocity.set(0, 0, 0);
            }
        };
        this.el.addEventListener('motion', this.motionEventHandler);
    },
    getVelocity: function() {
        return this.velocity;
    },
    tick: function(_t, dt) {
        if(this.inAir) {
            this.velocity.y -= this.data.strength * dt/1000;
        }
    },
    remove: function() {
        this.el.removeEventListener('motion', this.motionEventHandler);
    }
});

declare module "aframe" {
    export interface Components {
        "gravity": InstanceType<typeof GravityComponent>,
    }
}