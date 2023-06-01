import * as AFRAME from 'aframe';
import type { Entity, StrictSystem } from "aframe";
import { NavMeshStrategy } from "./strategy/strategy.interface";

/** @internal */
export const NavMeshSystem = AFRAME.registerSystem('nav-mesh', {
    schema: {},
    active: false,

    init: function() {
        this.navMeshEntities = [];
        this.navMeshes = [];
        this.navMeshStrategy = undefined;
    },

    registerNavMesh: function(el: Entity) {
        this.navMeshEntities.push(el);
        this.updateNavMeshes();
    },

    unregisterNavMesh: function(el: Entity) {
        var index = this.navMeshEntities.indexOf(el);
        this.navMeshEntities.splice(index, 1);
        this.updateNavMeshes();
    },

    updateNavMeshes: function() {
        this.navMeshes = this.navMeshEntities
            .map(el => el.getObject3D('mesh') as THREE.Mesh)
            .filter(mesh => mesh);
    },

    switchStrategy: function(strategy: any) {
        this.navMeshStrategy = strategy;
    },

    approveMovement: function(oldPosition: THREE.Vector3, newPosition: THREE.Vector3, candidateValidator: any) {
        return this.navMeshStrategy!.approveMovement(oldPosition, newPosition, this.navMeshes, candidateValidator || (() => true));
    }
}) satisfies StrictSystem<{navMeshEntities: Array<Entity>, navMeshes: Array<THREE.Mesh>, navMeshStrategy?: NavMeshStrategy}>;
