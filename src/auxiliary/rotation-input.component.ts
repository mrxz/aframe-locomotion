import * as AFRAME from "aframe";
import { ListenerFor } from "aframe";

/** @internal */
export const RotationInputComponent = AFRAME.registerComponent('rotation-input', {
    schema: {
        source:     { type: 'selector' },
        property:   { type: 'string' },
        minOutput:  { default: 0.0 },
        maxOutput:  { default: 1.0 },
        ease:       { default: 0.0, min: 0.0, max: 1.0 },
        inputMode:  { default: 'analog' }
    },
    __fields: {} as {
        input: number;
        preRotationEventHandler: ListenerFor<'prerotation'>;
        postRotationEventHandler: ListenerFor<'postrotation'>;

        lastOutput: number;
    },
    init: function() {
        this.input = 0;
        this.preRotationEventHandler = (event) => {
            this.input = event.detail.progress; // Rising
        };
        this.postRotationEventHandler = (event) => {
            this.input = 1.0 - event.detail.progress; // Falling
        };
        this.data.source?.addEventListener('prerotation', this.preRotationEventHandler);
        this.data.source?.addEventListener('postrotation', this.postRotationEventHandler);

        this.lastOutput = 0;
    },
    update: function(oldData) {
        if(oldData.source !== this.data.source) {
            oldData.source?.removeEventListener('prerotation', this.preRotationEventHandler);
            oldData.source?.removeEventListener('postrotation', this.postRotationEventHandler);
            this.data.source?.addEventListener('prerotation', this.preRotationEventHandler);
            this.data.source?.addEventListener('postrotation', this.postRotationEventHandler);

            this.input = 0;
        }
    },
    tick: function(_t: number, dt: number) {
        if(!dt || !this.data.property) {
            return;
        }

        // Compute output value
        let input = this.input;
        if(this.data.inputMode === 'binary') {
            input = input > 0 ? 1.0 : 0.0;
        }
        const rawOutput = input * (this.data.maxOutput - this.data.minOutput) + this.data.minOutput;

        // Ease the output (FIXME: not frame-rate independent)
        const output = rawOutput * (1 - this.data.ease) + this.lastOutput * this.data.ease;

        // Update property
        AFRAME.utils.entity.setComponentProperty(this.el, this.data.property, output);
        this.lastOutput = output;
    }
});

declare module "aframe" {
    export interface Components {
        "rotation-input": InstanceType<typeof RotationInputComponent>
    }
}