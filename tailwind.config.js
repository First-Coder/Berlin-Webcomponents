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
                'retro-blue': '#0076dd'
            },
            boxShadow: {
                'retro-input-shadow': '0 1px 1px rgba(0,0,0,.075) inset,0 0px 8px 0px rgba(102,175,233,.8)',
                'header': '0 2px 5px rgba(0, 0, 0, .1)',
            }
        },
    },
    plugins: [],
}