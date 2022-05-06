# A-Frame Locomotion
A-Frame Locomotion is a collection of components, systems and primitives for all forms of locomotion in VR. It aims to be simple, modular, flexible and 'just work'. You can freely pick out the things you need or combine them in new and creative ways.

Here are some quick examples of the locomotion schemes you can achieve:

## Quick examples
|Example|Components|
|-------|----------|
|Smooth locomotion with snap turning|`smooth-locomotion` and `snap-turn`|
|Snap turning with fade transitions|`snap-turn="delay: 0.1"` and `<al-snap-turn-fade>`|
|Smooth turning|`smooth-turning`|
|Vignette when moving|`al-vignette`|
|Smooth locomotion on a nav-mesh|`smooth-locomotion` with `nav-mesh-strategy` and `nav-mesh`|
|Smooth locomotion without falling of edges|`smooth-locomotion="fallMode: prevent"` with `nav-mesh-strategy` and `nav-mesh`|
|Remote controlling an actor|`smooth-locomotion="target: #actor; reference: #actor"`|

> **Note:** The above examples assume a [camera rig](https://aframe.io/docs/1.3.0/components/camera.html#examples) to be used and omits corresponding property values for brevity. See reference documentation for the mentioned components or explore the full examples.