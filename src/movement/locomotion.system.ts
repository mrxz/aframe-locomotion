import * as AFRAME from 'aframe';
import { strict } from 'aframe-typescript';

interface PostMotionCallback {
    postMotion(): void
};

/**
 *
 */
export const LocomotionSystem = AFRAME.registerSystem('locomotion', strict<{
    postMotionCallbacks: Array<PostMotionCallback>
}>().system({
    init: function() {
        this.postMotionCallbacks = [];
    },
    tick: function() {
        // Post motion handle
        this.postMotionCallbacks.forEach(c => c.postMotion());
    },
    addPostMotionCallback(postMotionCallback: PostMotionCallback) {
        this.postMotionCallbacks.push(postMotionCallback);
    },
    removePostMotionCallback(postMotionCallback: PostMotionCallback) {
        const index = this.postMotionCallbacks.indexOf(postMotionCallback);
        if(index !== -1) {
            this.postMotionCallbacks.splice(index, 1);
        }
    }
}));