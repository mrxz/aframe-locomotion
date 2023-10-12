import * as AFRAME from 'aframe';
import { strict } from 'aframe-typescript';

export interface PostMotionCallback {
    postMotion(): void
};

/**
 * @internal
 */
const LocomotionSystem = AFRAME.registerSystem('locomotion', strict<{
    postMotionCallbacks: Array<PostMotionCallback>
}>().system({
    schema: {},
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

declare module "aframe" {
    export interface Systems {
        "locomotion": InstanceType<typeof LocomotionSystem>,
    }
}