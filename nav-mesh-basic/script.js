const dispatchCustomEvent = (type, detail) => {
    window.dispatchEvent(new CustomEvent(type, {
      detail: typeof cloneInto !== 'undefined' ? cloneInto(detail, window) : detail
    }));
  };

const setPose = (pos, quat) => {
  dispatchCustomEvent('webxr-pose', {
    position: pos,
    quaternion: quat
  });
}

const setInputPose = (pos, quat, left) => {
    dispatchCustomEvent('webxr-input-pose', {
      objectName: left ? 'leftController' : 'rightController',
      position: pos,
      quaternion: quat
    });
  }


AFRAME.registerComponent('script', {
    schema: {
        leftHand: { type: 'selector', default: '#leftHand' },
        rightHand: { type: 'selector', default: '#rightHand' },
        target: { type: 'selector', default: '#rig' },
    },
    init: function() {
        this.playing = false;
        this.el.sceneEl.addEventListener('enter-vr', () => {
            //this.playing = true;

            // Hide fake controller hands
            //this.data.leftHand.object3D.visible = false;
            //this.data.rightHand.object3D.visible = false;
        });
    },
    tick: (function() {
        const ahead = new THREE.Vector3(0, 0, -1);
        const down = new THREE.Vector3(0, -1, -0.1).normalize();
        const startQuat = new THREE.Quaternion();
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(ahead, down);
        const quat = new THREE.Quaternion();

        let time = 0;
        let index = 0;
        let state = 1;

        return function(t, dt) {
            if(!this.playing) {
                return;
            }

            time += dt / 1000;
            switch(state) {
                case 1: // Move towards sign
                    if(this.data.target.object3D.position.z < -4) {
                        this.data.target.object3D.position.z = -4;
                        state++;
                        time = 0;
                        this.data.leftHand.emit('axismove', {axis: [0, 0], changed: true});
                    } else {
                        this.data.leftHand.emit('axismove', {axis: [0, -1], changed: false});
                    }
                    break;
                case 2: // Look right
                    if(time > 1) {
                        this.data.rightHand.emit('axismove', {axis: [1, 0], changed: true});
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        state++;
                        time = 0;
                    }
                    break;
                case 3: // Look left
                    if(time > 1) {
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        this.data.rightHand.emit('axismove', {axis: [-1, 0], changed: true});
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        state++;
                        time = 0;
                    }
                    break;
                case 4: // Look left again
                    if(time > 1) {
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        this.data.rightHand.emit('axismove', {axis: [-1, 0], changed: true});
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        state++;
                        time = 0;
                    }
                    break;
                case 5: // Move up the slope
                    if(time < 1) {

                    } else if(time < 3) {
                        this.data.leftHand.emit('axismove', {axis: [0.2, -1], changed: true});
                    } else {
                        this.data.leftHand.emit('axismove', {axis: [0, 0], changed: true});
                        state++;
                    }
                    break;
                case 6: // Smooth turn config
                    this.data.rightHand.removeAttribute('snap-turn');
                    this.data.leftHand.setAttribute('smooth-locomotion', 'target: #rig; reference: #camera; moveSpeed: 5; inputMode: analog');
                    this.data.rightHand.setAttribute('smooth-turn', 'target: #rig; reference: #camera; turnSpeed: 35');
                    time = 0;
                    state++
                case 7: // Smooth turn
                    this.data.rightHand.emit('axismove', {axis: [1, 0], changed: true});
                    if(time > 1.4) {
                        this.data.rightHand.emit('axismove', {axis: [0, 0], changed: true});
                        time = 0;
                        state++;
                    }
                    break;
                case 8: // Walk off
                    this.data.leftHand.emit('axismove', {axis: [0, -1], changed: true});
                    if(time > 1.5) {
                        this.data.leftHand.emit('axismove', {axis: [0, 0], changed: true});
                        time = 0;
                        state++;
                    }
                    break;
                case 9: // Look down
                    {
                        let frac = Math.min(1, time / 1);
                        quat.slerpQuaternions(startQuat, targetQuat, frac);
                        setPose([0, 1.6, 0], quat.toArray());
                        if(frac >= 1.0) {
                            state++;
                            time = 0;
                        }
                    }
                    break;
                case 10: // Slight delay
                    if(time > 1.4) {
                        time = 0;
                        state++;
                    }
                    break;
                case 11: // Look up and back-off
                    {
                        let frac = Math.min(1, time / 1);
                        quat.slerpQuaternions(targetQuat, startQuat, Math.min(1, time / 1));
                        setPose([0, 1.6, 0], quat.toArray());
                        this.data.leftHand.emit('axismove', {axis: [0, 0.5], changed: true});
                        if(frac >= 1.0) {
                            this.data.leftHand.emit('axismove', {axis: [0, 0], changed: true});
                            state++;
                            time = 0;
                        }
                    }
                    break;
                case 12: //
            }
        };
    })()
})

AFRAME.registerComponent('circle', {
    tick: function(t, dt) {
        this.el.object3D.rotation.y -= dt / 1000;
    }
});

AFRAME.registerComponent('wave', {
    init: function() {
        this.baseY = this.el.object3D.position.y;
    },
    tick: function(t, dt) {
        const time = t / 1000;
        const amplitude = 0.2;
        this.el.object3D.position.y = this.baseY + amplitude * Math.sin(time);
    }
});

AFRAME.registerComponent('buoyant', {
    init: function() {
        this.baseX = this.el.object3D.rotation.x;
        this.baseY = this.el.object3D.position.y;
        this.baseZ = this.el.object3D.rotation.z;
    },
    tick: function(t, dt) {
        const time = t / 1000;
        const amplitude = 0.025;
        this.el.object3D.position.y = this.baseY + 0.1 * Math.sin(time);
        this.el.object3D.rotation.x = this.baseX + amplitude * Math.sin(time / 2);
        this.el.object3D.rotation.z = this.baseZ + amplitude * Math.sin(time / 2);
    }
});

AFRAME.registerComponent('take-control', {
    schema: {
        leftHand: { type: 'selector', default: '#leftHand' },
        rightHand: { type: 'selector', default: '#rightHand' },
        target: { type: 'selector', default: '#ship' },
        sharks: { type: 'selector', default: '#sharks'}
    },
    init: function() {
        this.data.leftHand.addEventListener('triggerdown', () => {
            this.data.leftHand.setAttribute("smooth-locomotion", "target: #ship; reference: #ship; sideways: false; inputMode: analog; moveSpeed: 10; navmesh: disabled");
            this.data.rightHand.removeAttribute('snap-turn');
            this.data.rightHand.setAttribute("smooth-turn", "target: #ship; reference: #ship; inputMode: analog; turnSpeed: 80");
        });
        this.data.rightHand.addEventListener('triggerdown', () => {
            this.data.sharks.object3D.visible = !this.data.sharks.object3D.visible;
        });
        this.data.sharks.object3D.visible = false;
    }
});