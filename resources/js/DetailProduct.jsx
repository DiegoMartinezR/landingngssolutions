import React from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";
import FeaturesSection from "./components/Tailwind/Welcome/FeaturesSection";
import BenefitsSection from "./components/Tailwind/Welcome/BenefitsSection";
import ProductCarousel from "./components/Tailwind/Products/ProductCarousel";
import QuizSection from "./components/Tailwind/Welcome/QuizSection";
import TopSaleSection from "./components/Tailwind/Welcome/TopSaleSection";
import GuaranteeSection from "./components/Tailwind/Welcome/GuaranteeSection";
import WeLoversSection from "./components/Tailwind/Welcome/WeLoversSections";
import NotSureSection from "./components/Tailwind/Welcome/NotSureSection";
import InstagramSection from "./components/Tailwind/Welcome/InstagramSection";
import Footer from "./components/Tailwind/Footer";
import ProductFilter from "./components/Tailwind/Products/ProductFilter";
import Detail from "./components/Tailwind/DetailProduct/Detail";
import WeDiskSection from "./components/Tailwind/Instructions/WeDiskSection";
import WeCupSection from "./components/Tailwind/Instructions/WeCupSection";
import { CarritoProvider } from "./context/CarritoContext";

const DetailProduct = ({
    sliders,
    items,
    supplies,
    testimonies,
    popups,
    showSlogan = true,
    item,
    products_featured,
}) => {
    const tipoSlider = "vua";
    const products = [
        {
            id: 1,
            name: "weTotal",
            description: "Disco + Esterilizador",

            price: 255,
            discount: 179.9,
            final_price: 179.9,
            image: "https://i.ibb.co/fV6JQ7Bf/e668d950658ae3c60479b23cdc546252.png",
        },
        {
            id: 2,
            name: "wePack",
            description: "Disco + Esterilizador",

            price: 230,
            discount: 149.9,
            final_price: 149.9,
            image: "https://i.ibb.co/zyjGBDv/dd77e7ec81f52f1e46c68e0cb7e3db80.png",
        },
        {
            id: 3,
            name: "weDisk",
            description: "Disco mestrual",

            price: 180,
            discount: 159.9,
            final_price: 159.9,
            image: "https://i.ibb.co/yFYSFPtJ/35b45868b7de6ab7b4b48f5bf5e380cd.png ",
        },
        {
            id: 4,
            name: "weDisk",
            description: "Disco mestrual",

            price: 180,
            discount: 159.9,
            final_price: 159.9,
            image: "https://i.ibb.co/yFYSFPtJ/35b45868b7de6ab7b4b48f5bf5e380cd.png ",
        },
    ];
    console.log(item);
    return (
        <>
            <Header showSlogan={showSlogan}></Header>
            <div className="relative z-10">
                <Detail item={item} />
                {item.category.slug === "copas-menstruales" && <WeCupSection />}
                {item.category.slug === "discos-menstruales" && (
                    <WeDiskSection />
                )}

                <ProductCarousel products={products_featured}>
                    <h2 className="md:text-3xl 2xl:text-4xl font-bold flex gap-4 items-start justify-center">
                        ¿Te sientes lista? Compra aquí{" "}
                    </h2>
                </ProductCarousel>
                <Footer />
            </div>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <DetailProduct {...properties} />
            </Base>
        </CarritoProvider>
    );
});
