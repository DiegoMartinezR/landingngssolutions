import React, { useState, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    MapPin,
    CheckCircle,
    Clock,
    Shield,
    Star,
    Check,
    ArrowRight,
    ArrowLeft,
    Calendar,
    MessageCircle,
    CircleCheck,
} from "lucide-react";

import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import TextWithHighlight from "./Utils/TextWithHighlight";
import BookingModal from "./components/BookingModal";

// --- HOOKS PERSONALIZADOS (IDÉNTICOS A HOME.JSX) ---
const useScroll = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollY;
};

const useElementScrollProgress = (ref) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalScrollable = windowHeight + rect.height;
            const currentScroll = windowHeight - rect.top;
            let rawProgress = currentScroll / totalScrollable;
            rawProgress = Math.max(0, Math.min(1, rawProgress));
            setProgress(rawProgress);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ref]);
    return progress;
};

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
                    observer.unobserve(domRef.current);
                }
            },
            { threshold: 0.1, rootMargin: "50px" },
        );

        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                isVisible
                    ? "opacity-100 translate-y-0 blur-none"
                    : "opacity-0 translate-y-24 blur-[10px]"
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const ParallaxLayer = ({ children, speedY = 0, className = "" }) => {
    const ref = useRef(null);
    const progress = useElementScrollProgress(ref);
    const moveY = (progress - 0.5) * speedY;

    return (
        <div ref={ref} className={`will-change-transform ${className}`}>
            <div
                style={{ transform: `translate3d(0, ${moveY}px, 0)` }}
                className="transition-transform duration-75 ease-out"
            >
                {children}
            </div>
        </div>
    );
};

const Button = ({
    children,
    variant = "primary",
    className = "",
    onClick,
    type = "button",
}) => {
    const baseStyle =
        "relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full transition-all duration-500 overflow-hidden group tracking-wide";
    const variants = {
        primary:
            "bg-primary text-white hover:bg-dark hover:shadow-[0_10px_30px_rgba(27,63,144,0.3)]",
        accent: "bg-accent text-primary hover:bg-[#a6bb32] hover:shadow-[0_10px_30px_rgba(184,207,56,0.3)]",
        outline:
            "border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-dark",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>
    );
};

