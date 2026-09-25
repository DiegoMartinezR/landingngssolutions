import React from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import PolicyLayout from "./PolicyLayout";
import { useTranslation } from "./hooks/useTranslation";

const CookiesPolicy = ({ generals = [], services = [] }) => {
    const { t } = useTranslation();
    const content =
        generals.find((x) => x.correlative === "cookies_policy")?.description ??
        "";
    //{t("public.footer.cookies", "Política de cookies")}
    return (
        <PolicyLayout
            title="Política de Cookies"
            content={content}
            generals={generals}
            services={services}
        />
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <CookiesPolicy {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
