import { simpleNavMeshStrategy } from "./strategy/simple-strategy";
import { scanNavMeshStrategy } from "./strategy/scan-strategy";

const STRATEGIES = {
    'simple': simpleNavMeshStrategy,
    'scan': scanNavMeshStrategy
}

AFRAME.registerComponent('nav-mesh-strategy', {
    schema: {
        strategy: { default: 'scan' }
    },
    init: function() {
        this.navMeshSystem = this.el.sceneEl.systems['nav-mesh'];
        this.navMeshSystem.active = true;
        this.updateStrategy = () => {
            const strategy = STRATEGIES[this.data.strategy] || simpleNavMeshStrategy;
            this.navMeshSystem.switchStrategy(strategy);
        };
        this.updateStrategy();
    },
    update: function(oldData) {
        if(oldData.strategy !== this.data.strategy) {
            this.updateStrategy();
        }
    },

})