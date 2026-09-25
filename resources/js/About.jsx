import React, { useState } from "react";
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
import {
    FaGraduationCap,
    FaLightbulb,
    FaSeedling,
    FaVenus,
    FaShieldAlt,
} from "react-icons/fa";
import StatsSection from "./components/Tailwind/About/StatsSection ";
import { CarritoProvider } from "./context/CarritoContext";

const About = ({ about, showSlogan = true, posts, indicators }) => {
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    return (
        <>
            <Header
                showSlogan={showSlogan}
                backgroundType="image"
                backgroundSrc="assets/img/about/bg-about.png"
                backgroundHeight="h-[40vh] md:h-[70vh]"
                backgroundPosition="object-center blur-[2px]"
            >
                <div className="absolute inset-0 flex items-end md:items-center justify-center text-center ">
                    <div className="text-white p-6">
                        <h1 className="text-[30.66px] md:text-[58.21px] 2xl:text-[72.21px] md:leading-[65.32px] 2xl:leading-[90.32px] font-bold max-w-5xl tracking-[0.01em]">
                            ¡Tu mejor aliadx en <br />
                            el cuidado menstrual!
                        </h1>
                    </div>
                </div>
            </Header>
            <div className="relative z-10">
                <FeaturesSection />
                <div className="bg-[#EFE5FF] h-4 lg:hidden"></div>
                {/* Certificaciones Section */}
                <div className="flex lg:h-full lg:items-center flex-col lg:flex-row w-full md:max-w-2xl lg:gap-16 px-[5%] lg:max-w-6xl 2xl:max-w-[84rem] lg:px-0 mx-auto py-12 2xl:py-16">
                    <p className="font-poppins lg:w-6/12 md:text-[22.63px]  lg:text-[18.45px] 2xl:text-[24.45px] xl:leading-[33px] tracking-wider text-justify font-light">
                        weFem se enorgullece de contar con los más altos
                        estándares de calidad y seguridad en la fabricación de
                        todos nuestros productos menstruales. Poseemos el
                        prestigioso registro sanitario de la FDA, asegurando que
                        nuestros productos cumplen con las estrictas normas de
                        salud y seguridad de los Estados Unidos. Además, hemos
                        obtenido la certificación ISO 9001, un reconocimiento
                        internacional que respalda nuestra dedicación a la
                        excelencia en la gestión de calidad.
                        <br />
                        <br />
                        En el ámbito nacional, contamos con el registro
                        sanitario de DIGEMID en Perú, demostrando nuestro
                        compromiso con la salud y bienestar de nuestras usuarias
                        peruanas. Estos logros reflejan nuestra constante
                        búsqueda de la excelencia, garantizando a nuestras
                        clientas la confianza de que nuestros productos son
                        seguros, efectivos y fabricados con los más altos
                        estándares de calidad a nivel mundial.
                    </p>

                    <img
                        src="/assets/img/about/image-about.png"
                        className="w-full h-[600px] mt-4 lg:mt-0  lg:w-6/12 lg:h-[530px]   2xl:w-6/12 2xl:h-[660px] object-cover object-right-top"
                        alt="image"
                    />
                </div>

                {/* Logos Section */}
                <div
                    className="py-12 text-white"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(128,113,182,1) 0%, rgba(192,175,225,1) 100%)",
                    }}
                >
                    <div className="px-[5%] flex flex-col justify-center items-center md:flex-row md:justify-around   mx-auto gap-6">
                        <img
                            onMouseEnter={() => setShowModal1(true)}
                            src="https://i.ibb.co/931mypkH/image.png"
                            className="brightness-0 grayscale-0 invert w-[120.97px]  lg:w-[150.97px] h-auto 2xl:w-[226.97px] 2xl:h-[169.95px] object-contain cursor-pointer"
                            alt="Certificado 1"
                        />
                        <img
                            src="https://i.ibb.co/NgMJf8d8/image.png"
                            className="brightness-0 grayscale-0 invert w-[250.23px] lg:w-[300.23px] h-auto 2xl:w-[428.23px] 2xl:h-[136.41px] object-contain"
                            alt="Certificado 2"
                        />
                        <img
                            onMouseEnter={() => setShowModal2(true)}
                            src="https://i.ibb.co/sdGcCP7B/image.png"
                            className="brightness-0 grayscale-0 invert w-[90.07px] lg:w-[100.07px] h-auto 2xl:w-[171.07px] 2xl:h-[171.07px] object-contain cursor-pointer"
                            alt="Certificado 3"
                        />
                    </div>
                </div>

                {/* Beneficios Section */}
                <StatsSection indicators={indicators} />

                {/* Iconos Section */}
                <div className="bg-[#FC58BE] mb-8">
                    <div className="bg-[#FC58BE] py-12 flex items-center justify-center p-4">
                        <div className="flex flex-wrap justify-center gap-8 mx-auto">
                            {[
                                {
                                    icon: "/assets/img/about/educacion.png",
                                    text: "Accesabilidad\ny educación",
                                },
                                {
                                    icon: "/assets/img/about/innovacion.png",
                                    text: "Innovación\ncontinua",
                                },
                                {
                                    icon: "/assets/img/about/accesabilidad.png",
                                    text: "Accesabilidad\ny educación",
                                },
                                {
                                    icon: "/assets/img/about/sostenibilidad.png",
                                    text: "Sostenibilidad\nambiental",
                                },
                                {
                                    icon: "/assets/img/about/calidad.png",
                                    text: "Calidad y\nseguridad",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="w-[120px] h-[120px] lg:w-[170px] lg:h-[170px] 2xl:w-[200px] 2xl:h-[200px] border border-white rounded-full 
                            flex items-center justify-center transition-transform duration-300 ease-in-out 
                            flex-col text-center hover:scale-105 cursor-pointer"
                                >
                                    <div className="icon-circle  lg:mb-4 flex flex-col items-center justify-center gap-2 md:gap-1 lg:gap-4">
                                        <img
                                            src={item.icon}
                                            className="brightness-0 grayscale invert h-[30px]  md:h-[40px] lg:h-[50px]     2xl:h-[53px] w-auto"
                                        />
                                        <p className="text-white  text-[11.71px] lg:text-[18.81px] 2xl:text-[21.81px] leading-tight max-w-[150px]">
                                            {item.text
                                                .split("\n")
                                                .map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <InstagramSection posts={posts} />

                <Footer />
            </div>
            {/* Modals */}
            {/* Modals */}
            {showModal1 && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000080] min-h-screen"
                    style={{ backdropFilter: "blur(10px)" }}
                    onMouseLeave={() => setShowModal1(false)}
                >
                    <div className="relative">
                        <img
                            src="https://i.ibb.co/XfWn6hNG/image.png"
                            className="rounded-3xl max-h-[90vh] object-cover"
                            alt="Certificado Detalle 1"
                        />
                        <button
                            className="rounded-full z-10 px-4 py-2 bg-[#5F48B7] absolute -top-2 -right-2 text-xl text-white"
                            onClick={() => setShowModal1(false)}
                        >
                            x
                        </button>
                    </div>
                </div>
            )}

            {showModal2 && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000080] min-h-screen"
                    style={{ backdropFilter: "blur(10px)" }}
                    onMouseLeave={() => setShowModal2(false)}
                >
                    <div className="relative">
                        <img
                            src="https://i.ibb.co/cSfwb7vH/image.png"
                            className="rounded-3xl max-h-[90vh] object-cover"
                            alt="Certificado Detalle 2"
                        />
                        <button
                            className="rounded-full z-10 px-4 py-2 bg-[#5F48B7] absolute -top-2 -right-2 text-xl text-white"
                            onClick={() => setShowModal2(false)}
                        >
                            x
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <About {...properties} />
            </Base>
        </CarritoProvider>
    );
});
