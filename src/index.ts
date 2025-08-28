const modules = import.meta.glob([
    './components/**/*.ts',
    '!./**/*.stories.*',
    '!./**/*.spec.*',
    '!./**/*.test.*',
    '!./**/*.d.ts',
    '!./index.ts',
], {
    eager: true,
});

// Optional: Für Debugzwecke auflisten
console.debug('Geladene Module:', Object.keys(modules));
