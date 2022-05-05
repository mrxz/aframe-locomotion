export const castRay = (function() {
    const raycaster = new THREE.Raycaster();
    return function(position, direction, meshes) {
        raycaster.set(position, direction);
        return raycaster.intersectObjects(meshes, true);
    }
})();