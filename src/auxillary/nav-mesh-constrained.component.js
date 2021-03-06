AFRAME.registerComponent('nav-mesh-constrained', {
    schema: {
        offset:   { type: 'vec3' },
        fallMode: { default: 'snap' }
    },
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
            newPosition.sub(this.data.offset);

            const candidateValidator = this.data.fallMode === 'prevent' ?
                (candidate, ground) => candidate.y - ground.y < 0.5 :
                (candidate, ground) => true;
            const navResult = this.navMeshSystem.approveMovement(lastPosition, newPosition, candidateValidator);
            const suggestedPosition = navResult.result ? navResult.ground : navResult.position;
            suggestedPosition.add(this.data.offset);

            this.el.object3D.parent.worldToLocal(suggestedPosition);
            this.el.object3D.position.copy(suggestedPosition);

            this.el.object3D.getWorldPosition(lastPosition);
            lastPosition.sub(this.data.offset);
        }
    })()
})