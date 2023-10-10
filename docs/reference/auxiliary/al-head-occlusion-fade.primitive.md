# al-head-occlusion-fade
Primitive that fades the view in/out when the head is placed inside an wall or object.

## Attributes
| Attribute | Maps to | Description | Type | Default Value |
|-----------|---------|-------------|------|---------------|
| objects | head-occlusion.objects | Selector for all the objects to check head occlusion for | `selectorAll` |  |



## Example
The `al-head-occlusion-fade` primitive should be a direct child of the camera. The following shows
the primitive being used.
```HTML
<a-box class="box"></a-box>

<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
        <al-head-occlusion-fade objects=".box"></al-head-occlusion-fade>
    </a-entity>
</a-entity>
```

> **Note:** The head occlusion detection uses the XR camera, meaning it won't activate when vr-mode isn't
> active. If this is something you need/want, please open a new issue on GitHub and indicate your use case.


## Source
[`src/auxiliary/fade.primitive.ts:74`](https://github.com/mrxz/aframe-locomotion/blob/15e65c2/src/auxiliary/fade.primitive.ts#L74)
