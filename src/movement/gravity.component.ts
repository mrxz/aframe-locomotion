import * as AFRAME from "aframe";
import { THREE } from "aframe";

export const GravityComponent = AFRAME.registerComponent('gravity', {
    schema: {
        strength: { default: 9.81 }
    },
    inAir: false,
    velocity: new THREE.Vector3(),
    init: function() {
        this.motionEventHandler = (event: any) => {
            this.inAir = event.detail.inAir;
            if(!this.inAir) {
                this.velocity.set(0, 0, 0);
            }
        };
        this.el.addEventListener('motion', this.motionEventHandler);
    },
    getVelocity: function() {
        return this.velocity;
    },
    tick: function(_t, dt) {
        if(this.inAir) {
            this.velocity.y -= this.data.strength * dt/1000;
        }
    },
    remove: function() {
        this.el.removeEventListener('motion', this.motionEventHandler);
    }
});