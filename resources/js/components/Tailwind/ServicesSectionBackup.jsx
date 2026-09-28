import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

/**
 * Backup of the original dual-mode Services Section (Soluciones y servicios EAS)
 * Mode 1: Swiper grid carousel of 3 cards
 * Mode 2: Detailed full-featured card view triggered on click with 'Volver a soluciones' button
 */
const ServicesSectionBackup = ({
    servicesList = [],
    trataments = null,
    isMobile = false,
    scrollToTop = () => {},
    FormattedText = null,
    ScrollReveal = null,
}) => {
    const [activeServiceIdx, setActiveServiceIdx] = useState(0);
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(null);

    const TitleWrapper = FormattedText || (({ text, boldClassName }) => <span>{text}</span>);
    const RevealWrapper = ScrollReveal || (({ children, className = "" }) => <div className={className}>{children}</div>);

    if (!servicesList || servicesList.length === 0) return null;

    return (
        <section
            id="sectores"
            className="pb-12 pt-8 px-4 sm:px-6 md:px-12 bg-white relative w-full"
        >
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 outline-none focus:outline-none">
                {/* Section Header */}
                <RevealWrapper
                    direction="up"
                    staggerDelay={0.15}
                    className="flex flex-col mb-10 md:mb-14 gap-4"
                >
                    <div className="max-w-4xl">
                        <h2 className="font-brinnan text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                            <TitleWrapper
                                text={
                                    trataments?.title ||
                                    "Soluciones y servicios *EAS*"
                                }
                                boldClassName="font-bold text-brand-main"
                            />
                        </h2>
                    </div>
                </RevealWrapper>

                {/* Service Cards Grid */}
                <AnimatePresence mode="wait">
                    {selectedServiceIdx === null ? (
                        <motion.div
                            key="cards-grid"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <RevealWrapper direction="up" staggerDelay={0.15}>
                                {/* Swiper Carousel - 3 items on desktop */}
                                <Swiper
                                    modules={[Autoplay]}
                                    spaceBetween={isMobile ? 20 : 40}
                                    slidesPerView={1.1}
                                    centeredSlides={isMobile}
                                    autoplay={{ delay: 5000, disableOnInteraction: true }}
                                    breakpoints={{
                                        640: { slidesPerView: 1.5, spaceBetween: 28 },
                                        768: { slidesPerView: 2.2, spaceBetween: 32 },
                                        1024: { slidesPerView: 3, spaceBetween: 40 },
                                        1280: { slidesPerView: 3, spaceBetween: 48 },
                                    }}
                                    className="pb-4 !overflow-visible"
                                >
                                    {servicesList.map((service, idx) => (
                                        <SwiperSlide key={idx} className="h-auto">
                                            <div
                                                className="group cursor-pointer h-full"
                                                onClick={() => {
                                                    setActiveServiceIdx(idx);
                                                    setSelectedServiceIdx(idx);
                                                }}
                                            >
                                                <div className="relative h-[360px] sm:h-[380px] lg:h-[420px] xl:h-[440px] rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-1">
                                                    {/* Image */}
                                                    <img
                                                        src={
                                                            service.image
                                                                ? `/api/service/media/${service.image}`
                                                                : "/api/cover/thumbnail/null"
                                                        }
                                                        alt={service.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        onError={(e) =>
                                                            (e.target.src = "/api/cover/thumbnail/null")
                                                        }
                                                    />
                                                    {/* Deep Oceanic Slate Gradient Overlay */}
                                                    <div
                                                        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                                                        style={{
                                                            background:
                                                                "linear-gradient(180deg, rgba(25, 53, 77, 0) 32%, rgba(25, 53, 77, 0.42) 52%, rgba(25, 53, 77, 0.88) 72%, #19354d 95%)",
                                                        }}
                                                    />

                                                    {/* Content overlay - title at bottom left */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 pr-28 sm:pr-32 z-10 pointer-events-none">
                                                        <h3 className="font-brinnan text-white text-lg sm:text-xl font-medium leading-snug drop-shadow-sm">
                                                            {service.title}
                                                        </h3>
                                                    </div>

                                                    {/* Bottom-right smooth curved notch cutout */}
                                                    <svg
                                                        className="absolute bottom-0 right-0 w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] pointer-events-none z-10"
                                                        viewBox="0 0 80 80"
                                                        fill="#ffffff"
                                                    >
                                                        <path d="M 0 80 A 18 18 0 0 0 18 62 A 44 44 0 0 1 62 18 A 18 18 0 0 0 80 0 L 80 80 Z" />
                                                    </svg>

                                                    {/* Circular action button */}
                                                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 pointer-events-none">
                                                        <div className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] rounded-full bg-[#19354d] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(25,53,77,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#12283a]">
                                                            <ArrowRight
                                                                size={20}
                                                                strokeWidth={2.2}
                                                                className="text-white transition-transform duration-300 group-hover:translate-x-0.5"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </RevealWrapper>
                        </motion.div>
                    ) : (
                        /* Detail Carousel View */
                        <motion.div
                            key="detail-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Back Button */}
                            <button
                                onClick={() => setSelectedServiceIdx(null)}
                                className="inline-flex items-center gap-2.5 mb-6 px-3.5 py-1.5 -ml-3.5 rounded-full text-brand-main hover:text-brand-dark hover:bg-brand-main/10 font-medium text-[15.5px] transition-all duration-200 group cursor-pointer"
                            >
                                <ArrowLeft
                                    size={20}
                                    strokeWidth={2.2}
                                    className="group-hover:-translate-x-1.5 transition-transform duration-200"
                                />
                                <span>Volver a soluciones</span>
                            </button>

                            <div className="relative w-full">
                                {/* Left Navigation Button */}
                                <button
                                    onClick={() =>
                                        setActiveServiceIdx(
                                            (p) =>
                                                (p - 1 + servicesList.length) %
                                                servicesList.length,
                                        )
                                    }
                                    className="flex absolute left-2 md:-left-8 lg:-left-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#19354d] text-white items-center justify-center shadow-[0_4px_18px_rgba(25,53,77,0.35)] hover:bg-[#12283a] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
                                    aria-label="Anterior solución"
                                >
                                    <ArrowLeft
                                        size={22}
                                        strokeWidth={2.2}
                                        className="text-white group-hover:-translate-x-0.5 transition-transform duration-300"
                                    />
                                </button>

                                {/* Right Navigation Button */}
                                <button
                                    onClick={() =>
                                        setActiveServiceIdx(
                                            (p) => (p + 1) % servicesList.length,
                                        )
                                    }
                                    className="flex absolute right-2 md:-right-8 lg:-right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#19354d] text-white items-center justify-center shadow-[0_4px_18px_rgba(25,53,77,0.35)] hover:bg-[#12283a] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
                                    aria-label="Siguiente solución"
                                >
                                    <ArrowRight
                                        size={22}
                                        strokeWidth={2.2}
                                        className="text-white group-hover:translate-x-0.5 transition-transform duration-300"
                                    />
                                </button>

                                <div className="relative h-[520px] sm:h-[600px] lg:h-[620px] w-full flex items-center justify-center perspective-1000 px-2 sm:px-4 md:px-8">
                                    <AnimatePresence mode="popLayout">
                                        {servicesList.map((service, idx) => {
                                            if (idx !== activeServiceIdx) return null;
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        x: 200,
                                                        scale: 0.9,
                                                        filter: "blur(20px)",
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                        scale: 1,
                                                        filter: "blur(0px)",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        x: -200,
                                                        scale: 0.9,
                                                        filter: "blur(20px)",
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        ease: "circOut",
                                                    }}
                                                    className="absolute inset-0 w-full h-full"
                                                >
                                                    <div className="bg-white/80 backdrop-blur-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[30px] md:rounded-[40px] overflow-hidden w-full h-full flex flex-col lg:flex-row relative group">
                                                        <div className="hidden absolute right-6 bottom-6 opacity-50">
                                                            <img
                                                                src="/assets/img/seguridad.webp"
                                                                className="w-48 object-contain select-none pointer-events-none"
                                                                alt="Placa de Seguridad de Autenticidad NGS"
                                                            />
                                                        </div>

                                                        {/* Image half */}
                                                        <div className="w-full lg:w-1/2 h-[220px] sm:h-[280px] lg:h-full shrink-0 relative overflow-hidden bg-gray-200">
                                                            <img
                                                                src={
                                                                    service.image
                                                                        ? `/api/service/media/${service.image}`
                                                                        : "/api/cover/thumbnail/null"
                                                                }
                                                                alt={service.title}
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                                onError={(e) =>
                                                                    (e.target.src =
                                                                        "/api/cover/thumbnail/null")
                                                                }
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden" />
                                                        </div>

                                                        {/* Content half */}
                                                        <div className="w-full lg:w-1/2 p-5 sm:p-6 md:p-10 lg:p-16 flex flex-col justify-center overflow-y-auto">
                                                            <h3 className="font-brinnan text-xl sm:text-2xl md:text-3xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                                                                {service.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed mb-10">
                                                                {service.description}
                                                            </p>

                                                            {service.characteristics?.length >
                                                                0 && (
                                                                <div className="space-y-4 mb-10">
                                                                    {service.characteristics.map(
                                                                        (char, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="flex items-start gap-3"
                                                                            >
                                                                                <CheckCircle2
                                                                                    size={18}
                                                                                    className="text-brand-main mt-0.5 shrink-0"
                                                                                />
                                                                                <span className="text-gray-700 font-medium text-sm">
                                                                                    {char}
                                                                                </span>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                                                <a
                                                                    href="#contacto"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        scrollToTop();
                                                                    }}
                                                                    className="bg-brand-accent uppercase text-white px-8 py-4 rounded-full font-semibold hover:scale-105 duration-300 transition-all w-max text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-2"
                                                                >
                                                                    Solicitar Cotización{" "}
                                                                    <ArrowRight size={16} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ServicesSectionBackup;
