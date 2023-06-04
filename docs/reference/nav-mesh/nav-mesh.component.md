# nav-mesh
This component marks an object as a nav mesh, which can be used in motion.
This component only has an effect when the nav-mesh system is activated by
picking a [`nav-mesh-strategy`](nav-mesh-strategy.component.md).

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| This component has no properties ||||



## Example
Mark any entity that holds a navigation mesh:
```HTML
<a-entity gltf-model="url(assets/navmesh.glb)" nav-mesh></a-entity>
```

> **Note:** In many cases the navigation meshes should not be visible.
The `nav-mesh` component doesn't handle this for you, so make sure to manually add
`material="visible: false"` or hide the mesh in some other way.

## Source
[`src/nav-mesh/nav-mesh.component.ts:18`](https://github.com/mrxz/aframe-locomotion/blob/9cb6c95/src/nav-mesh/nav-mesh.component.ts#L18)
