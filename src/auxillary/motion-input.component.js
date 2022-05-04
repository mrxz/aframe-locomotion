AFRAME.registerComponent('motion-input', {
    schema: {
        source:     { type: 'selector' },
        property:   { type: 'string' },
        minOutput:  { default: 0.0 },
        maxOutput:  { default: 1.0 },
        ease:       { default: 0.9, min: 0.0, max: 1.0 },
        inputMode:  { default: 'binary' }
    },
    init: function() {
        this.input = 0;
        this.motionEventHandler = (event) => {
            this.input = event.detail.inputMagnitude;
        };
        this.data.source?.addEventListener('motion', this.motionEventHandler);
    },
    update: function(oldData) {
        if(oldData.source !== this.data.source) {
            oldData.source?.removeEventListener('motion', this.motionEventHandler);
            this.data.source?.addEventListener('motion', this.motionEventHandler);

            this.input = 0;
        }
    },
    tick: (function() {
        let lastOutput = 0;

        return function(t, dt) {
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
            const output = rawOutput * (1 - this.data.ease) + lastOutput * this.data.ease;

            // Update property
            AFRAME.utils.entity.setComponentProperty(this.el, this.data.property, output);
            lastOutput = output;
        }
    })()
});