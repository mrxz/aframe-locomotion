import { Components, THREE } from 'aframe';
import { assertComponent, strict } from "aframe-typescript";
import { CandidateValidator } from '../nav-mesh/strategy/strategy.interface';

interface VelocityComponent {
    getVelocity(): THREE.Vector3
};
const VELOCITY_COMPONENTS: Array<keyof Components> = ['gravity'];

/**
 * Component for reading the input of a thumbstick and converting that into motion on a target entity.
 * The rotation of the reference is used to determine the direction to move in. This can be used on a
 * camera rig to move around the world using either head orientation or controller orientation.
 *
 * @example
 * The `smooth-locomotion` component needs to be applied to an entity that will emit the `axismove` event,
 * commenly one of the hands. Below is an example using a camera rig to enable smooth locomotion using the
 * thumbstick on the left controller and using head orientation:
 * ```HTML
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>
 *
 *     <a-entity id="leftHand"
 *               vive-controls="hand: left"
 *               oculus-touch-controls="hand: left"
 *               smooth-locomotion="target: #rig; reference: #camera">
 *     </a-entity>
 * </a-entity>
 * ```
 *
 * To use controller orientation instead, change the reference to the controller, as such:
 * ```HTML
 * <a-entity id="leftHand"
 *             vive-controls="hand: left"
 *             oculus-touch-controls="hand: left"
 *             smooth-locomotion="target: #rig; reference: #leftHand">
 * </a-entity>
 * ```
 */
export const SmoothLocomotionComponent = AFRAME.registerComponent('smooth-locomotion', strict<{
    inputDirection: { x: number, y: number },
    axisMoveListener: (e: any) => void,
}>().override<'tick'>().component({
    schema: {
        /** Whether the smooth locomotion is active or not */
        enabled:    { default: true },
        /** Selector for the target of the motion */
        target:     { type: 'selector' },
        /** Selector for the reference to determine world position and rotation */
        reference:  { type: 'selector' },
        /** The (max) speed for the target (m/s) */
        moveSpeed:  { default: 1.5 },
        /** Whether or not forward movement should be applied */
        forward:    { default: true },
        /** Whether or not backward movement should be applied */
        backward:   { default: true },
        /** Whether or not sideways movement should be applied */
        sideways:   { default: true },
        /**
         * The mode for interpreting the input. With the `binary` mode even small inputs will result in
         * maximum speed being applied. The `analog` mode will scale the applied speed between 0 and moveSpeed
         * based on the input magnitude
         */
        inputMode:  { default: 'binary' },
        /**
         * The mode for how falling should be handled in case the reference is moving off an edge. With `snap`
         * the reference will always snap to the ground, instantly dropping down. With `prevent` the reference
         * won't be moved over the edge. With `fall` the reference is moved over the edge, but not forced/snapped
         * to the ground, allowing it to fall down. (Only applies when using the {@link NavMeshSystem})
         */
        fallMode:   { default: 'fall' }
    },
    init: function() {
        this.inputDirection = { x: 0, y: 0 };
        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            if(axis.length > 2) {
                // Oculus
                this.inputDirection.x = axis[2];
                this.inputDirection.y = axis[3];
            } else {
                // Vive/Index
                this.inputDirection.x = axis[0];
                this.inputDirection.y = axis[1];
            }
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: (function() {
        const direction = new THREE.Vector3();
        const referenceWorldRot = new THREE.Quaternion();
        const newPosition = new THREE.Vector3();
        const movement = new THREE.Vector3();
        const velocity = new THREE.Vector3();

        const oldRefPosition = new THREE.Vector3();
        const newRefPosition = new THREE.Vector3();

        return function(this: any, _t: number, dt: number) {
            assertComponent<InstanceType<typeof SmoothLocomotionComponent>>(this);
            if(!dt || !this.data.enabled || !this.el.sceneEl.is('vr-mode')) {
                return;
            }

            // Handle input
            direction.set(this.inputDirection.x, 0, this.inputDirection.y);
            if(!this.data.sideways) {
                direction.x = 0;
            }
            if(direction.z < 0 && !this.data.backward) {
                direction.z = 0;
            } else if(!this.data.forward) {
                direction.z = 0;
            }

            // Determine the magnitude of the input
            const binaryInputMode = this.data.inputMode === 'binary';
            const inputMagnitude = binaryInputMode ? Math.ceil(direction.length()) : Math.min(direction.length(), 1.0);

            // Handle velocity (falling, moving platforms, conveyors, etc...)
            velocity.set(0, 0, 0);
            for(let component of VELOCITY_COMPONENTS) {
                if(this.data.target!.hasAttribute(component)) {
                    velocity.add((this.data.target!.components[component]! as unknown as VelocityComponent).getVelocity());
                }
            }

            // Direction is relative to the reference's rotation
            this.data.reference!.object3D.getWorldQuaternion(referenceWorldRot);
            direction.applyQuaternion(referenceWorldRot);

            // Ignore vertical component
            direction.y = 0;
            direction.normalize();

            const oldPosition = this.data.target!.object3D.position;
            movement.set(0, 0, 0)
                .addScaledVector(velocity, dt / 1000)
                .addScaledVector(direction, inputMagnitude * this.data.moveSpeed * dt / 1000);

            let inAir = false;

            // Check if the nav-mesh system allows the movement
            const navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
            if(navMeshSystem && navMeshSystem.active) {
                // NavMeshSystem needs the old and new world position of the reference.
                this.data.reference!.object3D.getWorldPosition(oldRefPosition);
                // Project the position onto the 'floor' of the target
                oldRefPosition.y -= oldRefPosition.y - oldPosition.y;
                newRefPosition.copy(oldRefPosition).add(movement);

                const candidateValidator: CandidateValidator = this.data.fallMode === 'prevent' ?
                    (candidate, ground) => candidate.y - ground.y < 0.5 :
                    (_candidate, _ground) => true;
                const navResult = navMeshSystem.approveMovement(oldRefPosition, newRefPosition, candidateValidator);
                const height = navResult.result ? navResult.position.y - navResult.ground.y : 100;

                if(this.data.fallMode === 'fall') {
                    if(height < 0.5) {
                        movement.copy(navResult.ground!);
                    } else {
                        inAir = true;
                        movement.copy(navResult.position);
                    }
                } else if(this.data.fallMode === 'snap') {
                    if(navResult.ground) {
                        movement.copy(navResult.ground);
                    }
                } else if(this.data.fallMode === 'prevent') {
                    movement.copy(navResult.result ? navResult.ground : navResult.position);
                }

                // Compute adjusted movement
                movement.sub(oldRefPosition);
            }

            newPosition.copy(oldPosition).add(movement);
            this.data.target!.object3D.position.copy(newPosition);

            // Emit event on the target, so others interested in the target's movement can react
            this.data.target!.emit('motion', { inputMagnitude, inAir, source: this.el }, false)
        }
    })(),
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
}));