import { Components, THREE } from 'aframe';
import { assertComponent, strict } from "aframe-typescript";
import { CandidateValidator } from '../nav-mesh/strategy/strategy.interface';

interface VelocityComponent {
    getVelocity(): THREE.Vector3
};
const VELOCITY_COMPONENTS: Array<keyof Components> = ['gravity'];

export const SmoothLocomotionComponent = AFRAME.registerComponent('smooth-locomotion', strict<{
    inputDirection: { x: number, y: number },
    axisMoveListener: (e: any) => void,
}>().override<'tick'>().component({
    schema: {
        enabled:    { default: true },
        target:     { type: 'selector' },
        reference:  { type: 'selector' },
        moveSpeed:  { default: 1.5 },
        // Toggles for the directions
        forward:    { default: true },
        backward:   { default: true },
        sideways:   { default: true },
        inputMode:  { default: 'binary' },
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
                    velocity.add((<VelocityComponent>this.data.target!.components[component]!).getVelocity());
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