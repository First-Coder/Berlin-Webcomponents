const {tailwindTransform} = require('postcss-lit');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: {
        files: ['./src/**/*.{ts,js,html}'],
        transform: {
            ts: tailwindTransform
        }
    },
    theme: {
        extend: {
            colors: {
                'police-red': '#E40322',
            }
        },
    },
    plugins: [],
}

