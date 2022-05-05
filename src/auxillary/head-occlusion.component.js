AFRAME.registerComponent('head-occlusion', {
    schema: {
        reference: { type: 'selector' },
        objects:   { type: 'selectorAll' },
        property:  { type: 'string' },

        depth:     { type: 'number', default: 10, min: 1, max: 100 }
    },
    init: function() {

    },
    tick: (function() {
        const raycaster = new THREE.Raycaster();
        const origin = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const referenceWorldRot = new THREE.Quaternion();

        return function(t, dt) {
            if(!dt || !this.data.reference || !this.data.property) {
                return;
            }

            const meshes = this.data.objects
                .map(el => el.getObject3D('mesh'))
                .filter(mesh => mesh);
            if(meshes.length == 0) {
                return;
            }

            // Cast ray from above down to the head
            this.data.reference.object3D.getWorldPosition(origin);
            direction.set(0, -1, 0);

            origin.addScaledVector(direction, -this.data.depth);
            raycaster.set(origin, direction);
            raycaster.far = this.data.depth;

            const intersectionsD = raycaster.intersectObjects(meshes, true);

            // Cast ray from in the head upwards
            this.data.reference.object3D.getWorldPosition(origin);
            direction.multiplyScalar(-1);
            raycaster.set(origin, direction);

            const intersectionsU = raycaster.intersectObjects(meshes, true);

            const value = intersectionsD.length > intersectionsU.length ? 1: 0;
            AFRAME.utils.entity.setComponentProperty(this.el, this.data.property, value);
        };
    })()
});