import * as AFRAME from "aframe";
import { THREE } from "aframe";
import type { Systems } from "aframe";
import { CandidateValidator } from "../nav-mesh/strategy/strategy.interface";

const tempV3 = new THREE.Vector3();

/** @internal */
export const NavMeshConstrainedComponent = AFRAME.registerComponent('nav-mesh-constrained', {
    schema: {
        /**
         * Offset for the raycasting to take place, commonly used to offset the raycast upwards.
         */
        offset:   { type: 'vec3' },
        fallMode: { default: 'snap' }
    },
    __fields: {} as {
        locomotionSystem: Systems['locomotion'];
        navMeshSystem: Systems['nav-mesh'];

        lastPosition: THREE.Vector3;
    },
    init: function() {
        this.locomotionSystem = this.el.sceneEl.systems['locomotion'];
        this.navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
        this.locomotionSystem.addPostMotionCallback(this);

        this.lastPosition = new THREE.Vector3();
    },
    postMotion: function() {
        if(!this.navMeshSystem || !this.navMeshSystem.active) {
            return;
        }

        const lastPosition = this.lastPosition;
        const newPosition = this.el.object3D.getWorldPosition(tempV3);
        newPosition.sub(this.data.offset as THREE.Vector3);

        const candidateValidator: CandidateValidator = this.data.fallMode === 'prevent' ?
            (candidate, ground) => candidate.y - ground.y < 0.5 :
            (_candidate, _ground) => true;
        const navResult = this.navMeshSystem.approveMovement(lastPosition, newPosition, candidateValidator);
        const suggestedPosition = navResult.result ? navResult.ground : navResult.position;
        suggestedPosition.add(this.data.offset as THREE.Vector3);

        this.el.object3D.parent!.worldToLocal(suggestedPosition);
        this.el.object3D.position.copy(suggestedPosition);

        this.el.object3D.getWorldPosition(lastPosition);
        lastPosition.sub(this.data.offset as THREE.Vector3);
    },
    remove: function() {
        this.locomotionSystem.removePostMotionCallback(this);
    }
});

declare module "aframe" {
    export interface Components {
        "nav-mesh-constrained": InstanceType<typeof NavMeshConstrainedComponent>,
    }
}