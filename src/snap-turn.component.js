import { rotateAroundWorldUp } from './turn';

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const DONE = 3;

AFRAME.registerComponent('snap-turn', {
    schema: {
        enabled:             { default: true },
        target:              { type: 'selector' },
        reference:           { type: 'selector' },
        turnSize:            { default: 45 },
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
    tick: function(t, dt) {
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

        rotateAroundWorldUp(this.data.target.object3D, this.data.reference.object3D, degrees);

        if(this.action === LEFT || this.action === RIGHT) {
            this.action = DONE;
        }
    },
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
});