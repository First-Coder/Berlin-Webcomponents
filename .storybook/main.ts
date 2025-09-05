import type {StorybookConfig} from '@storybook/web-components-vite';

const config: StorybookConfig = {
    "stories": [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        {
            name: "@storybook/addon-vitest",
            options: {
                resultsFile: '.vitest-results.json',
                project: 'storybook',
            }
        }
    ],
    "framework": {
        "name": "@storybook/web-components-vite",
        "options": {}
    },
    // staticDirs: ['../public'],
};
export default config;