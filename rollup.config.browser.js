import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript';
import ts from 'typescript';
import autoprefixer from 'autoprefixer';

export default {
    input: './src/browser/index.ts',
    output: [{
        file: './dist/bundle.browser.js',
        format: 'system',
        sourcemap: true
    }],
    plugins: [
        typescript({
            typescript: ts
        }),
        postcss({
            plugins: [
                autoprefixer(),
            ],
            // modules: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        resolve(),
        commonjs(),
    ],
    external: [
        'react',
        'react-dom',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'moment',
        'moment-timezone'
    ]
};