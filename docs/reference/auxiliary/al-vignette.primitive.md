# al-vignette
Primitive that shows a vignette when moving.

## Attributes
| Attribute | Maps to | Description | Type |
|-----------|---------|-------------|------|
| intensity | motion-input.maxOutput |  | `number` |
| motion-source | motion-input.source | Selector for the entity that is the target of a moving component (like SmoothLocomotionComponent). | `selector` |



## Example
The `al-vignette` primitive should be a direct child of the camera. The following shows
the primitive being used with smooth locomotion.
```HTML
<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
        <al-vignette motion-source="#rig"></al-vignette>
    </a-entity>

    <a-entity
        vive-controls="hand: left"
        oculus-touch-controls="hand: left"
        smooth-locomotion="target: #rig; reference: #camera">
    </a-entity>
</a-entity>
```

## Source
[`src/auxiliary/vignette.primitive.ts:45`](https://github.com/mrxz/aframe-locomotion/blob/9cb6c95/src/auxiliary/vignette.primitive.ts#L45)
