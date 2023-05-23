import * as AFRAME from "aframe";

/**
 * This component marks an object as a nav mesh, which can be used in motion.
 * This component only has an effect when the nav-mesh system is activated by
 * picking a {@link NavMeshStrategyComponent}.
 *
 * @example
 * Mark any entity that holds a navigation mesh:
 * ```HTML
 * <a-entity gltf-model="url(assets/navmesh.glb)" nav-mesh></a-entity>
 * ```
 *
 * > **Note:** In many cases the navigation meshes should not be visible.
 * The `nav-mesh` component doesn't handle this for you, so make sure to manually add
 * `material="visible: false"` or hide the mesh in some other way.
 */
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
