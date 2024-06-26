# smooth-locomotion
Component for reading the input of a thumbstick and converting that into motion on a target entity.
The rotation of the reference is used to determine the direction to move in. This can be used on a
camera rig to move around the world using either head orientation or controller orientation.

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| enabled | Whether the smooth locomotion is active or not | `string` | true |
| target | Selector for the target of the motion | `selector` |  |
| reference | Selector for the reference to determine world position and rotation | `selector` |  |
| moveSpeed | The (max) speed for the target (m/s) | `number` | 1.5 |
| forward | Whether or not forward movement should be applied | `string` | true |
| backward | Whether or not backward movement should be applied | `string` | true |
| sideways | Whether or not sideways movement should be applied | `string` | true |
| inputMode | The mode for interpreting the input. With the `binary` mode even small inputs will result in maximum speed being applied. The `analog` mode will scale the applied speed between 0 and moveSpeed based on the input magnitude | `string` | binary |
| fallMode | The mode for how falling should be handled in case the reference is moving off an edge. With `snap` the reference will always snap to the ground, instantly dropping down. With `prevent` the reference won't be moved over the edge. With `fall` the reference is moved over the edge, but not forced/snapped to the ground, allowing it to fall down. (Only applies when using the [`nav-mesh`](../nav-mesh/nav-mesh.system.md)) | `string` | fall |

## Events
| Event Name | Description  |
|------------|--------------|
| motion | Target was moved through this component. No movement is also signalled through the `motion` event |


## Example
The `smooth-locomotion` component needs to be applied to an entity that will emit the `axismove` event,
commonly one of the hands. Below is an example using a camera rig to enable smooth locomotion using the
thumbstick on the left controller and using head orientation:
```HTML
<a-entity id="rig">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>

    <a-entity id="leftHand"
              vive-controls="hand: left"
              oculus-touch-controls="hand: left"
              smooth-locomotion="target: #rig; reference: #camera">
    </a-entity>
</a-entity>
```

To use controller orientation instead, change the reference to the controller, as such:
```HTML
<a-entity id="leftHand"
            vive-controls="hand: left"
            oculus-touch-controls="hand: left"
            smooth-locomotion="target: #rig; reference: #leftHand">
</a-entity>
```


## Source
[`src/movement/smooth-locomotion.component.ts:55`](https://github.com/mrxz/aframe-locomotion/blob/2c33638c/src/movement/smooth-locomotion.component.ts#L55)
