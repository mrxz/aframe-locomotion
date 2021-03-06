# al-vignette
Primitive that shows a vignette when moving.

## Attributes
| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| motion-source | Selector for the entity that is the target of a moving component (like [`smooth-locomotion`](../movement/smooth-locomotion.component.md)). | none |

## Usage
The `al-vignette` primitive should be a direct child of the camera. The following shows the primitive being used with smooth locomotion.
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