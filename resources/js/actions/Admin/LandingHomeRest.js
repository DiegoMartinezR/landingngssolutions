import { Fetch, Notify } from "sode-extend-react";
import BasicRest from "../BasicRest";

class LandingHomeRest extends BasicRest {
    path = "admin/landing_home";
    hasFiles = true;

    translate = async (payload) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/translate`,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (!status)
                throw new Error(
                    result?.message || "Error al guardar traducción"
                );
            return result;
        } catch (error) {
            Notify.error(error.message);
            return null;
        }
    };

    getByLang = async (langId) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/by_lang/${langId}`
            );
            if (!status)
                throw new Error(
                    result?.message || "Error al obtener traducciones"
                );
            return result;
        } catch (error) {
            Notify.error(error.message);
            return null;
        }
    };
}

export default LandingHomeRest;
