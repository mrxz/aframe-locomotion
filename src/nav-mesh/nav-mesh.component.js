AFRAME.registerComponent('nav-mesh', {
    schema: {},
    init: function() {
        this.system.registerNavMesh(this.el);
    },

    remove: function() {
        this.system.unregisterNavMesh(this.el);
    }
});