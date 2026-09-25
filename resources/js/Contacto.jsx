import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown, Phone, Mail, Building2, Clock } from "lucide-react";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ContactForm from "./Components/Contact/ContactForm";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";

// Animaciones
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.6,
        },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const buttonHover = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
    },
};

const ContactoPage = ({ landing, sedes, whatsapp, staff, generals }) => {
    const landingHero = landing?.find(
        (item) => item.correlative === "page_contact_hero",
    );
    const landingHelp = landing?.find(
        (item) => item.correlative === "page_contact_help",
    );
    const sedesValidas = Array.isArray(sedes) ? sedes : [];
    const generalsValidos = Array.isArray(generals) ? generals : [];

    const { t } = useTranslation();
    const openBooking = (type = "appointment") => {
        // Implement booking modal logic if needed or redirect
        window.location.href = "/?open=" + type;
    };

    return (
        <div className="font-kanit text-slate-800 bg-white min-h-screen">
            <Header openBooking={openBooking} generals={generals} />

            {sedesValidas.length > 0 ? (
                <main>
                    {/* Hero Section with Form */}
                    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-primary">
                        {/* Background with Image and Gradients */}
                        <div className="absolute inset-0 z-0">
                            {landingHero?.image && (
                                <img
                                    src={`/api/landing_home/media/${landingHero.image}`}
                                    alt="Contact Background"
                                    className="w-full h-full object-cover opacity-30 transform scale-110 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/40"></div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                                {/* Left Side: Text Content */}
                                <motion.div
                                    className="lg:w-1/2 text-white"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                >
                                    {landingHero && (
                                        <>
                                            <motion.h1
                                                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
                                                variants={slideUp}
                                            >
                                                <TextWithHighlight
                                                    text={landingHero.title}
                                                    split_coma={true}
                                                />
                                            </motion.h1>
                                            <motion.p
                                                className="text-xl md:text-2xl text-blue-100/80 font-light leading-relaxed mb-10 max-w-xl"
                                                variants={fadeIn}
                                            >
                                                {landingHero.description}
                                            </motion.p>
                                        </>
                                    )}
                                </motion.div>

                                {/* Right Side: Glassmorphic Form Container */}
                                <motion.div
                                    className="lg:w-1/2 w-full"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                                        <div className="relative z-10 contact-form-premium">
                                            <ContactForm />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <MaintenancePage />
            )}
            <Footer />

            <style>{`
                .contact-form-premium input, 
                .contact-form-premium textarea, 
                .contact-form-premium select {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    border-radius: 1rem !important;
                    padding: 1rem !important;
                }
                .contact-form-premium input::placeholder, 
                .contact-form-premium textarea::placeholder {
                    color: rgba(255, 255, 255, 0.4) !important;
                }
                .contact-form-premium label {
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-size: 0.875rem !important;
                    font-weight: 500 !important;
                    margin-bottom: 0.5rem !important;
                }
        
              
              
            `}</style>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <ContactoPage {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
