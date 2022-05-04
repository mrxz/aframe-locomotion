
AFRAME.registerShader('vignette', {
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

AFRAME.registerPrimitive('al-vignette', {
    defaultComponents: {
        material: { shader: 'vignette', transparent: true },
        geometry: { primitive: 'plane' },
        'motion-input': { property: 'material.intensity', minOutput: 0, maxOutput: 2 }
    },
    mappings: {
        'motion-source': 'motion-input.source',
        'intensity': 'motion-input.maxOutput',
    }
});