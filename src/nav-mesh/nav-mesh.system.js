import { simpleNavMeshStrategy } from "./strategy/simple-strategy";

AFRAME.registerSystem('nav-mesh', {
    schema: {},
    active: false,

    init: function() {
        this.navMeshEntities = [];
        this.navMeshes = [];
        this.navMeshStrategy = simpleNavMeshStrategy;
    },

    registerNavMesh: function(el) {
        this.navMeshEntities.push(el);
        this.updateNavMeshes();
    },

    unregisterNavMesh: function(el) {
        var index = this.navMeshEntities.indexOf(el);
        this.navMeshEntities.splice(index, 1);
        this.updateNavMeshes();
    },

    updateNavMeshes: function() {
        this.navMeshes = this.navMeshEntities
            .map(el => el.getObject3D('mesh'))
            .filter(mesh => mesh);
    },

    approveMovement: function(oldPosition, newPosition) {
        return this.navMeshStrategy.approveMovement(oldPosition, newPosition, this.navMeshes);
    }
});