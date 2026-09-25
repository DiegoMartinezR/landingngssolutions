// Polyfill global para navegadores
if (typeof global === "undefined") {
    window.global = window;
}

// Polyfill para process (necesario para algunas librerías)
if (typeof process === "undefined") {
    window.process = {
        env: {},
        versions: {},
        cwd: () => "/",
    };
}
