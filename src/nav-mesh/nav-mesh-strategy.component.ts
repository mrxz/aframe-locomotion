import * as AFRAME from 'aframe';
import { simpleNavMeshStrategy } from "./strategy/simple-strategy";
import { scanNavMeshStrategy } from "./strategy/scan-strategy";
import { NavMeshStrategy } from "./strategy/strategy.interface";

const STRATEGIES: {[key: string]: NavMeshStrategy} = {
    'simple': simpleNavMeshStrategy,
    'scan': scanNavMeshStrategy
}

/**
 * Selects the nav mesh strategy that is used by all aframe-locomotion components.
 * This component should be added to the scene if you want to make use of nav mesh based functionality.
 * Once configured, nav meshes need to be marked using the {@link NavMeshComponent} component.
 *
 * @example
 * Add the `nav-mesh-strategy` component to the scene
 * ```HTML
 * <a-scene nav-mesh-strategy>
 *     <!-- entities with nav-mesh component -->
 * </a-scene>
 * ```
 *
 * > **Note:** In many cases the navigation meshes should not be visible. The `nav-mesh` component
 * doesn't handle this for you, so make sure to manually add `material="visible: false"` or hide
 * the mesh in some other way.
 */
const NavMeshStrategyComponent = AFRAME.registerComponent('nav-mesh-strategy', {
    schema: {
        /**
         * Either `simple` or `scan`. The `simple` strategy allows to check if movement is valid based on
         * the nav-mesh in a binary fashion (movement is either valid or not). The `scan` strategy falls
         * back to alternatives that are slightly to the side of the movement. This allows sliding across walls.
         */
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

declare module "aframe" {
    export interface Components {
        "nav-mesh-strategy": InstanceType<typeof NavMeshStrategyComponent>,
    }
}