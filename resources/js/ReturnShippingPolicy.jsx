import React from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import PolicyLayout from "./PolicyLayout";
import { useTranslation } from "./hooks/useTranslation";

const ReturnShippingPolicy = ({ generals = [], services = [] }) => {
    const { t } = useTranslation();
    const content =
        generals.find((x) => x.correlative === "exchange_policy")
            ?.description ?? "";

    return (
        <PolicyLayout
            title="Políticas de Devolución"
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
                <ReturnShippingPolicy {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
