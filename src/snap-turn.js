const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const DONE = 3;

AFRAME.registerComponent('snap-turn', {
    schema: {
        enabled:             { default: true },
        target:              { type: 'selector' },
        reference:           { type: 'selector' },
        turnSize:            { default: 15 },
        activateThreshold:   { default: 0.9 },
        deactivateThreshold: { default: 0.8 },
    },
    init: function() {
        this.state = NONE;
        this.action = NONE;
        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            const amount = axis.length > 2 ? axis[2] : axis[0];

            if(Math.abs(amount) > this.data.activateThreshold) {
                this.state = amount < 0 ? LEFT : RIGHT;
            } else if(Math.abs(amount) < this.data.deactivateThreshold) {
                this.state = NONE;
                this.action = NONE;
            }

            if(this.state !== NONE && this.action === NONE) {
                this.action = this.state;
            }
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: (function() {
        const v3 = new THREE.Vector3();
        const m4A = new THREE.Matrix4();
        const m4B = new THREE.Matrix4();

        const referenceMatrix = new THREE.Matrix4();
        const desiredReferenceMatrix = new THREE.Matrix4();
        const inverseTargetMatrix = new THREE.Matrix4();
        const referenceRelativeToTarget = new THREE.Matrix4();
        const inverseReferenceMatrix = new THREE.Matrix4();
        const newTargetMatrix = new THREE.Matrix4();

        return function(t, dt) {
            if(!dt || !this.data.enabled || !this.data.reference || !this.data.target) {
                return;
            }

            let degrees = 0;
            if(this.action === LEFT) {
                degrees = this.data.turnSize;
            } else if(this.action === RIGHT) {
                degrees = -this.data.turnSize;
            } else {
                return;
            }

            const reference = this.data.reference.object3D;
            const target = this.data.target.object3D;
            target.updateMatrixWorld();

            // Compute the desired rotation of the reference.
            referenceMatrix.copy(reference.matrixWorld);
            inverseTargetMatrix.copy(target.matrixWorld).invert();

            const rotationMatrix = m4A.makeRotationY(degrees * Math.PI / 180).multiply(m4B.extractRotation(referenceMatrix));
            desiredReferenceMatrix.copy(rotationMatrix)
                .scale(v3.setFromMatrixScale(referenceMatrix))
                .setPosition(v3.setFromMatrixPosition(referenceMatrix));

            referenceRelativeToTarget.multiplyMatrices(inverseTargetMatrix, referenceMatrix);
            inverseReferenceMatrix.copy(referenceRelativeToTarget).invert();
            newTargetMatrix.multiplyMatrices(desiredReferenceMatrix, inverseReferenceMatrix);

            // Take possible parents into account
            if(target.parent) {
                const inverseParentMatrix = inverseTargetMatrix.copy(target.parent.matrixWorld).invert();
                newTargetMatrix.multiplyMatrices(inverseParentMatrix, newTargetMatrix);
            }

            newTargetMatrix.decompose(target.position, target.quaternion, target.scale);

            if(this.action === LEFT || this.action === RIGHT) {
                this.action = DONE;
            }
        }
    })(),
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
});