import { rotateAroundWorldUp } from './turn';

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const DONE = 3;
// States in case of delay
const PRE = 4;
const POST = 5;

AFRAME.registerComponent('snap-turn', {
    schema: {
        enabled:             { default: true },
        target:              { type: 'selector' },
        reference:           { type: 'selector' },
        turnSize:            { default: 45 },
        activateThreshold:   { default: 0.9 },
        deactivateThreshold: { default: 0.8 },
        delay:               { default: 0, min: 0 }
    },
    init: function() {
        this.state = NONE;
        this.action = NONE;
        this.timer = 0;
        this.nextAction = NONE;

        this.axisMoveListener = (e) => {
            const axis = e.detail.axis;
            const amount = axis.length > 2 ? axis[2] : axis[0];

            if(Math.abs(amount) > this.data.activateThreshold) {
                this.state = amount < 0 ? LEFT : RIGHT;
            } else if(Math.abs(amount) < this.data.deactivateThreshold) {
                this.state = NONE;
                if(this.action === DONE) {
                    this.action = NONE;
                }
            }

            if(this.state !== NONE && this.action === NONE) {
                if(this.data.delay) {
                    this.nextAction = this.state;
                    this.timer = this.data.delay;
                    this.action = PRE;
                } else {
                    this.action = this.state;
                }
            }
        };
        this.el.addEventListener('axismove', this.axisMoveListener);
    },
    tick: function(t, dt) {
        if(!dt || !this.data.enabled || !this.data.reference || !this.data.target) {
            return;
        }

        if(this.action === PRE || this.action === POST) {
            this.timer -= dt/1000;
            if(this.timer < 0) {
                this.action = this.nextAction;
            } else {
                const event = this.action === PRE ? 'prerotation' : 'postrotation';
                const progress = (this.data.delay - this.timer) / this.data.delay;
                this.data.target.emit(event, { progress, source: this.el });
            }
        }

        let degrees = 0;
        if(this.action === LEFT) {
            degrees = this.data.turnSize;
        } else if(this.action === RIGHT) {
            degrees = -this.data.turnSize;
        } else {
            return;
        }

        this.data.target.emit('rotation', { degrees, source: this.el });
        rotateAroundWorldUp(this.data.target.object3D, this.data.reference.object3D, degrees);

        if(this.action === LEFT || this.action === RIGHT) {
            if(this.data.delay) {
                this.action = POST;
                this.nextAction = DONE;
                this.timer = this.data.delay;
            } else {
                this.action = DONE;
            }
        }
    },
    remove: function() {
        this.el.removeEventListener('axismove', this.axisMoveListener);
    }
});