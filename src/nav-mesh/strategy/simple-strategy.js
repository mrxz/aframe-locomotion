import { castRay } from "./utils";

const STEP_SIZE = 0.5;

export const simpleNavMeshStrategy = (function() {
    const castPoint = new THREE.Vector3();
    const castOffset = new THREE.Vector3(0, STEP_SIZE, 0);
    const castDirection = new THREE.Vector3(0, -1, 0);

    return {
        approveMovement: function(oldPosition, newPosition, navMeshes) {
            castPoint.copy(newPosition).add(castOffset);
            const intersections = castRay(castPoint, castDirection, navMeshes);

            // No nav mesh below the new position, so disapprove
            if(intersections.length === 0) {
                return {
                    result: false,
                    position: oldPosition
                };
            }

            // Check if new position is a step up.
            const intersectionPoint = intersections[0].point;
            if(intersectionPoint.y > newPosition.y) {
                newPosition.y = intersectionPoint.y;
            }

            return {
                result: true,
                position: newPosition,
                ground: intersectionPoint
            };
        }
    }
})();