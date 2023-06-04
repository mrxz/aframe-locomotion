---
template: example.html
---

### Code
```HTML
<a-scene background="color: gray" embedded>
    <!-- Simple scene -->
    <a-box scale="20 20 20" position="0 -10 0" material="src: url(../assets/grid.png); repeat: 20 20"></a-box>
    <a-sphere color="red" radius="0.2" scale="1 0.2 1"></a-sphere>

    <!-- Camera rig -->
    <a-entity id="rig">
        <a-camera id="camera"></a-camera>

        <!-- Hands -->
        <a-entity hand-controls="hand: left" smooth-locomotion="target: #rig; reference: #camera"></a-entity>
        <a-entity hand-controls="hand: right" snap-turn="target: #rig; reference: #camera"></a-entity>
    </a-entity>
</a-scene>
```

### See Also
 - [smooth-locomotion component](../reference/movement/smooth-locomotion.component.md)
 - [snap-turn component](../reference/movement/snap-turn.component.md)
