import { simpleNavMeshStrategy } from "./strategy/simple-strategy";

const STRATEGIES = {
    'simple': simpleNavMeshStrategy
}

AFRAME.registerComponent('nav-mesh-strategy', {
    schema: {
        strategy: { default: 'simple' }
    },
    init: function() {
        this.navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
        this.navMeshSystem.active = true;
    },
    update: function(oldData) {
        if(oldData.strategy !== this.data.strategy) {
            const strategy = STRATEGIES[this.data.strategy] || simpleNavMeshStrategy;
            this.navMeshSystem.switchStrategy(strategy);
        }
    }
})