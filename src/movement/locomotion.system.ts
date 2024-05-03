import * as AFRAME from 'aframe';

export interface PostMotionCallback {
    postMotion(): void
};

/**
 * @internal
 */
export const LocomotionSystem = AFRAME.registerSystem('locomotion', {
    schema: {},
    __fields: {} as {
        postMotionCallbacks: Array<PostMotionCallback>
    },
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
});

declare module "aframe" {
    export interface Systems {
        "locomotion": InstanceType<typeof LocomotionSystem>,
    }
}