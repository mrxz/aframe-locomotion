import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
    {
        input: 'src/main.ts',
        plugins: [
            nodeResolve({ resolveOnly: ['aframe-typescript'] }),
            typescript(),
        ],
        external: ['aframe'],
        output: [
            {
                name: 'aframe-locomotion',
                file: pkg.browser,
                format: 'umd',
                globals: {
                    aframe: 'AFRAME'
                }
            }
        ],
    }
]