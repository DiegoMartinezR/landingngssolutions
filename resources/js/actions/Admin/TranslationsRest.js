import { Fetch, Notify } from "sode-extend-react";
import BasicRest from "../BasicRest";

class TranslationsRest extends BasicRest {
    path = "admin/translations";

    // Nuevo método específico para traducciones
    translate = async ({ group, key, value, lang_id }) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/translate`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        group,
                        key,
                        value,
                        lang_id,
                    }),
                }
            );

            if (!status)
                throw new Error(
                    result?.message || "Error al guardar traducción"
                );

            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Correcto",
                body: "Traducción guardada exitosamente",
                type: "success",
            });

            return result;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return null;
        }
    };
}

export default TranslationsRest;
