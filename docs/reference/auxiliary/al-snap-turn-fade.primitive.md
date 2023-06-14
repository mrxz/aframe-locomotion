# al-snap-turn-fade
Primitive that fades the view in/out when snap-turning. Requires the usage of [`snap-turn`](../movement/snap-turn.component.md).

## Attributes
| Attribute | Maps to | Description | Type |
|-----------|---------|-------------|------|
| rotation-source | rotation-input.source | Selector for the entity that is rotated. This should be the target of [`snap-turn`](../movement/snap-turn.component.md) | `selector` |



## Example
The `al-snap-turn-fade` primitive should be a direct child of the camera. The following shows
the primitive being used with snap-turning. Notice the configured delay, without it the snap
is instant and no fade will take place:
```HTML
<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls>
        <al-snap-turn-fade rotation-source="#rig"></al-snap-turn-fade>
    </a-entity>

    <a-entity vive-controls="hand: right"
              oculus-touch-controls="hand: right"
              snap-turn="target: #rig; reference: #camera; delay: 0.1">
    </a-entity>
</a-entity>
```


## Source
[`src/auxiliary/fade.primitive.ts:42`](https://github.com/mrxz/aframe-locomotion/blob/215b9f9/src/auxiliary/fade.primitive.ts#L42)
