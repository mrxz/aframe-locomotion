import { THREE } from "aframe";

export const castRay = (function() {
    const raycaster = new THREE.Raycaster();
    return function(position: THREE.Vector3, direction: THREE.Vector3, meshes: Array<THREE.Object3D>) {
        raycaster.set(position, direction);
        return raycaster.intersectObjects(meshes, true);
    }
})();