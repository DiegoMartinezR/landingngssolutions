import React from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import PolicyLayout from "./PolicyLayout";
import { useTranslation } from "./hooks/useTranslation";

const PrivacyPolicy = ({ generals = [], services = [], socials = [] }) => {
    const { t } = useTranslation();
    const content =
        generals.find((x) => x.correlative === "privacy_policy")?.description ??
        "";

    return (
        <PolicyLayout
            title="Política de Privacidad"
            content={content}
            generals={generals}
            services={services}
            socials={socials}
        />
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <PrivacyPolicy {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
