import {defineConfig, defineProject, mergeConfig} from 'vitest/config';
import { fileURLToPath } from 'node:url';
import viteConfig from "./vite.config";
import storybookTest from "@storybook/addon-vitest/vitest-plugin";
import * as path from "node:path";

const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            projects: [
                defineProject({
                    plugins: [
                        storybookTest({
                            // The location of your Storybook config, main.js|ts
                            configDir: path.join(dirname, '.storybook'),
                            // This should match your package.json script to run Storybook
                            // The --ci flag will skip prompts and not open a browser
                            storybookScript: 'yarn storybook --ci',
                        }),
                    ],
                    test: {
                        name: 'storybook',
                        // Enable browser mode
                        browser: {
                            enabled: true,
                            // Make sure to install Playwright
                            provider: 'playwright',
                            headless: true,
                            instances: [{ browser: 'chromium' }],
                        },
                        setupFiles: ['./.storybook/vitest.setup.ts'],
                    },
                }),
            ],
        },
    })
);

// export default defineConfig({
//     test: {
//         name: 'storybook',
//         environment: 'jsdom',
//         reporters: ['default', 'json'],
//         outputFile: '.vitest-results.json',
//         setupFiles: ['.storybook/vitest.setup.ts'],
//     },
// });
