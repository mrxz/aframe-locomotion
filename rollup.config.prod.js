import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
    {
        input: 'src/main.ts',
        plugins: [
            nodeResolve({ resolveOnly: ['aframe-typescript'] }),
            typescript({ compilerOptions: { declaration: true, declarationDir: 'typings' }}),
            terser(),
        ],
        external: ['aframe', 'three'],
        output: [
            {
                name: 'aframe-locomotion',
                file: pkg.browser,
                format: 'umd',
                globals: {
                    aframe: 'AFRAME',
                    three: 'THREE'
                }
            },
            {
                file: pkg.module,
                format: 'es'
            },
        ],
    },
    {
        input: './dist/typings/main.d.ts',
        output: [{ file: "dist/aframe-locomotion.d.ts", format: "es" }],
        external: ['aframe', 'three'],
        plugins: [dts()],
    }
]