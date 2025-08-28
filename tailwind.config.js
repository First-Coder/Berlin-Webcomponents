const {tailwindTransform} = require('postcss-lit');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: {
        files: ['./src/**/*.{ts,js,html}'],
        transform: {
            ts: tailwindTransform
        }
    },
    theme: {
        extend: {},
    },
    plugins: [],
}

