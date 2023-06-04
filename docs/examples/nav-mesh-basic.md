---
template: example.html
---

### Code
```HTML
<a-scene background="color: gray" embedded nav-mesh-strategy>
    <!-- Environment -->
    <a-entity gltf-model="url(../assets/navmesh.glb)" nav-mesh></a-entity>

    <!-- Camera rig -->
    <a-entity id="rig" gravity>
        <a-camera id="camera" nav-mesh-constrained="offset: 0 1.6 0"></a-camera>

        <!-- Hands -->
        <a-entity hand-controls="hand: left" smooth-locomotion="target: #rig; reference: #camera"></a-entity>
        <a-entity hand-controls="hand: right" snap-turn="target: #rig; reference: #camera"></a-entity>
    </a-entity>
</a-scene>
```

### See Also
 - [nav-mesh-strategy component](../reference/nav-mesh/nav-mesh-strategy.component.md)
 - [nav-mesh component](../reference/nav-mesh/nav-mesh.component.md)
