export const rotateAroundWorldUp = (function() {
    const v3 = new THREE.Vector3();
    const m4A = new THREE.Matrix4();
    const m4B = new THREE.Matrix4();

    const referenceMatrix = new THREE.Matrix4();
    const desiredReferenceMatrix = new THREE.Matrix4();
    const inverseTargetMatrix = new THREE.Matrix4();
    const referenceRelativeToTarget = new THREE.Matrix4();
    const inverseReferenceMatrix = new THREE.Matrix4();
    const newTargetMatrix = new THREE.Matrix4();

    return function(target, reference, degrees) {
        if(!degrees || !target || !reference) {
            return;
        }

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
    }
})()