# nav-mesh-strategy
Selects the nav mesh strategy that is used by all aframe-locomotion components.
This component should be added to the scene if you want to make use of nav mesh based functionality.
Once configured, nav meshes need to be marked using the [`nav-mesh`](nav-mesh.component.md) component.

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
| strategy | Either `simple` or `scan`. The `simple` strategy allows to check if movement is valid based on the nav-mesh in a binary fashion (movement is either valid or not). The `scan` strategy falls back to alternatives that are slightly to the side of the movement. This allows sliding across walls. | `string` | scan |



## Example
Add the `nav-mesh-strategy` component to the scene
```HTML
<a-scene nav-mesh-strategy>
    <!-- entities with nav-mesh component -->
</a-scene>
```

> **Note:** In many cases the navigation meshes should not be visible. The `nav-mesh` component
doesn't handle this for you, so make sure to manually add `material="visible: false"` or hide
the mesh in some other way.


## Source
[`src/nav-mesh/nav-mesh-strategy.component.ts:28`](https://github.com/mrxz/aframe-locomotion/blob/15e65c2/src/nav-mesh/nav-mesh-strategy.component.ts#L28)
