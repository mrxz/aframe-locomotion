const STEP_SIZE = 0.5;

export const simpleNavMeshStrategy = (function() {
    const castPoint = new THREE.Vector3();
    const castOffset = new THREE.Vector3(0, STEP_SIZE, 0);
    const castDirection = new THREE.Vector3(0, -1, 0);
    const raycaster = new THREE.Raycaster();

    return {
        approveMovement: function(oldPosition, newPosition, navMeshes) {
            castPoint.copy(newPosition).add(castOffset);
            raycaster.set(castPoint, castDirection);
            const intersections = raycaster.intersectObjects(navMeshes, true);

            if(intersections.length === 0) {
                return oldPosition;
            }

            const intersectionPoint = intersections[0].point;
            newPosition.y = intersectionPoint.y;
            return newPosition;
        }
    }
})();