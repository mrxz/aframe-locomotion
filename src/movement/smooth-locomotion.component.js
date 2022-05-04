AFRAME.registerComponent('smooth-locomotion', {
    schema: {
        enabled:    { default: true },
        target:     { type: 'selector' },
        reference:  { type: 'selector' },
        moveSpeed:  { default: 1.5 },
        // Toggles for the directions
        forward:    { default: true },
        backward:   { default: true },
        sideways:   { default: true },
        inputMode:  { default: 'binary' },
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
        const movement = new THREE.Vector3();

        const oldRefPosition = new THREE.Vector3();
        const newRefPosition = new THREE.Vector3();

        return function(t, dt) {
            if(!dt || !this.data.enabled) {
                return;
            }

            direction.set(this.inputDirection.x, 0, this.inputDirection.y);
            if(!this.data.sideways) {
                direction.x = 0;
            }
            if(direction.z < 0 && !this.data.backward) {
                direction.z = 0;
            } else if(!this.data.forward) {
                direction.z = 0;
            }

            if(direction.lengthSq() < 0.0001) {
                this.data.target.emit('motion', { inputMagnitude: 0, source: this.el }, false)
                return;
            }

            // Determine the magnitude of the input
            const binaryInputMode = this.data.inputMode === 'binary';
            const inputMagnitude = binaryInputMode ? 1.0 : Math.min(direction.length(), 1.0);

            // Direction is relative to the reference's rotation
            this.data.reference.object3D.getWorldQuaternion(referenceWorldRot);
            direction.applyQuaternion(referenceWorldRot);

            // Ignore vertical component
            direction.y = 0;
            direction.normalize();

            const oldPosition = this.data.target.object3D.position;
            movement.set(0, 0, 0).addScaledVector(direction, inputMagnitude * this.data.moveSpeed * dt / 1000);

            // Check if the nav-mesh system allows the movement
            const navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
            if(navMeshSystem && navMeshSystem.active) {
                // NavMeshSystem needs the old and new world position of the reference.
                this.data.reference.object3D.getWorldPosition(oldRefPosition);
                newRefPosition.copy(oldRefPosition).add(movement);

                const approvedPosition = navMeshSystem.approveMovement(oldRefPosition, newRefPosition);

                // Compute adjusted movement
                movement.copy(approvedPosition).sub(oldRefPosition);
            }

            newPosition.copy(oldPosition).add(movement);
            this.data.target.object3D.position.copy(newPosition);

            // Emit event on the target, so others interested in the target's movement can react
            this.data.target.emit('motion', { inputMagnitude, source: this.el }, false)
        }
    })(),
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
});