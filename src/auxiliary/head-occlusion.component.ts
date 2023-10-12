import { THREE } from 'aframe';
import { assertComponent, strict } from 'aframe-typescript';
import { WebXRCamera } from 'three';

/** @internal */
export const HeadOcclusionComponent = AFRAME.registerComponent('head-occlusion', strict().override<'tick'>().component({
    schema: {
        objects:   { type: 'selectorAll' },
        property:  { type: 'string' },

        depth:     { type: 'number', default: 10, min: 1, max: 100 },
    },
    tick: (function() {
        const raycaster = new THREE.Raycaster();
        const origin = new THREE.Vector3();
        const direction = new THREE.Vector3();

        return function(this: any, _t: number, dt: number) {
            assertComponent<InstanceType<typeof HeadOcclusionComponent>>(this);
            if(!dt || !this.data.property) {
                return;
            }

            const meshes = this.data.objects
                .map(el => el.getObject3D('mesh'))
                .filter(mesh => mesh);
            if(meshes.length == 0) {
                return;
            }

            const camera = this.el.sceneEl.renderer.xr.getCamera();
            if((camera.cameras as Array<WebXRCamera>).length === 0) {
                return;
            }

            // Cast ray from above down to the head
            origin.setFromMatrixPosition(camera.matrixWorld);
            direction.set(0, -1, 0);

            origin.addScaledVector(direction, -this.data.depth);
            raycaster.set(origin, direction);
            raycaster.far = this.data.depth;

            const intersectionsD = raycaster.intersectObjects(meshes, true);

            // Cast ray from in the head upwards
            origin.setFromMatrixPosition(camera.matrixWorld);
            direction.multiplyScalar(-1);
            raycaster.set(origin, direction);

            const intersectionsU = raycaster.intersectObjects(meshes, true);

            const value = intersectionsD.length > intersectionsU.length ? 1: 0;
            AFRAME.utils.entity.setComponentProperty(this.el, this.data.property, value);
        };
    })()
}));

declare module "aframe" {
    export interface Components {
        "head-occlusion": InstanceType<typeof HeadOcclusionComponent>,
    }
}