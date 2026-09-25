import { Cookies } from "sode-extend-react";
import BasicRest from "../BasicRest";

class TestimoniesRest extends BasicRest {
    path = "admin/testimonies";
    hasFiles = true;

    syncGoogle = async () => {
        try {
            const res = await fetch(`/api/${this.path}/sync-google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
                }
            });
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };
}

export default TestimoniesRest;
