import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: 'src/main.js',
    plugins: [
        terser(),
    ],
    output: [
        {
            name: 'aframe-locomotion',
            file: pkg.browser,
            format: 'umd',
        },
        {
            file: pkg.module,
            format: 'es'
        },
    ],
};