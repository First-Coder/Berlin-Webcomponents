// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'BerlinComponents',
            fileName: () => 'bundle',
            formats: ['es'],
        },
        rollupOptions: {
            output: [
                {
                    format: 'es',
                    entryFileNames: 'bundle.js',
                },
            ],
        },
        sourcemap: true,
        target: 'es2019',
        outDir: 'dist',
        emptyOutDir: true,
    },
});