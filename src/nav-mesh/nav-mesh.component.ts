import * as AFRAME from "aframe";

export const NavMeshComponent = AFRAME.registerComponent('nav-mesh', {
    schema: {},
    init: function() {
        this.el.addEventListener('model-loaded', (_) => {
            this.system.updateNavMeshes();
        });
        this.system.registerNavMesh(this.el);
    },

    remove: function() {
        this.system.unregisterNavMesh(this.el);
    }
});
