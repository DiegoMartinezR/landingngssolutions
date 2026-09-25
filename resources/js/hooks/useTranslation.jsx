import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const getNestedValue = (obj, path, fallback = "") => {
    // 1. Buscar en el formato "key.subkey"
    const parts = path.split(".");

    // Si es una clave simple (sin puntos)
    if (parts.length === 1) {
        return obj[path] || fallback;
    }

    // 2. Dividir en clave padre y subclave
    const parentKey = parts.slice(0, -1).join("."); // "admin.sidebar"
    const childKey = parts.slice(-1)[0]; // "dashboard"

    // 3. Acceder al valor anidado
    return obj[parentKey]?.[childKey] || fallback;
};

export const useTranslation = () => {
    const { translations, loading, error } = useContext(LanguageContext);

    const t = (fullKey, fallback = "") => {
        // Si hay error o carga, devuelve el fallback inmediatamente
        if (loading || error) return fallback;

        return getNestedValue(translations, fullKey, fallback);
    };

    return {
        t,
        loading, // Exporta estados para manejar en componentes
        error,
    };
};
