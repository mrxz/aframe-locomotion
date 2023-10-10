# gravity
This component is a 'velocity' component and can be used to influence
motion based components like [`smooth-locomotion`](smooth-locomotion.component.md).
On its own the component won't do anything.

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| strength | The gravitational acceleration in m/s^2 | `number` | 9.81 |


## Remarks
The `gravity` component should be applied to the target of motion.
When using [`smooth-locomotion`](smooth-locomotion.component.md) with the default camera rig,
the rig element is the target and should have the `gravity` component on it.

## Example
```HTML
<a-entity id="rig" gravity>
  <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>

  <a-entity vive-controls="hand: left"
            oculus-touch-controls="hand: left"
            smooth-locomotion="target: #rig; reference: #camera">
  </a-entity>
</a-entity>
```


## Source
[`src/movement/gravity.component.ts:26`](https://github.com/mrxz/aframe-locomotion/blob/15e65c2/src/movement/gravity.component.ts#L26)
