import { AlHeadOcclusionFadePrimitive, AlSnapTurnFadePrimitive, AlVignettePrimitive, HeadOcclusionComponent, MotionInputComponent, NavMeshConstrainedComponent, RotationInputComponent } from './auxillary/index';
import { GravityComponent, SmoothLocomotionComponent, SmoothTurnComponent, SnapTurnComponent } from './movement/index';
import { NavMeshComponent, NavMeshStrategyComponent, NavMeshSystem } from './nav-mesh/index';

export * from './auxillary/index';
export * from './movement/index';
export * from './nav-mesh/index';

declare module "aframe" {
    export interface Systems {
        "nav-mesh": InstanceType<typeof NavMeshSystem>
    }

    export interface Components {
        "head-occlusion": InstanceType<typeof HeadOcclusionComponent>,
        "motion-input": InstanceType<typeof MotionInputComponent>,
        "nav-mesh-constrained": InstanceType<typeof NavMeshConstrainedComponent>,
        "rotation-input": InstanceType<typeof RotationInputComponent>,
        "gravity": InstanceType<typeof GravityComponent>,
        "smooth-locomotion": InstanceType<typeof SmoothLocomotionComponent>,
        "smooth-turn": InstanceType<typeof SmoothTurnComponent>,
        "snap-turn": InstanceType<typeof SnapTurnComponent>,
        "nav-mesh-strategy": InstanceType<typeof NavMeshStrategyComponent>,
        "nav-mesh": InstanceType<typeof NavMeshComponent>,
    }

    export interface Primitives {
        "al-head-occlusion-fade": typeof AlHeadOcclusionFadePrimitive,
        "al-snap-turn-fade": typeof AlSnapTurnFadePrimitive,
        "al-vignette": typeof AlVignettePrimitive,
    }
}