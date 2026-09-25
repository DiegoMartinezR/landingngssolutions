/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            fontFamily: {
                kanit: ["Kanit", "sans-serif"],
                bebas: ["Bebas Neue", "serif"],
                poppins: ["Aspekta ", "serif"],
                quicksand: ["Quicksand", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
                brinnan: ["Brinnan", "sans-serif"],
                acumin: ["Acumin Variable Concept", "sans-serif"],
                sans: ["Acumin Variable Concept", "Montserrat", "Quicksand", "sans-serif"],
            },
            colors: {
                azul: "#224483",
                negro: "#242424",
                primary: "#60a9be",
                accent: "#d57748",
                secondary: "#7aa7ba",
                dark: "#2e515b",
                brand: {
                    main: "#60a9be",
                    accent: "#d57748",
                    dark: "#2e515b",
                    light: "#e6e6e6",
                    gray: "#7aa7ba",
                },
                "brand-dark": "#2e515b",
                "brand-main": "#60a9be",
                "brand-accent": "#d57748",
                "brand-light": "#e6e6e6",
                "brand-gray": "#7aa7ba",
            },
            padding: {
                primary: "5%",
            },
        },
    },
    plugins: [
        require("tailwindcss-animated"),
        function ({ addUtilities }) {
            const newUtilities = {
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
                ".text-gradient": {
                    background:
                        "linear-gradient(to bottom, #ffffff, #82cbe8)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                    display: "inline-block",
                },
            };

            addUtilities(newUtilities);
        },
    ],
};