// Hook for Horizontal Scroll (Sticky effect like Home.jsx)
const useHorizontalScroll = () => {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const maxScroll = rect.height - windowHeight;
            let currentProgress = -rect.top / maxScroll;
            setProgress(Math.max(0, Math.min(1, currentProgress || 0)));
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return [ref, progress];
};
// --- MAIN PAGE COMPONENT ---
const FacilityDetailPage = ({
    facility,
    services = [],
    generals = [],
    landing = [],
}) => {
    const scrollY = useScroll();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [actionType, setActionType] = useState("appointment");
    const [horizontalRef, horizontalProgress] = useHorizontalScroll();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const galleryImages = useMemo(() => {
        if (!facility.gallery || facility.gallery.length === 0) {
            return [
                "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
            ];
        }
        return facility.gallery.map((img) => `/api/facility/media/${img}`);
    }, [facility.gallery]);

    useEffect(() => {
        if (galleryImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [galleryImages]);

    const openBooking = (type = "appointment", service = null) => {
        setActionType(type);
        setSelectedService(service);
        setModalOpen(true);
    };

    // --- LOGICAL CONTENT MERGE (DB + DEFAULTS) ---
    const content = useMemo(() => {
        const defaultContent = {
            h1: `Professional Cleaning in *${facility.title}*`,
            hero_description:
                facility.description ||
                "Expert cleaning services for your home and office.",
            intro: `At Azamora Cleaning Group, we understand that ${facility.title} homes and businesses demand the highest standards. Our professional team is dedicated to maintaining the beauty and hygiene of your space.`,
            services_title: "Specialized *Solutions*",
            services_intro: `Explore our specialized cleaning solutions in ${facility.title}.`,
            why_us_title: `Unmatched *Quality* in ${facility.title}.`,
            why_choose_us: [
                "Attention to Detail",
                "Licensed, Insured & Bonded",
                "Eco-Friendly Products Available",
                "100% Satisfaction Guaranteed",
            ],
            differentiator_title: "The Azamora Standard",
            differentiator_description: `Why we are the preferred choice in *${facility.title}*.`,
            differentiator_items: [
                "Experienced Staff",
                "Reliable Scheduling",
                "Advanced Equipment",
                "Customized Solutions",
            ],
            coverage_message: `We proudly serve *${facility.title}* and surrounding areas.`,
            local_message: `Your trusted local cleaning partner in ${facility.title}.`,
            final_message:
                "Experience the difference of a truly professional clean.",
            seo_block: `Best cleaning services in ${facility.title}, CA. Residential and commercial cleaning by experts.`,
        };
        return { ...defaultContent, ...(facility.detailed_content || {}) };
    }, [facility]);
    console.log(facility);

    const supportPhone =
        generals.find((x) => x.correlative === "support_phone")?.description ||
        "";
    const supportSms =
        generals.find((x) => x.correlative === "support_sms")?.description ||
        supportPhone;

    return (
        <div className="min-h-screen bg-white font-kanit text-slate-800 overflow-clip">
            <style
                dangerouslySetInnerHTML={{
                    __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }`,
                }}
            />

            <Header openBooking={openBooking} generals={generals} />

            {/* 1. HERO (HIGH IMPACT - SYNCED WITH HOME.JSX) */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
                <div
                    className="absolute inset-0 w-full h-full transform scale-105"
                    style={{
                        transform: `translateY(${scrollY * 0.4}px) scale(1.05)`,
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={galleryImages[currentImageIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            alt={facility.title}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ParallaxLayer speedY={-150}>
                        <RevealOnScroll delay={150}>
                            <a
                                href="/offices"
                                className="inline-flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:gap-6 transition-all group"
                            >
                                <ArrowLeft size={16} /> Back to Areas
                            </a>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter leading-[0.85] text-white">
                                <TextWithHighlight
                                    text={content.h1}
                                    split_coma={true}
                                />
                            </h1>
                        </RevealOnScroll>
                        <RevealOnScroll delay={300}>
                            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 font-light tracking-wide leading-relaxed">
                                {content.hero_description}
                            </p>
                        </RevealOnScroll>
                        <RevealOnScroll delay={450}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    onClick={() => openBooking("estimate")}
                                    variant="accent"
                                    className="w-full sm:w-auto text-lg px-10"
                                >
                                    Request Estimate <ArrowRight size={20} />
                                </Button>
                                <Button
                                    onClick={() => openBooking("appointment")}
                                    variant="outline"
                                    className="w-full sm:w-auto text-lg px-10"
                                >
                                    Book Now
                                </Button>
                            </div>
                        </RevealOnScroll>
                    </ParallaxLayer>
                </div>
            </section>

            {/* 2. STATEMENT / INTRO AREA */}
            <section className="bg-white pt-24 pb-12 md:pt-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-12 text-center mb-16">
                            <RevealOnScroll>
                                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[0.95] mb-10 uppercase">
                                    <TextWithHighlight
                                        text={content.local_message}
                                        split_coma={true}
                                        color="text-secondary"
                                    />
                                </h2>
                                <p className="text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
                                    {content.intro}
                                </p>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION - IDENTICAL TO HOME.JSX */}
            {services && services.length > 0 && (
                <section
                    id="services"
                    ref={horizontalRef}
                    className="relative bg-[#f8f9fa] py-24"
                    style={{ height: "350vh" }}
                >
                    {/* Sticky Container */}
                    <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-[#f8f9fa]">
                        <div className="w-full px-4 text-center shrink-0 z-10 pb-4">
                            <h3 className="text-4xl md:text-7xl font-black text-primary tracking-tighter mb-4">
                                <TextWithHighlight
                                    text={content.services_title}
                                    split_coma={true}
                                    color="text-secondary"
                                />
                            </h3>
                            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
                                {content.services_intro}
                            </p>
                        </div>

                        <div className="flex-1 w-full relative">
                            <div
                                className="absolute top-0 left-0 h-full flex items-center will-change-transform"
                                style={{
                                    width: `${services.length * 100}vw`,
                                    transform: `translate3d(-${horizontalProgress * (100 - 100 / services.length)}%, 0, 0)`,
                                }}
                            >
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="w-screen h-full flex items-center justify-center px-4 md:px-12 pt-12 pb-12"
                                    >
                                        <div className="w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 flex flex-col md:flex-row border border-gray-100 h-full min-h-[65vh] transition-all duration-500">
                                            <div className="w-full md:w-[45%] h-64 md:h-auto relative overflow-hidden group shrink-0">
                                                <img
                                                    src={
                                                        "/api/service/media/" +
                                                        service.image
                                                    }
                                                    alt={service.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </div>
                                            <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white overflow-y-auto custom-scrollbar">
                                                <h4 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1b3f90] mb-6 tracking-tighter leading-tight">
                                                    {service.title}
                                                </h4>
                                                <p className="text-lg md:text-xl text-gray-500 mb-8 font-light leading-relaxed">
                                                    {service.description}
                                                </p>
                                                <ul className="grid grid-cols-1 gap-x-6 gap-y-3 mb-10">
                                                    {service.characteristics
                                                        ?.slice(0, 6)
                                                        .map((char, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-3 text-gray-600 font-light text-sm"
                                                            >
                                                                <CheckCircle
                                                                    size={18}
                                                                    className="text-[#b8cf38] shrink-0 mt-0.5"
                                                                />
                                                                <span>
                                                                    {char}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                                    <button
                                                        onClick={() =>
                                                            openBooking(
                                                                "appointment",
                                                                service,
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-3 bg-[#1b3f90] text-white px-8 py-4 rounded-full font-black text-sm shadow-xl shadow-[#1b3f90]/20 hover:shadow-2xl hover:shadow-[#1b3f90]/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 group/btn uppercase tracking-widest"
                                                    >
                                                        Book Now
                                                        <ArrowRight
                                                            size={18}
                                                            className="transform group-hover/btn:translate-x-1 transition-transform"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openBooking(
                                                                "estimate",
                                                                service,
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-3 bg-white border-2 border-[#1b3f90]/5 text-[#1b3f90] px-8 py-4 rounded-full font-black text-sm hover:border-[#1b3f90]/20 hover:bg-gray-50 transition-all duration-300 group/btn uppercase tracking-widest"
                                                    >
                                                        Request Estimate
                                                        <ArrowRight
                                                            size={18}
                                                            className="text-[#1b3f90]/30 transform group-hover/btn:translate-x-1 transition-transform"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* BENTO STATS / FEATURES (PROCESS STEP-BY-STEP) */}
            <div className="flex justify-center my-24 relative z-20 px-4">
                <RevealOnScroll
                    delay={100}
                    className="w-full max-w-5xl bg-primary rounded-[4rem] p-12 md:p-20 relative overflow-hidden group shadow-[0_40px_60px_rgba(27,63,144,0.4)]"
                >
                    {/* Background Texture/Grain */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start">
                        {/* Title Column */}
                        <div className="lg:w-2/5">
                            <h3 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                                <TextWithHighlight
                                    text={content.why_us_title}
                                    split_coma={true}
                                    color="text-secondary"
                                />
                            </h3>
                            <div className="w-24 h-1 bg-accent rounded-full"></div>
                        </div>

                        {/* Process Column (STAGGERED DRAWING CHECKS FLOW) */}
                        <div className="lg:w-3/5 space-y-8 relative">
                            {content.why_choose_us.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.25,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="flex gap-4 items-center group/item relative z-10"
                                >
                                    {/* Animated Drawing Checkmark */}
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>

                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-8 h-8 text-accent"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <motion.path
                                                d="M20 6L9 17l-5-5"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: i * 0.25 + 0.3, // Delay after parent div appears
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        </svg>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-xl md:text-3xl font-medium tracking-tighter text-white  leading-none transition-all duration-500 group-hover/item:text-accent group-hover/item:translate-x-4">
                                            {item}
                                        </h4>
                                        <div className="mt-4 w-16 h-1 bg-accent/30 rounded-full group-hover/item:w-32 group-hover/item:bg-accent transition-all duration-500"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </RevealOnScroll>
            </div>

            {/* 4. THE DIFFERENTIATION (MATCHING BENTO GRID BOTTOM CARDS) */}
            <section className="py-24 md:py-32 bg-[#f8f9fa] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <RevealOnScroll>
                            <h2 className="text-4xl max-w-5xl mx-auto md:text-8xl font-black text-primary tracking-tighter leading-[0.85] mb-12">
                                <TextWithHighlight
                                    text={content.differentiator_title}
                                    split_coma={true}
                                    color="text-secondary"
                                />
                            </h2>
                            <div className="text-xl md:text-2xl text-gray-400 font-light max-w-4xl mx-auto leading-relaxed border-l-4 border-accent pl-8 text-left italic">
                                <TextWithHighlight
                                    text={content.differentiator_description}
                                    color="text-primary font-bold not-italic"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.differentiator_items.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, x: 20 }}
                                whileInView={{ opacity: 1, y: 0, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 1.2,
                                    delay: i * 0.15,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full"
                            >
                                <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.02)] border border-gray-100 h-full flex items-center justify-center text-center group hover:-translate-y-4 transition-all duration-700">
                                    <span className="font-medium text-2xl tracking-tighter text-primary  leading-tight">
                                        {item}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FOOTER STICKY CTA (PREMIUM DARK FINISH) */}
            <section className="py-40 md:py-60 bg-primary relative overflow-hidden">
                {/* Decorative Blobs for Dark Mode */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <RevealOnScroll>
                        <h2 className="text-5xl md:text-8xl max-w-5xl mx-auto font-bold text-white tracking-tighter leading-[0.7] mb-24 drop-shadow-2xl select-none">
                            {content.final_message}
                        </h2>

                        <div className="flex flex-col items-center gap-16">
                            <Button
                                onClick={() => openBooking("estimate")}
                                variant="accent"
                                className="text-xl px-12 py-5"
                            >
                                Get a Quote Now
                            </Button>
                        </div>

                        {(content.coverage_message || content.seo_block) && (
                            <div className="max-w-5xl mx-auto pt-20 flex flex-col items-center">
                                {content.coverage_message && (
                                    <div className="flex flex-col items-center mb-16">
                                        <div className="w-24 h-px bg-white/20 mb-8"></div>
                                        <p className="text-xl md:text-3xl font-light text-white/50 italic text-center max-w-3xl leading-relaxed">
                                            <TextWithHighlight
                                                text={content.coverage_message}
                                                color="text-secondary font-black not-italic"
                                            />
                                        </p>
                                    </div>
                                )}

                                {content.seo_block && (
                                    <div className="w-full pt-16 border-t border-white/10 mt-16">
                                        <div className="max-w-4xl mx-auto">
                                            <p className="text-sm md:text-lg font-medium uppercase  text-white/60 leading-relaxed text-center transition-colors duration-500 hover:text-white">
                                                {content.seo_block}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </RevealOnScroll>
                </div>
            </section>

            {/* FLOATING MOBILE ACTION BAR */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-40px)] max-w-md md:hidden">
                <div className="bg-white/80 backdrop-blur-2xl border border-gray-200 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-1">
                    <a
                        href={`tel:${supportPhone}`}
                        className="p-4 bg-primary text-white rounded-full flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                        <Phone size={14} /> Call
                    </a>
                    <a
                        href={`sms:${supportSms}`}
                        className="p-4 bg-secondary text-primary rounded-full flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                        <MessageCircle size={14} /> SMS
                    </a>
                    <button
                        onClick={() => openBooking("estimate")}
                        className="p-4 bg-accent text-primary rounded-full flex-[1.5] flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                        <Calendar size={14} /> Estimate
                    </button>
                </div>
            </div>

            <Footer generals={generals} services={services} />

            <BookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                service={selectedService}
                allServices={services}
                actionType={actionType}
            />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <FacilityDetailPage {...properties} />
            </Base>
        </CarritoProvider>,
    );
});

export default FacilityDetailPage;
