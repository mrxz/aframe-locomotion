# smooth-turn
Component for reading the input of a thumbstick and using that to effectively
rotate the reference in place. This is accomplished by rotating and moving the target.
It's assumed that the reference is a descendant of the target. This can be used on the camera rig
to achieve smooth turning.

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| enabled | Whether the smooth turn is active or not | `string` | true |
| target | Selector for the target to apply rotation and translation to | `selector` |  |
| reference | Selector for the reference to 'effectively' rotate | `selector` |  |
| turnSpeed | The (max) rotation speed (degrees/s) | `number` | 20 |
| inputMode | The mode for interpreting the input. With the `binary` mode even small inputs will result in maximum speed being applied. The `analog` mode will scale the applied speed between 0 and `turnSpeed` based on the input magnitude | `string` | binary |

## Events
| Event Name | Description  |
|------------|--------------|
| rotation | Target was rotated through this component. No movement is also signalled through the `motion` event |


## Example
The `smooth-turn` component needs to be applied to an entity that will emit the `axismove` event,
commonly one of the hands. Below is an example using a camera rig:
```HTML
<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>

    <a-entity vive-controls="hand: right"
              oculus-touch-controls="hand: right"
              smooth-turn="target: #rig; reference: #camera">
    </a-entity>
</a-entity>
```


## Source
[`src/movement/smooth-turn.component.ts:30`](https://github.com/mrxz/aframe-locomotion/blob/2c33638c/src/movement/smooth-turn.component.ts#L30)
