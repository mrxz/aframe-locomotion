import { simpleNavMeshStrategy } from "./strategy/simple-strategy";
import { scanNavMeshStrategy } from "./strategy/scan-strategy";
import { NavMeshStrategy } from "./strategy/strategy.interface";

const STRATEGIES: {[key: string]: NavMeshStrategy} = {
    'simple': simpleNavMeshStrategy,
    'scan': scanNavMeshStrategy
}

export const NavMeshStrategyComponent = AFRAME.registerComponent('nav-mesh-strategy', {
    schema: {
        strategy: { type: 'string', default: 'scan' }
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
});
