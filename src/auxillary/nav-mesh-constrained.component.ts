import * as AFRAME from "aframe";
import { Systems, THREE } from "aframe";
import { assertComponent, strict } from "aframe-typescript";
import { CandidateValidator } from "../nav-mesh/strategy/strategy.interface";

export const NavMeshConstrainedComponent = AFRAME.registerComponent('nav-mesh-constrained', strict<{
    navMeshSystem: Systems['nav-mesh']
}>().override<'tick'>().component({
    schema: {
        offset:   { type: 'vec3' },
        fallMode: { default: 'snap' }
    },
    init: function() {
        this.navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
    },
    tick: (function() {
        const lastPosition = new THREE.Vector3();
        const newPosition = new THREE.Vector3();

        return function(this: any, _t: number, dt: number) {
            assertComponent<InstanceType<typeof NavMeshConstrainedComponent>>(this);
            if(!dt || !this.navMeshSystem || !this.navMeshSystem.active) {
                return;
            }

            this.el.object3D.getWorldPosition(newPosition);
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
        }
    })()
}));