import * as AFRAME from "aframe";

export const VignetteShader = AFRAME.registerShader('vignette', {
    schema: {
        'intensity': { type: "number", default: 2, max: 10, min: 0, is: 'uniform' }
    },
    vertexShader:
        'out vec2 coord;' +
        'void main() {' +
            'vec3 newPosition = position * 2.0;' +
            'coord = vec2(newPosition.x, newPosition.y);' +
            'gl_Position = vec4(newPosition, 1.0);' +
        '}',
    fragmentShader:
        'uniform float intensity;' +
        'in vec2 coord;' +
        'void main() {' +
            'float distance = length(coord);'+
            'distance *= distance;' +
            'distance *= intensity;' +
            'gl_FragColor = vec4(0.0, 0.0, 0.0, distance);' +
        '}',
});

/**
 * Primitive that shows a vignette when moving.
 *
 * @example
 * The `al-vignette` primitive should be a direct child of the camera. The following shows
 * the primitive being used with smooth locomotion.
 * ```HTML
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
 *         <al-vignette motion-source="#rig"></al-vignette>
 *     </a-entity>
 *
 *     <a-entity
 *         vive-controls="hand: left"
 *         oculus-touch-controls="hand: left"
 *         smooth-locomotion="target: #rig; reference: #camera">
 *     </a-entity>
 * </a-entity>
 * ```
 */
export const AlVignettePrimitive = AFRAME.registerPrimitive('al-vignette', {
    defaultComponents: {
        material: { shader: 'vignette', transparent: true },
        geometry: { primitive: 'plane' },
        'motion-input': { property: 'material.intensity', minOutput: 0, maxOutput: 2 }
    },
    mappings: {
        /** Selector for the entity that is the target of a moving component (like {@link SmoothLocomotionComponent}). */
        'motion-source': 'motion-input.source',
        'intensity': 'motion-input.maxOutput',
    }
});