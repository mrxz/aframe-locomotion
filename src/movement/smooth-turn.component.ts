import { StrictComponent } from 'aframe';
import { rotateAroundWorldUp } from './turn';

const EPSILON = 0.00001;

export const SmoothTurnComponent = AFRAME.registerComponent('smooth-turn', {
    schema: {
        enabled:             { default: true },
        target:              { type: 'selector' },
        reference:           { type: 'selector' },
        turnSpeed:           { default: 20 },
        inputMode:           { default: 'binary' }
    },
    init: function() {
        this.input = 0;
        this.axisMoveListener = (e: any) => {
            const axis = e.detail.axis;
            this.input = axis.length > 2 ? axis[2] : axis[0];
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: function(_t, dt) {
        if(!dt || !this.data.enabled || !this.data.reference || !this.data.target) {
            return;
        }

        if(Math.abs(this.input) <= EPSILON) {
            return;
        }

        let input = this.input;
        if(this.data.inputMode === 'binary') {
            if(input < 0) {
                input = -1;
            } else {
                input = 1;
            }
        }

        const degrees = -input * this.data.turnSpeed * dt / 1000;
        this.data.target.emit('rotation', { degrees, source: this.el });
        rotateAroundWorldUp(this.data.target.object3D, this.data.reference.object3D, degrees);
    },
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
}) satisfies StrictComponent<{input: number, axisMoveListener: (e: any) => void}>;