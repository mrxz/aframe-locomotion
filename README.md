# A-Frame locomotion
This project contains components for A-Frame that enable various forms of locomotion in VR. Currently only smooth locomotion and snap turning are implemented, but different modes are planned. Besides the actual modes of locomotion, there will be auxillary components that relate to locomotion (e.g. blinkers/vignette support)

<a href="https://aframe-locomotion-example.fern.solutions/">Try the online demo
<img src="https://fern.solutions/images/projects/aframe-locomotion.png" alt="Aframe locomotion example"/>
</a>

Blog post describing the implementation: [A-Frame Adventures 01 - Smooth locomotion and snap turning](https://fern.solutions/dev-logs/aframe-adventures-01/)

<a href='https://ko-fi.com/fernsolutions' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

# Quick start
To add `aframe-locomotion` to your A-Frame project, all you have to do is load the aframe-locomotion javascript:
```html
<script src="https://unpkg.com/aframe-locomotion@0.1.0/dist/aframe-locomotion.umd.min.js"></script>
```

This will automatically register the components `smooth-locomotion` and `snap-turn`. These need to be attached to the controllers as part of a camera rig, as follows:
```html
<!-- Camera rig -->
<a-entity id="rig" position="0 0 0">
    <a-entity id="camera" camera position="0 1.6 0" wasd-controls look-controls></a-entity>

    <!-- Hands -->
    <a-entity
        vive-controls="hand: left"
        oculus-touch-controls="hand: left"
        locomotion="target: #rig; reference: #camera">
    </a-entity>
    <a-entity
        vive-controls="hand: right"
        oculus-touch-controls="hand: right"
        snap-turn="target: #rig; reference: #camera">
    </a-entity>

</a-entity>
```

Both `smooth-locomotion` and `snap-turn` have more properties that can be configured, but isn't documented yet. Refer to the code to see which properties are available.

# Planned features
Basic smooth locomotion and snap turning have been implemented. However there are still many facets of locomotion that are missing. Since I primarily develop this library for my own needs, the below list of planned features can change at any point.

* [x] Smooth locomotion
* [x] Snap turning
* [ ] Smooth turning
* [ ] Blinkers/vignette
* [ ] Nav-mesh support
* [ ] Teleport
* [ ] Flying
* [ ] Head-collision prevention

# Questions
If you've got any questions, feedback, suggestions or even want to help out, feel free to reach out to me.
