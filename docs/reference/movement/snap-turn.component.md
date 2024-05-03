# snap-turn
Component for reading the input of a thumbstick and using that to effectively rotate the reference
in place in discrete steps. This is accomplished by rotating and moving the target. It's assumed that
the reference is a descendant of the target. This can be used on the camera rig to achieve snap turning.

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| enabled | Whether or not the snapturning is enabled | `string` | true |
| target | Selector for the target to apply rotation and translation to | `selector` |  |
| reference | Selector for the reference to 'effectively' rotate | `selector` |  |
| turnSize | The rotation per snap (degrees) | `number` | 45 |
| activateThreshold | The amount the thumbstick needs to be pushed to activate a snap turn | `number` | 0.9 |
| deactivateThreshold | The threshold the thumbstick needs to cross before a new activation may take place | `number` | 0.8 |
| delay | Optional delay applied before and after the actual snap rotation takes place | `number` | 0 |

## Events
| Event Name | Description  |
|------------|--------------|
| rotation | Target was rotated through this component. No movement is also signalled through the `motion` event |
| prerotation |  Target is about to rotate (only when a `delay` is configured) |
| postrotation | Target has just rotated (only when a `delay` is configured) |


## Example
The `snap-turn` component needs to be applied to an entity that will emit the `axismove` event,
commonly one of the hands. Below is an example using a camera rig:
```HTML
<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>

    <a-entity vive-controls="hand: right"
              oculus-touch-controls="hand: right"
              snap-turn="target: #rig; reference: #camera">
    </a-entity>
</a-entity>
```

In case a transition needs to be shown a delay can be configured. This delay is applied twice: before and
after the actual snap rotation. This can be used to make a quick fade transition for each snap turn,
see [`al-snap-turn-fade`](../auxiliary/al-snap-turn-fade.primitive.md)


## Source
[`src/movement/snap-turn.component.ts:43`](https://github.com/mrxz/aframe-locomotion/blob/2c33638c/src/movement/snap-turn.component.ts#L43)
