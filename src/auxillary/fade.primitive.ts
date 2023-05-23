import * as AFRAME from "aframe";

AFRAME.registerShader('fade', {
    schema: {
        'color': { type: "vec3", is: 'uniform' },
        'intensity': { type: "number", default: 0.0, max: 1.0, min: 0.0, is: 'uniform' }
    },
    vertexShader:
        'void main() {' +
            'vec3 newPosition = position * 2.0;' +
            'gl_Position = vec4(newPosition, 1.0);' +
        '}',
    fragmentShader:
        'uniform vec3 color;' +
        'uniform float intensity;' +
        'void main() {' +
            'gl_FragColor = vec4(color, intensity);' +
        '}',
});

/**
 * Primitive that fades the view in/out when snap-turning. Requires the usage of {@link SnapTurnComponent}.
 *
 * @example
 * The `al-snap-turn-fade` primitive should be a direct child of the camera. The following shows
 * the primitive being used with snap-turning. Notice the configured delay, without it the snap
 * is instant and no fade will take place:
 * ```HTML
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
 *         <al-snap-turn-fade rotation-source="#rig"></al-snap-turn-fade>
 *     </a-entity>
 *
 *     <a-entity vive-controls="hand: right"
 *               oculus-touch-controls="hand: right"
 *               snap-turn="target: #rig; reference: #camera; delay: 0.1">
 *     </a-entity>
 * </a-entity>
 * ```
 */
export const AlSnapTurnFadePrimitive = AFRAME.registerPrimitive('al-snap-turn-fade', {
    defaultComponents: {
        material: { shader: 'fade', transparent: true, depthTest: false },
        geometry: { primitive: 'plane' },
        'rotation-input': { property: 'material.intensity' },
        "nav-mesh-constrained": {}
    },
    mappings: {
        /** Selector for the entity that is rotated. This should be the target of {@link SnapTurnComponent} */
        'rotation-source': 'rotation-input.source',
    }
});

/**
 * Primitive that fades the view in/out when the head is placed inside an wall or object.
 *
 * @example
 * The `al-head-occlusion-fade` primitive should be a direct child of the camera. The following shows
 * the primitive being used.
 * ```HTML
 * <a-box class="box"></a-box>
 *
 * <a-entity id="rig">
 *     <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
 *         <al-head-occlusion-fade objects=".box"></al-head-occlusion-fade>
 *     </a-entity>
 * </a-entity>
 * ```
 *
 * > **Note:** The head occlusion detection uses the XR camera, meaning it won't activate when vr-mode isn't
 * > active. If this is something you need/want, please open a new issue on GitHub and indicate your use case.
 */
export const AlHeadOcclusionFadePrimitive = AFRAME.registerPrimitive('al-head-occlusion-fade', {
    defaultComponents: {
        material: { shader: 'fade', transparent: true, depthTest: false },
        geometry: { primitive: 'plane' },
        'head-occlusion': { property: 'material.intensity' }
    },
    mappings: {
        /** Selector for all the objects to check head occlusion for */
        objects: 'head-occlusion.objects'
    }
});