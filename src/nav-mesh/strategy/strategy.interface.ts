import type { THREE } from 'aframe';

type StrategyResult = {
    result: false,
    position: THREE.Vector3,
    ground: undefined,
} | {
    result: true,
    position: THREE.Vector3,
    ground: THREE.Vector3
};

export type CandidateValidator = (candidate: THREE.Vector3, ground: THREE.Vector3) => boolean;

export interface NavMeshStrategy {
    approveMovement(
        oldPosition: THREE.Vector3,
        newPosition: THREE.Vector3,
        navMeshes: Array<THREE.Mesh>,
        candidateValidator: CandidateValidator): StrategyResult;
};
