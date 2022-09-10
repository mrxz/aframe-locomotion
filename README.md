# A-Frame locomotion
[![npm version](https://img.shields.io/npm/v/aframe-locomotion.svg?style=flat-square)](https://www.npmjs.com/package/aframe-locomotion)
[![npm version](https://img.shields.io/npm/l/aframe-locomotion.svg?style=flat-square)](https://www.npmjs.com/package/aframe-locomotion)
[![github](https://flat.badgen.net/badge/icon/github?icon=github&label)](https://github.com/mrxz/aframe-locomotion/)
[![twitter](https://flat.badgen.net/twitter/follow/noerihuisman)](https://twitter.com/noerihuisman)
[![ko-fi](https://img.shields.io/badge/ko--fi-buy%20me%20a%20coffee-ff5f5f?style=flat-square)](https://ko-fi.com/fernsolutions)

A collection of A-Frame components, systems and primitives that enable all sorts of locomotion in VR. It't built to be modular, flexible and easy to use. Currently supports smooth locomotion, snap turning and smooth turning. Besides the actual modes of locomotion, there are auxillary components to improve the locomotion experience like a vignette when moving, fading when snap turning and more.

<a href="https://aframe-locomotion.fern.solutions/examples">
<img src="https://fern.solutions/images/projects/aframe-locomotion.png" alt="Aframe locomotion example"/><br/>
Try the online examples
</a>
<a href="https://aframe-locomotion.fern.solutions/docs">
Read the docs
</a>

Blog post describing the implementation: [A-Frame Adventures 01 - Smooth locomotion and snap turning](https://fern.solutions/dev-logs/aframe-adventures-01/)

<a href='https://ko-fi.com/fernsolutions' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

# Quick start
To add `aframe-locomotion` to your A-Frame project, all you have to do is load the aframe-locomotion javascript:
```html
<script src="https://unpkg.com/aframe-locomotion@0.2.0/dist/aframe-locomotion.umd.min.js"></script>
```

This will automatically register the components `smooth-locomotion` and `snap-turn`. These need to be attached to the controllers as part of a camera rig, as follows:
```html
<!-- Camera rig -->
<a-entity id="rig">
    <a-camera id="camera"></a-camera>

    <!-- Hands -->
    <a-entity
        hand-controls="hand: left"
        smooth-locomotion="target: #rig; reference: #camera">
    </a-entity>
    <a-entity
        hand-controls="hand: right"
        snap-turn="target: #rig; reference: #camera">
    </a-entity>

</a-entity>
```

Both `smooth-locomotion` and `snap-turn` have more properties that can be used to tweak the behaviour. Check the <a href="https://aframe-locomotion.fern.solutions/docs">Documentation</a> to learn more or explore the <a href="https://aframe-locomotion.fern.solutions/examples">examples</a>.

# Features
* Smooth locomotion
* Snap turning (with optional fade transitions)
* Smooth turning
* Vignette when moving
* Nav-mesh support

# Planned features
* [ ] Velocity effectors (e.g. conveyor belts, moving platforms)
* [ ] Smooth snap turning
* [ ] Momentum preservation
* [ ] Teleport
* [ ] Flying
* [ ] Head-collision prevention

# Questions
If you've got any questions, feedback, suggestions or even want to help out, feel free to reach out to me.
