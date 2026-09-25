// animationVariants.js
export const scrollEffects = {
    // Efecto básico mejorado
    gentleFade: {
        offscreen: { opacity: 0, y: 20 },
        onscreen: {
            opacity: 1,
            y: 0,
            transition: {
                type: "tween",
                ease: "easeOut",
                duration: 0.6,
            },
        },
    },

    // Efecto de deslizamiento suave
    smoothSlide: {
        offscreen: { opacity: 0, y: 40, rotateX: 5 },
        onscreen: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 80,
                duration: 0.8,
            },
        },
    },

    // Efecto de carta que aparece
    cardAppear: {
        offscreen: { opacity: 0, scale: 0.95, rotateY: 5 },
        onscreen: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring",
                bounce: 0.2,
                duration: 0.7,
            },
        },
    },

    // Efecto de onda suave
    gentleWave: {
        offscreen: { opacity: 0, y: 30, rotateZ: -1 },
        onscreen: {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 0.9,
            },
        },
    },

    // Nueva variante: Slide lateral persistente
    persistentSlide: {
        offscreen: {
            opacity: 0,
            x: -100, // Desde izquierda (usar x: 100 para derecha)
            transition: { duration: 0 }, // Inmediato al salir de pantalla
        },
        onscreen: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1], // Curva de easing personalizada
            },
        },
        // Estado persistente (se mantiene visible)
        persistent: {
            opacity: 1,
            x: 0,
            transition: { duration: 0 },
        },
    },

    // Variante desde derecha
    persistentSlideRight: {
        offscreen: {
            opacity: 0,
            x: 100, // Desde derecha
            transition: { duration: 0 },
        },
        onscreen: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 90,
                damping: 12,
                duration: 0.8,
            },
        },
        persistent: {
            opacity: 1,
            x: 0,
            transition: { duration: 0 },
        },
    },

    // Variante con profundidad 3D
    persistentSlide3D: {
        offscreen: {
            opacity: 0,
            x: -120,
            rotateY: 15, // Efecto 3D
            transformStyle: "preserve-3d",
        },
        onscreen: {
            opacity: 1,
            x: 0,
            rotateY: 0,
            transition: {
                type: "spring",
                stiffness: 85,
                damping: 10,
                duration: 0.9,
            },
        },
        persistent: {
            opacity: 1,
            x: 0,
            rotateY: 0,
        },
    },
};
