AFRAME.registerComponent('smooth-locomotion', {
    schema: {
        enabled:    { default: true },
        target:     { type: 'selector' },
        reference:  { type: 'selector' },
        walkSpeed:  { default: 1.5 },
        // Toggles for the directions
        forward:    { default: true },
        backward:   { default: true },
        sideways:   { default: true },
    },
    init: function() {
        this.inputDirection = { x: 0, y: 0 };
        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            if(axis.length > 2) {
                // Oculus
                this.inputDirection.x = axis[2];
                this.inputDirection.y = axis[3];
            } else {
                // Vive/Index
                this.inputDirection.x = axis[0];
                this.inputDirection.y = axis[1];
            }
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: (function() {
        const direction = new THREE.Vector3();
        const referenceWorldRot = new THREE.Quaternion();
        const newPosition = new THREE.Vector3();

        return function(t, dt) {
            if(!dt || !this.data.enabled) {
                return;
            }

            direction.set(this.inputDirection.x, 0, this.inputDirection.y);
            if(!this.data.sideways) {
                direction.z = 0;
            }
            if(direction.x < 0 && !this.data.backward) {
                direction.x = 0;
            } else if(!this.data.forward) {
                direction.x = 0;
            }

            if(direction.lengthSq() < 0.0001) {
                return;
            }


            // Direction is relative to the reference's rotation
            this.data.reference.object3D.getWorldQuaternion(referenceWorldRot);
            direction.applyQuaternion(referenceWorldRot);

            // Ignore vertical component
            direction.y = 0;
            direction.normalize();

            newPosition.copy(this.data.target.object3D.position);
            newPosition.addScaledVector(direction, this.data.walkSpeed * dt / 1000);

            this.data.target.object3D.position.copy(newPosition);
        }
    })(),
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
});