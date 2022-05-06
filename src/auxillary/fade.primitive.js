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

AFRAME.registerPrimitive('al-snap-turn-fade', {
    defaultComponents: {
        material: { shader: 'fade', transparent: true, depthTest: false },
        geometry: { primitive: 'plane' },
        'rotation-input': { property: 'material.intensity' }
    },
    mappings: {
        'rotation-source': 'rotation-input.source',
    }
});

AFRAME.registerPrimitive('al-head-occlusion-fade', {
    defaultComponents: {
        material: { shader: 'fade', transparent: true, depthTest: false },
        geometry: { primitive: 'plane' },
        'head-occlusion': { property: 'material.intensity' }
    },
    mappings: {
        objects: 'head-occlusion.objects'
    }
});