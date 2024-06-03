import { NavMeshStrategy } from "./strategy.interface";
import { castRay } from "./utils";
import * as THREE from "three";

const STEP_SIZE = 0.5;
// Based on https://github.com/AdaRoseCannon/aframe-xr-boilerplate/blob/glitch/simple-navmesh-constraint.js
const SCAN_PATTERN = [
    [0, 1],      // Default the next location
    [0, 0.5],    // Check that the path to that location was fine
    [30, 0.4],   // A little to the side shorter range
    [-30, 0.4],  // A little to the side shorter range
    [60, 0.2],   // Moderately to the side short range
    [-60, 0.2],  // Moderately to the side short range
    [80, 0.06],  // Perpendicular very short range
    [-80, 0.06], // Perpendicular very short range
];

export const scanNavMeshStrategy: NavMeshStrategy = (function() {
    const castPoint = new THREE.Vector3();
    const castOffset = new THREE.Vector3(0, STEP_SIZE, 0);
    const castDirection = new THREE.Vector3(0, -1, 0);

    const scanPoint = new THREE.Vector3();
    const direction = new THREE.Vector3();

    return {
        approveMovement: function(oldPosition, newPosition, navMeshes, candidateValidator) {
            const intersectionPointFor = (position: THREE.Vector3) => {
                castPoint.addVectors(position, castOffset);
                const intersections = castRay(castPoint, castDirection, navMeshes);
                if(intersections.length !== 0) {
                    return intersections[0].point;
                }
                return null;
            }

            direction.subVectors(newPosition, oldPosition);
            for(const [angle, distance] of SCAN_PATTERN) {
                scanPoint.copy(direction);
                scanPoint.applyAxisAngle(castDirection, angle * Math.PI/180);
                scanPoint.multiplyScalar(distance);
                scanPoint.add(oldPosition);

                const intersectionPoint = intersectionPointFor(scanPoint);
                if(!intersectionPoint) {
                    continue;
                }

                if(!candidateValidator(scanPoint, intersectionPoint)) {
                    continue;
                }

                newPosition.copy(scanPoint)

                // Check if new position is a step up.
                if(intersectionPoint.y > newPosition.y) {
                    newPosition.y = intersectionPoint.y;
                }

                return {
                    result: true,
                    position: newPosition,
                    ground: intersectionPoint
                };
            }

            // No suitable position found
            return {
                result: false,
                position: oldPosition
            };
        }
    }
})();