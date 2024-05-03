import type { DetailEvent } from 'aframe';

declare module "aframe" {
    export interface EntityEvents {
        "rotation": DetailEvent<{degrees: number, source: Entity}>,
        "prerotation": DetailEvent<{progress: number, source: Entity}>,
        "postrotation": DetailEvent<{progress: number, source: Entity}>,
        "motion": DetailEvent<{inputMagnitude: number, inAir: boolean, source: Entity}>
    }
}
