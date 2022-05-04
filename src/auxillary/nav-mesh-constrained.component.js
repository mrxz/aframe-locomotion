AFRAME.registerComponent('nav-mesh-constrained', {
    schema: {},
    init: function() {
        this.navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
    },
    tick: (function() {
        const lastPosition = new THREE.Vector3();
        const newPosition = new THREE.Vector3();

        return function(t, dt) {
            if(!dt || !this.navMeshSystem || !this.navMeshSystem.active) {
                return;
            }

            this.el.object3D.getWorldPosition(newPosition);

            const approvedPosition = this.navMeshSystem.approveMovement(lastPosition, newPosition);

            this.el.object3D.parent.worldToLocal(approvedPosition);
            this.el.object3D.position.copy(approvedPosition);

            this.el.object3D.getWorldPosition(lastPosition);
        }
    })()
})