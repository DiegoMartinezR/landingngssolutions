import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import CreateReactScript from "./Utils/CreateReactScript";
import WhatsApp from "./Utils/WhatsApp";
import { CarritoProvider } from "./context/CarritoContext";
import MessagesRest from "./actions/MessagesRest";
import Swal from "sweetalert2";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
    Facebook,
    Instagram,
    Linkedin,
    MapPin,
    Phone,
    CheckCircle2,
    ChevronDown,
    ArrowRight,
    ShieldCheck,
    Star,
    Activity,
    Sparkles,
    Clock,
    HeartHandshake,
    ChevronLeft,
    ChevronRight,
    ArrowRightLeft,
    Stethoscope,
    Mail,
    Award,
} from "lucide-react";

const messagesRest = new MessagesRest();

const getStoredUTMs = () => {
    const utms = {};
    [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ].forEach((key) => {
        const val = sessionStorage.getItem(key);
        if (val) utms[key] = val;
    });
    return utms;
};

// --- HELPER COMPONENT ---
const FormattedText = ({
    text,
    className = "",
    boldClassName = "text-brand-main font-bold",
}) => {
    if (!text) return null;
    const parts = text.split("*");
    return (
        <span className={className}>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <span key={i} className={boldClassName}>
                        {part}
                    </span>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                ),
            )}
        </span>
    );
};

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [sliderPos, setSliderPos] = useState(50);
    return (
        <div className="relative w-full h-[400px] md:h-[500px] xl:h-[600px] overflow-hidden rounded-[2rem] bg-gray-100 group shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            {/* After Image (Background) */}
            <img
                src={afterImage}
                className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                alt="Después"
            />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-100"
                    alt="Antes"
                />
            </div>

            {/* Slider Input */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Slider Visual Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center"
                style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
                <div className="w-10 h-10 rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center border border-gray-200">
                    <ArrowRightLeft size={18} className="text-brand-dark" />
                </div>
            </div>

            {/* Badges */}
            <div className="absolute top-6 left-6 bg-white/95 text-brand-dark px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase shadow z-10 select-none pointer-events-none transition-opacity duration-300">
                Antes
            </div>
            <div className="absolute top-6 right-6 bg-brand-main text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase shadow z-10 select-none pointer-events-none transition-opacity duration-300">
                Después
            </div>
        </div>
    );
};

const ScrollReveal = ({
    children,
    className = "",
    staggerDelay = 0.1,
    direction = "up",
}) => {
    const directionOffset = {
        up: { y: 120, x: 0 },
        down: { y: -120, x: 0 },
        left: { x: 120, y: 0 },
        right: { x: -120, y: 0 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            ...directionOffset[direction],
            filter: "blur(10px)",
            scale: 0.95,
        },
        show: {
            opacity: 1,
            y: 0,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 0.8,
                bounce: 0.3,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={className}
        >
            {React.Children.map(children, (child) => (
                <motion.div variants={itemVariants}>{child}</motion.div>
            ))}
        </motion.div>
    );
};

// --- MAIN APP COMPONENT ---
const Home = ({
    strenghts = [],
    indicators = [],
    landing = [],
    benefits = [],
    services = [],
    testimonies = [],
    staffs = [],
    promo = null,
    certifications = [],
    faqs = [],
    generals = [],
    specialities = [],
    facilities = [],
    socials = [],
}) => {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);
    const heroScale = useTransform(scrollY, [0, 800], [1, 1.1]);

    // Form Fields State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");
    const [age, setAge] = useState("");
    const [district, setDistrict] = useState("");
    const [selectedTreatment, setSelectedTreatment] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [activeServiceIdx, setActiveServiceIdx] = useState(0);
    const [activeCaseIdx, setActiveCaseIdx] = useState(0);

    const isAutoScrolling = useRef(false);
    const touchStartX = useRef(0);
    const touchStartXCase = useRef(0);

    const scrollToSection = (targetId, duration = 1500) => {
        const targetElement =
            targetId === "top"
                ? document.documentElement
                : document.getElementById(targetId);
        if (!targetElement) return;

        isAutoScrolling.current = true;

        // Update URL hash history smoothly
        const newHash =
            targetId === "top" ? window.location.pathname : `#${targetId}`;
        if (window.history.pushState) {
            window.history.pushState(null, null, newHash);
        } else {
            window.location.hash = newHash;
        }

        const start = window.scrollY || window.pageYOffset;
        const headerOffset = 100; // Account for fixed header height
        const target =
            targetId === "top"
                ? 0
                : Math.max(
                    0,
                    targetElement.getBoundingClientRect().top +
                    window.scrollY -
                    headerOffset,
                );
        const change = target - start;
        let startTime = null;

        const animateScroll = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Cubic ease-in-out curve
            const easeInOutCubic = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t * t + b;
                t -= 2;
                return (c / 2) * (t * t * t + 2) + b;
            };

            const run = easeInOutCubic(elapsed, start, change, duration);
            window.scrollTo(0, run);

            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                window.scrollTo(0, target);
                isAutoScrolling.current = false;
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const scrollToTop = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        scrollToSection("consulta", 1500);
    };

    // Scroll Spy: updates the URL hash as the user scrolls manually
    useEffect(() => {
        let isThrottled = false;
        const handleScrollSpy = () => {
            if (isThrottled || isAutoScrolling.current) return;
            isThrottled = true;

            requestAnimationFrame(() => {
                const sections = [
                    "consulta",
                    "resultados",
                    "tratamientos",
                    "nosotros",
                ];
                const headerOffset = 150; // offset check
                const scrollPosition = window.scrollY + headerOffset;

                for (const sectionId of sections) {
                    const el = document.getElementById(sectionId);
                    if (el) {
                        const top = el.offsetTop;
                        const height = el.offsetHeight;
                        if (
                            scrollPosition >= top &&
                            scrollPosition < top + height
                        ) {
                            const newHash =
                                sectionId === "consulta"
                                    ? window.location.pathname
                                    : `#${sectionId}`;
                            if (
                                window.location.hash !==
                                (sectionId === "consulta"
                                    ? ""
                                    : `#${sectionId}`)
                            ) {
                                window.history.replaceState(
                                    null,
                                    null,
                                    newHash,
                                );
                            }
                            break;
                        }
                    }
                }
                isThrottled = false;
            });
        };

        window.addEventListener("scroll", handleScrollSpy, { passive: true });
        return () => window.removeEventListener("scroll", handleScrollSpy);
    }, []);

    // PopState & Initial Hash Loader for smooth scrolling from history
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (hash) {
                setTimeout(() => {
                    scrollToSection(hash, 1500);
                }, 50);
            } else {
                scrollToSection("top", 1500);
            }
        };

        // Handle initial load with hash
        if (window.location.hash) {
            window.scrollTo(0, 0);
            const timer = setTimeout(() => {
                handleHashChange();
            }, 300);
            return () => clearTimeout(timer);
        }

        window.addEventListener("popstate", handleHashChange);
        return () => window.removeEventListener("popstate", handleHashChange);
    }, []);

    // Map Generals and Socials from collection arrays to readable configurations
    const generalsObj = {
        support_phone:
            generals.find((g) => g.correlative === "support_phone")
                ?.description || "+51 951 330 735",
        support_email:
            generals.find((g) => g.correlative === "support_email")
                ?.description || "contacto@capilaradvanced.com",
        footer_description:
            generals.find((g) => g.correlative === "footer_description")
                ?.description ||
            "Expertos en restauración capilar. Transformamos vidas a través nuestro innovador método Long FUE garantizando resultados 100% naturales y definitivos.",
        address:
            generals.find((g) => g.correlative === "address")?.description ||
            generals.find((g) => g.correlative === "address_principal")
                ?.description ||
            "Av. Mariscal La Mar, 638 - Miraflores",
    };

    const socialsObj = {
        facebook:
            socials.find(
                (s) =>
                    s.name.toLowerCase().includes("facebook") ||
                    s.icon.includes("facebook"),
            )?.link || "",
        instagram:
            socials.find(
                (s) =>
                    s.name.toLowerCase().includes("instagram") ||
                    s.icon.includes("instagram"),
            )?.link || "",
        tiktok:
            socials.find(
                (s) =>
                    s.name.toLowerCase().includes("tiktok") ||
                    s.icon.includes("tiktok"),
            )?.link || "",
        linkedin:
            socials.find(
                (s) =>
                    s.name.toLowerCase().includes("linkedin") ||
                    s.icon.includes("linkedin"),
            )?.link || "",
        youtube:
            socials.find(
                (s) =>
                    s.name.toLowerCase().includes("youtube") ||
                    s.icon.includes("youtube"),
            )?.link || "",
    };

    const getSection = (key) => landing.find((l) => l.correlative === key);

    // Map backend landing sections
    const hero = getSection("page_home_hero");
    const nosotros = getSection("page_home_mensaje");
    const diferencia = getSection("page_home_enfoque");
    const staffParams = getSection("page_home_staff");
    const trataments = getSection("page_home_services"); // title/subtitle for services
    const transformation = getSection("page_home_testimonies"); // title/subtitle for success cases

    // Form submission handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedService = services.find(
            (s) => s.title === selectedTreatment,
        );
        const serviceId = selectedService ? selectedService.id : null;
        const subject = `Evaluación Capilar - ${selectedTreatment || "General"}`;
        const descriptionStr = `Evaluación capilar solicitada. DNI: ${dni || "No provisto"}, Edad: ${age || "No provista"}, Distrito: ${district || "No provisto"}. Tratamiento de interés: ${selectedTreatment || "Ninguno"}.`;

        try {
            const result = await messagesRest.save(
                {
                    name,
                    phone,
                    email: email || `${phone}@capilaradvanced.com`, // Email fallback if blank
                    address: district, // Distrito maps to address column
                    service_id: serviceId,
                    description: descriptionStr,
                    subject,
                    ...getStoredUTMs(),
                },
                null,
                false,
            );

            if (!result) throw new Error();

            Swal.fire({
                title: "¡Solicitud Recibida!",
                text: "Nos pondremos en contacto contigo a la brevedad por WhatsApp para coordinar tu cita.",
                icon: "success",
                confirmButtonColor: "#2c7a62",
            });

            // Clear fields
            setName("");
            setPhone("");
            setEmail("");
            setDni("");
            setAge("");
            setDistrict("");
            setSelectedTreatment("");
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al enviar tu solicitud. Por favor, vuelve a intentarlo o comunícate vía WhatsApp.",
                icon: "error",
                confirmButtonColor: "#2c7a62",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const successCases = (testimonies || []).map((t) => ({
        id: t.id,
        patient: t.name,
        age: t.correlative,
        before: `/api/testimony/media/${t.image}`,
        after: `/api/testimony/media/${t.image_secondary}`,
        testimonial: t.description,
    }));

    const handleNextCase = () => {
        if (successCases.length === 0) return;
        setActiveCaseIdx((prev) => (prev + 1) % successCases.length);
    };
    const handlePrevCase = () => {
        if (successCases.length === 0) return;
        setActiveCaseIdx((prev) =>
            prev === 0 ? successCases.length - 1 : prev - 1,
        );
    };

    const nextService = () => {
        setActiveServiceIdx((prev) => (prev + 1) % services.length);
    };

    const prevService = () => {
        setActiveServiceIdx((prev) =>
            prev === 0 ? services.length - 1 : prev - 1,
        );
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextService();
            else prevService();
        }
    };

    const handleTouchStartCase = (e) => {
        touchStartXCase.current = e.touches[0].clientX;
    };

    const handleTouchEndCase = (e) => {
        const diff = touchStartXCase.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) handleNextCase();
            else handlePrevCase();
        }
    };

    const getServiceImage = (img, title, idx = 0) => {
        if (img && (img.startsWith("http") || img.startsWith("/"))) return img;
        if (img) return `/api/service/media/${img}`;
        const fallbacks = [
            "/assets/img/regenerated_image_1778873587965.png",
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800",
            "https://images.unsplash.com/photo-1580281658460-2d1114999983?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800",
        ];
        if (title?.toLowerCase().includes("trasplante")) return fallbacks[0];
        if (title?.toLowerCase().includes("exosoma")) return fallbacks[1];
        if (title?.toLowerCase().includes("barba"))
            return "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800";
        return fallbacks[idx % fallbacks.length];
    };

    return (
        <Base>
            <div className="font-sans text-gray-900 bg-[#f8f9fa] min-h-screen selection:bg-brand-main selection:text-white">
                {/* Floating WhatsApp CTA */}
                <WhatsApp data={generals} />

                <Header
                    scrollToForm={scrollToTop}
                    scrollToSection={scrollToSection}
                />

                {/* Hero Section with video background only */}
                <section
                    id="consulta"
                    className="relative w-full h-screen md:min-h-screen md:flex md:flex-col md:justify-center bg-brand-dark overflow-hidden pt-28 pb-16 md:pb-16 xl:py-24"
                >
                    {/* Parallax Background video */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{
                            y: heroY,
                            opacity: heroOpacity,
                            scale: heroScale,
                        }}
                    >
                        {hero?.video ? (
                            (() => {
                                const videoId =
                                    hero.video.match(
                                        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
                                    )?.[1] || hero.video;
                                if (
                                    hero.video.includes("youtube") ||
                                    hero.video.includes("youtu.be")
                                ) {
                                    return (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                                            className="absolute top-1/2 left-1/2 w-[250vw] h-[250vh] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-overlay"
                                            allow="autoplay; encrypted-media"
                                            style={{ border: "none" }}
                                        ></iframe>
                                    );
                                }
                                return (
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
                                    >
                                        <source
                                            src={hero.video}
                                            type="video/mp4"
                                        />
                                    </video>
                                );
                            })()
                        ) : (
                            <img
                                src={
                                    hero?.image
                                        ? `/api/landing_home/media/${hero.image}`
                                        : "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2600&auto=format&fit=crop"
                                }
                                alt="Microtrasplante Capilar"
                                className="w-full h-full object-cover object-top opacity-40 mix-blend-overlay"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-90"></div>
                    </motion.div>

                    <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <ScrollReveal
                            direction="up"
                            staggerDelay={0.2}
                            className="max-w-xl text-left"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-2xl   mb-8">
                                <span className="text-white text-xs lg:text-sm font-semibold tracking-widest ">
                                    {hero?.subtitle ||
                                        "Expertos en Técnica Long FUE"}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-[70px] font-light tracking-tight text-white leading-[1.05] mb-6">
                                {hero?.title ? (
                                    <FormattedText
                                        text={hero.title}
                                        boldClassName="font-medium text-brand-light italic"
                                    />
                                ) : (
                                    <>
                                        <span className="block font-medium">
                                            Recupera tu cabello
                                        </span>
                                        <span className="block text-brand-light italic mt-2">
                                            sin dolor y sin rapado.
                                        </span>
                                    </>
                                )}
                            </h1>

                            <p className="text-white text-md md:text-lg lg::text-xl font-light leading-relaxed max-w-xl mb-12 border-l-4 border-white/20  pl-6 py-1">
                                {hero?.description ||
                                    "Pioneros en Perú dedicados 100% al microtrasplante capilar. Resultados naturales, garantizados y definitivos desde el primer mes."}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="#resultados"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("resultados", 1500);
                                    }}
                                    className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs lg:text-sm tracking-widest uppercase"
                                >
                                    Ver Casos de Éxito
                                </a>
                            </div>
                        </ScrollReveal>

                        {/* Medical lead form card - only on desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block w-full relative max-w-lg mx-auto lg:ml-auto shadow-[0_20px_50px_rgba(26,60,52,0.1)]"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-main/30 to-transparent rounded-[40px] blur-3xl transform -rotate-3 z-0"></div>

                            <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/80 relative z-10">
                                <h3 className="text-2xl font-light text-brand-dark text-center mb-8 tracking-wide">
                                    Solicita una{" "}
                                    <span className="font-medium text-brand-main">
                                        evaluación médica
                                    </span>
                                </h3>

                                <form
                                    className="space-y-4"
                                    onSubmit={handleFormSubmit}
                                >
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={dni}
                                            onChange={(e) =>
                                                setDni(e.target.value)
                                            }
                                            placeholder="DNI"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={age}
                                            onChange={(e) =>
                                                setAge(e.target.value)
                                            }
                                            placeholder="Edad"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Teléfono / WhatsApp"
                                            required
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={district}
                                            onChange={(e) =>
                                                setDistrict(e.target.value)
                                            }
                                            placeholder="Distrito"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Correo electrónico (Opcional)"
                                        className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    {/* Treatment dropdown */}
                                    <div className="relative">
                                        <div
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen,
                                                )
                                            }
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all cursor-pointer font-medium flex justify-between items-center"
                                        >
                                            <span
                                                className={
                                                    selectedTreatment
                                                        ? "text-brand-dark"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {selectedTreatment ||
                                                    "Selecciona tratamiento"}
                                            </span>
                                            <ChevronDown
                                                className={`text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                                size={16}
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    className="absolute z-50 w-full mt-2 bg-white border border-brand-gray/30 rounded-2xl shadow-lg overflow-hidden"
                                                >
                                                    <div className="max-h-60 overflow-y-auto">
                                                        {services?.map(
                                                            (s, i) => (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => {
                                                                        setSelectedTreatment(
                                                                            s.title,
                                                                        );
                                                                        setIsDropdownOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className="px-6 py-3 text-sm text-brand-dark hover:bg-brand-main/10 cursor-pointer transition-colors"
                                                                >
                                                                    {s.title}
                                                                </div>
                                                            ),
                                                        )}
                                                        <div
                                                            onClick={() => {
                                                                setSelectedTreatment(
                                                                    "Quiero evaluación personalizada",
                                                                );
                                                                setIsDropdownOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="px-6 py-3 text-sm text-brand-dark hover:bg-brand-main/10 cursor-pointer transition-colors border-t border-brand-gray/10"
                                                        >
                                                            Quiero evaluación
                                                            personalizada
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-brand-main text-white py-4 rounded-full font-bold hover:bg-brand-dark transition-all mt-6 text-xs lg:text-sm tracking-widest uppercase shadow-[0_10px_20px_rgba(26,60,52,0.2)] hover:shadow-[0_15px_30px_rgba(26,60,52,0.3)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Agendar Evaluación Médica"
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-white mt-4 uppercase tracking-wider font-medium">
                                        Tus datos están protegidos y son
                                        confidenciales
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Mobile Form Section - displays form below hero on mobile screens */}
                <section className="lg:hidden bg-brand-dark py-12 px-4">
                    <div className="max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8 }}
                            className="w-full relative shadow-[0_20px_50px_rgba(26,60,52,0.1)]"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-main/30 to-transparent rounded-[40px] blur-3xl transform -rotate-3 z-0"></div>

                            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/80 relative z-10">
                                <h3 className="text-2xl font-light text-brand-dark text-center mb-8 tracking-wide">
                                    Solicita una{" "}
                                    <span className="font-medium text-brand-main">
                                        evaluación médica
                                    </span>
                                </h3>

                                <form
                                    className="space-y-4"
                                    onSubmit={handleFormSubmit}
                                >
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={dni}
                                            onChange={(e) =>
                                                setDni(e.target.value)
                                            }
                                            placeholder="DNI"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={age}
                                            onChange={(e) =>
                                                setAge(e.target.value)
                                            }
                                            placeholder="Edad"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Teléfono / WhatsApp"
                                            required
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={district}
                                            onChange={(e) =>
                                                setDistrict(e.target.value)
                                            }
                                            placeholder="Distrito"
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Correo electrónico (Opcional)"
                                        className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark placeholder-gray-600 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    {/* Treatment dropdown */}
                                    <div className="relative">
                                        <div
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen,
                                                )
                                            }
                                            className="w-full bg-white border-2 border-white px-6 py-4 rounded-full text-sm text-brand-dark outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all cursor-pointer font-medium flex justify-between items-center"
                                        >
                                            <span
                                                className={
                                                    selectedTreatment
                                                        ? "text-brand-dark"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {selectedTreatment ||
                                                    "Selecciona tratamiento"}
                                            </span>
                                            <ChevronDown
                                                className={`text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                                size={16}
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    className="absolute z-50 w-full mt-2 bg-white border border-brand-gray/30 rounded-2xl shadow-lg overflow-hidden"
                                                >
                                                    <div className="max-h-60 overflow-y-auto">
                                                        {services?.map(
                                                            (s, i) => (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => {
                                                                        setSelectedTreatment(
                                                                            s.title,
                                                                        );
                                                                        setIsDropdownOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className="px-6 py-3 text-sm text-brand-dark hover:bg-brand-main/10 cursor-pointer transition-colors"
                                                                >
                                                                    {s.title}
                                                                </div>
                                                            ),
                                                        )}
                                                        <div
                                                            onClick={() => {
                                                                setSelectedTreatment(
                                                                    "Quiero evaluación personalizada",
                                                                );
                                                                setIsDropdownOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="px-6 py-3 text-sm text-brand-dark hover:bg-brand-main/10 cursor-pointer transition-colors border-t border-brand-gray/10"
                                                        >
                                                            Quiero evaluación
                                                            personalizada
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-brand-main text-white py-4 rounded-full font-bold hover:bg-brand-dark transition-all mt-6 text-xs lg:text-sm tracking-widest uppercase shadow-[0_10px_20px_rgba(26,60,52,0.2)] hover:shadow-[0_15px_30px_rgba(26,60,52,0.3)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Agendar Evaluación Médica"
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-white mt-4 uppercase tracking-wider font-medium">
                                        Tus datos están protegidos y son
                                        confidenciales
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Nosotros (About Us) Section */}
                {nosotros && (
                    <section
                        // id="nosotros"
                        className="hidden py-24 md:py-32 bg-white relative overflow-hidden"
                    >
                        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
                            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                                {/* Left Side: Images composition */}
                                <div className="lg:col-span-6 relative w-full">
                                    <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-gray-100 z-10">
                                        <img
                                            src={
                                                nosotros.image
                                                    ? `/api/landing_home/media/${nosotros.image}`
                                                    : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800"
                                            }
                                            alt={
                                                nosotros.subtitle || "Nosotros"
                                            }
                                            className="w-full h-[450px] md:h-[550px] object-cover object-center"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800";
                                            }}
                                        />
                                    </div>
                                    {/* Decorative circle shapes */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[20px] border-brand-main/10 -z-10 animate-pulse"></div>
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border-[20px] border-brand-main/10 -z-10 animate-pulse delay-700"></div>
                                </div>

                                {/* Right Side: Text info */}
                                <div className="lg:col-span-6 space-y-8">
                                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-main/10 text-brand-main font-bold text-xs uppercase tracking-[0.2em]">
                                        <Sparkles className="w-4 h-4" />
                                        {nosotros.subtitle || "Nuestra Clínica"}
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                                        <FormattedText
                                            text={
                                                nosotros.title ||
                                                "Tu bienestar en las mejores manos"
                                            }
                                            boldClassName="font-medium text-brand-main block mt-2"
                                        />
                                    </h2>

                                    <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed border-l-4 border-brand-main pl-6 py-2">
                                        {nosotros.description ||
                                            "En Capilar Advanced, combinamos ciencia y tecnología folicular de punta para restaurar tu densidad capilar con una apariencia 100% natural, garantizando el éxito definitivo de tu trasplante."}
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <a
                                            href="#consulta"
                                            onClick={scrollToTop}
                                            className="bg-brand-main text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-dark transition-all text-sm tracking-widest uppercase shadow-md"
                                        >
                                            Reservar Evaluación
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Clinical Evidence (Before & After Results) */}
                {transformation && successCases.length > 0 && (
                    <section
                        id="resultados"
                        className="py-24 md:py-32 bg-white overflow-hidden relative border-t border-gray-100"
                    >
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FAF9F6] pointer-events-none transform skew-x-12 translate-x-32 hidden lg:block opacity-50 z-0"></div>

                        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
                            <ScrollReveal
                                direction="up"
                                staggerDelay={0.1}
                                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
                            >
                                <div className="max-w-2xl">
                                    <h6 className="text-brand-main font-semibold tracking-widest uppercase text-xs mb-3">
                                        {transformation.subtitle ||
                                            "Evidencia Clínica"}
                                    </h6>
                                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-brand-dark">
                                        <FormattedText
                                            text={
                                                transformation.title ||
                                                "Resultados que hablan *por sí mismos*"
                                            }
                                            boldClassName="font-medium text-brand-dark block mt-2"
                                        />
                                    </h2>
                                </div>
                                <div className="hidden md:flex gap-4">
                                    <button
                                        onClick={handlePrevCase}
                                        className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-main hover:text-white hover:border-brand-main transition-all group shadow-sm bg-white"
                                    >
                                        <ArrowRight
                                            size={20}
                                            className="rotate-180 transition-transform"
                                        />
                                    </button>
                                    <button
                                        onClick={handleNextCase}
                                        className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-main hover:text-white hover:border-brand-main transition-all group shadow-sm bg-white"
                                    >
                                        <ArrowRight
                                            size={20}
                                            className=" transition-transform"
                                        />
                                    </button>
                                </div>
                            </ScrollReveal>

                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.3 },
                                    },
                                }}
                                className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center lg:items-stretch"
                            >
                                {/* Slider Column */}
                                <motion.div
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 120,
                                            filter: "blur(10px)",
                                            scale: 0.95,
                                        },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 60,
                                                damping: 12,
                                                mass: 0.8,
                                                bounce: 0.3,
                                            },
                                        },
                                    }}
                                    className="lg:col-span-7 h-full flex flex-col"
                                    onTouchStart={handleTouchStartCase}
                                    onTouchEnd={handleTouchEndCase}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeCaseIdx}
                                            initial={{
                                                opacity: 0,
                                                x: -20,
                                                filter: "blur(4px)",
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: 1,
                                                filter: "blur(0px)",
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: 20,
                                                filter: "blur(4px)",
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeInOut",
                                            }}
                                            className="h-full w-full flex-1 min-h-[400px]"
                                        >
                                            <BeforeAfterSlider
                                                beforeImage={
                                                    successCases[activeCaseIdx]
                                                        .before
                                                }
                                                afterImage={
                                                    successCases[activeCaseIdx]
                                                        .after
                                                }
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>

                                {/* Patient Testimony Column */}
                                <motion.div
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 120,
                                            filter: "blur(10px)",
                                            scale: 0.95,
                                        },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 60,
                                                damping: 12,
                                                mass: 0.8,
                                                bounce: 0.3,
                                            },
                                        },
                                    }}
                                    className="lg:col-span-5 flex flex-col h-full"
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`info-${activeCaseIdx}`}
                                            initial={{
                                                opacity: 0,
                                                y: 30,
                                                filter: "blur(8px)",
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                filter: "blur(0px)",
                                            }}
                                            exit={{ opacity: 0, y: -30 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeInOut",
                                                delay: 0.1,
                                            }}
                                            className="bg-[#FAF9F6] p-8 md:p-12 rounded-[2rem] border border-brand-gray/10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full w-full flex-1 flex flex-col justify-center"
                                        >
                                            {/* Quote Icon */}
                                            <div className="text-brand-main/30 mb-6 drop-shadow-sm">
                                                <svg
                                                    width="48"
                                                    height="48"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                </svg>
                                            </div>

                                            <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed mb-8 italic">
                                                "
                                                {
                                                    successCases[activeCaseIdx]
                                                        .testimonial
                                                }
                                                "
                                            </p>

                                            <div className="border-t border-brand-gray/30 pt-8 mt-auto">
                                                <h4 className="font-semibold text-brand-dark text-xl mb-1">
                                                    {
                                                        successCases[
                                                            activeCaseIdx
                                                        ].patient
                                                    }
                                                </h4>
                                                <p className="text-gray-600 text-sm font-medium mb-6">
                                                    {
                                                        successCases[
                                                            activeCaseIdx
                                                        ].age
                                                    }
                                                </p>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Mobile Controls */}
                                    <div className="flex md:hidden justify-center gap-4 mt-8">
                                        <button
                                            onClick={handlePrevCase}
                                            className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-main hover:text-white transition-all bg-white shadow-sm"
                                        >
                                            <ArrowRight
                                                size={20}
                                                className="rotate-180"
                                            />
                                        </button>
                                        <button
                                            onClick={handleNextCase}
                                            className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-main hover:text-white transition-all bg-white shadow-sm"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <div className="flex justify-center mt-16">
                                <a
                                    href="#consulta"
                                    onClick={scrollToTop}
                                    className="bg-brand-main text-xs text-center  text-white px-8 py-4 rounded-full font-medium hover:bg-brand-dark transition-all lg:text-sm tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
                                >
                                    Quiero una Evaluación Personalizada{" "}
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Interactive Services Carousel */}
                {services && services.length > 0 && (
                    <section
                        id="tratamientos"
                        className="py-24 px-4 md:px-12 bg-white overflow-hidden"
                    >
                        <div className="max-w-[1400px] mx-auto outline-none focus:outline-none">
                            <ScrollReveal
                                direction="up"
                                staggerDelay={0.15}
                                className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
                            >
                                <div className="max-w-2xl">
                                    <h6 className="text-brand-main font-semibold tracking-widest uppercase text-xs mb-3">
                                        {trataments?.subtitle ||
                                            "Nuestros Servicios"}
                                    </h6>
                                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 leading-tight">
                                        <FormattedText
                                            text={
                                                trataments?.title ||
                                                "Protocolos Médicos *De Restauración*"
                                            }
                                            boldClassName="font-bold text-black"
                                        />
                                    </h2>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={prevService}
                                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextService}
                                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="up" staggerDelay={0.2}>
                                <div
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    className="relative h-[920px] sm:h-[780px] lg:h-[620px] w-full flex items-center justify-center perspective-1000"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {services.map((service, idx) => {
                                            if (idx !== activeServiceIdx)
                                                return null;
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
                                                    <div className="bg-[#f5f5f7] rounded-[40px] overflow-hidden w-full h-full flex flex-col lg:flex-row relative group">
                                                        {/* Image half */}
                                                        <div className="w-full lg:w-1/2 aspect-square lg:h-full shrink-0 relative overflow-hidden bg-gray-200">
                                                            <img
                                                                src={getServiceImage(
                                                                    service.image,
                                                                    service.title,
                                                                    idx,
                                                                )}
                                                                alt={
                                                                    service.title
                                                                }
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    e.target.src =
                                                                        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800";
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden"></div>
                                                        </div>

                                                        {/* Content half */}
                                                        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                                                            <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight">
                                                                {service.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed mb-10">
                                                                {
                                                                    service.description
                                                                }
                                                            </p>

                                                            {service
                                                                .characteristics
                                                                ?.length >
                                                                0 && (
                                                                    <div className="space-y-4 mb-10 border-l border-brand-main/30 pl-6">
                                                                        {service.characteristics.map(
                                                                            (
                                                                                char,
                                                                                i,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="flex items-start gap-3"
                                                                                >
                                                                                    <CheckCircle2
                                                                                        size={
                                                                                            18
                                                                                        }
                                                                                        className="text-brand-main mt-0.5 shrink-0"
                                                                                    />
                                                                                    <span className="text-gray-700 font-medium text-sm">
                                                                                        {
                                                                                            char
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                )}

                                                            <div className="flex flex-wrap gap-4">
                                                                <a
                                                                    href="#consulta"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        setSelectedTreatment(
                                                                            service.title,
                                                                        );
                                                                        scrollToTop();
                                                                    }}
                                                                    className="bg-brand-main text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-dark transition-all w-max text-sm tracking-wide shadow-md flex items-center gap-2"
                                                                >
                                                                    Solicitar
                                                                    Evaluación{" "}
                                                                    <ArrowRight
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>

                                {/* Dots indicator */}
                                <ScrollReveal direction="up">
                                    <div className="flex justify-center gap-3 mt-10">
                                        {services.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    setActiveServiceIdx(i)
                                                }
                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeServiceIdx ? "w-8 bg-brand-main" : "w-2 bg-brand-main/50"}`}
                                                aria-label={`Ir al servicio ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </ScrollReveal>
                            </ScrollReveal>
                        </div>
                    </section>
                )}

                {/* Bento Grid Features / Trust Swiper */}
                {strenghts && strenghts.length > 0 && (
                    <section
                        id="nosotros"
                        className="py-24 px-4 bg-[#FAF9F6] relative overflow-hidden border-y border-gray-200"
                    >
                        <div className="absolute inset-0 z-0 opacity-[0.15]">
                            <svg
                                className="w-full h-full"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <pattern
                                        id="dotGridLight"
                                        width="32"
                                        height="32"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <circle
                                            cx="2"
                                            cy="2"
                                            r="1.5"
                                            fill="#1A3C34"
                                        />
                                    </pattern>
                                </defs>
                                <rect
                                    width="100%"
                                    height="100%"
                                    fill="url(#dotGridLight)"
                                />
                            </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] z-0 pointer-events-none"></div>

                        <div className="max-w-[1400px] mx-auto relative z-10">
                            <ScrollReveal
                                direction="up"
                                staggerDelay={0.15}
                                className="text-center mb-16"
                            >
                                <h6 className="text-brand-main font-semibold tracking-widest uppercase text-xs mb-3">
                                    {diferencia?.subtitle ||
                                        "La Diferencia Clínica"}
                                </h6>
                                <h2 className="text-3xl md:text-5xl font-light text-brand-dark mb-6 tracking-tight">
                                    {diferencia?.title && (
                                        <FormattedText
                                            text={diferencia?.title}
                                            boldClassName="font-medium text-brand-dark "
                                        />
                                    )}
                                </h2>
                                <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                                    {diferencia?.description ||
                                        "Combinamos tecnología de vanguardia, ciencia y un equipo de élite para garantizar resultados naturales y duraderos."}
                                </p>
                            </ScrollReveal>

                            <ScrollReveal direction="up">
                                <div className="max-w-7xl mx-auto cursor-grab active:cursor-grabbing pb-8">
                                    <Swiper
                                        modules={[Autoplay]}
                                        spaceBetween={24}
                                        slidesPerView={1}
                                        breakpoints={{
                                            640: { slidesPerView: 2 },
                                            1024: { slidesPerView: 3 },
                                            1280: { slidesPerView: 4 },
                                        }}
                                        loop={true}
                                        speed={600}
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false,
                                        }}
                                        className="w-full !px-4 !pb-12"
                                    >
                                        {(strenghts && strenghts.length > 0
                                            ? strenghts
                                            : []
                                        ).map((st, i) => {
                                            const desc = [
                                                "Diseñamos una línea frontal acorde a tus facciones para un resultado completamente indetectable.",
                                                "Procedimientos realizados 100% por médicos cirujanos, asegurando los máximos estándares de calidad.",
                                                "Extracción e implantación folículo por folículo asegurando la más alta tasa de supervivencia.",
                                                "Seguimiento médico presencial guiado durante 12 meses para garantizar la evolución de cada folículo.",
                                                "Aplicación de anestesia local y protocolos mínimamente invasivos.",
                                            ];

                                            const icons = [
                                                Sparkles,
                                                Stethoscope,
                                                Activity,
                                                Clock,
                                                ShieldCheck,
                                            ];
                                            const IconComponent =
                                                icons[i % icons.length];

                                            return (
                                                <SwiperSlide
                                                    key={i}
                                                    className="!h-auto flex"
                                                >
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 50,
                                                            scale: 0.9,
                                                        }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                            amount: 0.2,
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            ease: [
                                                                0.25, 1, 0.5, 1,
                                                            ],
                                                        }}
                                                        className="bg-white p-8 md:p-10 rounded-xl border border-gray-100 flex flex-col items-start w-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(26,60,52,0.08)] transition-all overflow-hidden h-full group relative"
                                                    >
                                                        {st.image ? (
                                                            <div className="w-16 h-16 rounded-full   mb-6 transition-all duration-300 group-hover:scale-105 border border-gray-100/50 shadow-sm shrink-0">
                                                                <img
                                                                    src={`/api/strength/media/${st.image}`}
                                                                    alt={
                                                                        st.name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.target.src =
                                                                            "/api/cover/thumbnail/null";
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-16 h-16 rounded-full bg-brand-gray/5 text-brand-main flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-brand-main group-hover:text-white shrink-0">
                                                                <IconComponent
                                                                    size={28}
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                />
                                                            </div>
                                                        )}

                                                        <h3 className="font-medium text-brand-dark text-xl leading-tight mb-4">
                                                            {st.name}
                                                        </h3>

                                                        <p className="text-gray-600 text-md leading-relaxed font-light mt-auto">
                                                            {st.description ||
                                                                desc[
                                                                i %
                                                                desc.length
                                                                ]}
                                                        </p>
                                                    </motion.div>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>
                            </ScrollReveal>
                        </div>
                    </section>
                )}
                {/* Dynamic Indicators bottom band */}
                <section className="relative bg-white py-20 px-4 border-t border-gray-100 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <svg
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <pattern
                                    id="gridPatternIndicators"
                                    width="40"
                                    height="40"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path
                                        d="M0 40L40 0H20L0 20M40 40V20L20 40"
                                        stroke="#E5E7EB"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#gridPatternIndicators)"
                            />
                        </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white z-0 pointer-events-none"></div>

                    <div className="max-w-[1400px] mx-auto relative z-10">
                        {/* Mobile View Indicators */}
                        <div className="block md:hidden">
                            <Swiper
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                modules={[Autoplay]}
                                className="w-full"
                            >
                                {(indicators && indicators.length > 0
                                    ? indicators
                                    : [
                                        {
                                            name: "5000+",
                                            description:
                                                "Pacientes Satisfechos",
                                        },
                                        {
                                            name: "15+",
                                            description:
                                                "Años de Experiencia",
                                        },
                                        {
                                            name: "99%",
                                            description: "Tasa de Éxito",
                                        },
                                        {
                                            name: "24/7",
                                            description: "Soporte Médico",
                                        },
                                    ]
                                ).map((ind, idx) => {
                                    const incIcons = [
                                        HeartHandshake,
                                        Clock,
                                        Activity,
                                        ShieldCheck,
                                    ];
                                    const IncIcon =
                                        incIcons[idx % incIcons.length];

                                    return (
                                        <SwiperSlide key={idx}>
                                            <div className="flex flex-col items-center text-center px-4 group relative max-w-[280px] mx-auto">
                                                {ind.symbol ? (
                                                    <img
                                                        src={`/api/indicator/media/${ind.symbol}`}
                                                        alt={ind.name}
                                                        className="w-16 h-16 object-contain mb-6 transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="mb-6 w-16 h-16 rounded-2xl bg-brand-main/30 flex items-center justify-center border border-brand-main/50 group-hover:bg-brand-main group-hover:border-brand-main transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(44,122,98,0.6)]">
                                                        <IncIcon
                                                            size={28}
                                                            className="text-brand-light group-hover:text-white transition-colors duration-500"
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex items-baseline gap-1 mb-3">
                                                    <span className="text-4xl font-light tracking-tight text-brand-dark">
                                                        {ind.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 uppercase tracking-widest">
                                                    {ind.description}
                                                </span>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                        {/* Desktop View Indicators */}
                        <ScrollReveal
                            direction="up"
                            staggerDelay={0.1}
                            className="hidden md:flex flex-wrap justify-center gap-8 md:gap-12 w-full"
                        >
                            {(indicators && indicators.length > 0
                                ? indicators
                                : [
                                    {
                                        name: "5000+",
                                        description: "Pacientes Satisfechos",
                                    },
                                    {
                                        name: "15+",
                                        description: "Años de Experiencia",
                                    },
                                    {
                                        name: "99%",
                                        description: "Tasa de Éxito",
                                    },
                                    {
                                        name: "24/7",
                                        description: "Soporte Médico",
                                    },
                                ]
                            ).map((ind, idx) => {
                                const incIcons = [
                                    HeartHandshake,
                                    Clock,
                                    Activity,
                                    ShieldCheck,
                                ];
                                const IncIcon = incIcons[idx % incIcons.length];

                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center text-center px-4 group relative w-[calc(50%-1rem)] md:w-auto md:flex-1 max-w-[280px]"
                                    >
                                        {idx !== 0 && (
                                            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-brand-main/30 to-transparent"></div>
                                        )}

                                        {ind.symbol ? (
                                            <img
                                                src={`/api/indicator/media/${ind.symbol}`}
                                                alt={ind.name}
                                                className="w-16 h-16 object-contain mb-6 transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="mb-6 w-16 h-16 rounded-2xl bg-brand-main flex items-center justify-center border border-brand-main/50 group-hover:bg-brand-main group-hover:border-brand-main transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(44,122,98,0.6)]">
                                                <IncIcon
                                                    size={28}
                                                    className="text-white transition-colors duration-500"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-1 mb-3">
                                            <span className="text-4xl md:text-5xl font-light tracking-tight text-brand-dark">
                                                {ind.name}
                                            </span>
                                        </div>
                                        <span className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-widest">
                                            {ind.description}
                                        </span>
                                    </div>
                                );
                            })}
                        </ScrollReveal>
                    </div>
                </section>

                {/* Expert Staff Section */}
                {staffParams && (
                    <section className="py-0 relative min-h-[500px] lg:h-[80vh] lg:min-h-[600px] bg-[#0A1A14] overflow-hidden flex flex-col lg:flex-row items-center border-t border-brand-main/20">
                        <div className="absolute inset-0 z-0 opacity-[0.03]">
                            <div className="w-full h-full bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        </div>

                        {/* Company Logo watermark overlay on the right background (behind/near the doctor image) */}
                        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] z-0 opacity-[0.10] pointer-events-none flex items-center justify-center lg:justify-end lg:pr-12">
                            <img
                                src="/assets/img/overlay.png"
                                className="h-[95%] max-h-[580px] w-auto object-contain select-none"
                                alt="Logo watermark"
                            />
                        </div>

                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-main blur-[150px] opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        {/* Content - first on mobile for proper flow */}
                        <div className="relative z-10 py-10 max-w-[1400px] mx-auto px-4 md:px-12 w-full flex">
                            <ScrollReveal
                                direction="left"
                                staggerDelay={0.15}
                                className="max-w-xl"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-main/20 border border-brand-main/30 backdrop-blur-md mb-6">
                                    <HeartHandshake
                                        size={14}
                                        className="text-brand-light"
                                    />
                                    <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
                                        {staffParams.subtitle ||
                                            "Equipo Multidisciplinario"}
                                    </span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
                                    <FormattedText
                                        text={
                                            staffParams.title ||
                                            "Expertos en *Microtrasplante*"
                                        }
                                        boldClassName="font-bold text-white"
                                    />
                                </h2>
                                <p className="text-brand-gray text-lg md:text-xl font-light leading-relaxed mb-10 border-l-2 border-brand-main pl-6">
                                    {staffParams.description ||
                                        "Pioneros y referentes en el Perú en restauración capilar. Nos enfocamos en diagnósticos precisos mediante tecnología de nivel mundial."}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-8">
                                    <a
                                        href="#consulta"
                                        onClick={scrollToTop}
                                        className="bg-brand-main text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-brand-dark transition-all text-xs lg:text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(26,60,52,0.5)] flex items-center gap-2"
                                    >
                                        Agendar Evaluación Médica{" "}
                                        <ArrowRight size={18} />
                                    </a>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Doctor Image - flows below content on mobile, overlays on desktop */}
                        <div className="relative h-[450px] lg:h-auto lg:absolute lg:inset-0 w-full max-w-[1400px] mx-auto pointer-events-none z-0">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 80,
                                    filter: "blur(8px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    filter: "blur(0px)",
                                }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="absolute right-0 bottom-0 lg:h-[85%] w-full lg:w-[55%] z-0 flex justify-end opacity-20 lg:opacity-100 mix-blend-luminosity lg:mix-blend-normal pointer-events-none pr-4 md:pr-12"
                            >
                                <img
                                    src={`/api/landing_home/media/${staffParams.image}`}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                    className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                                    alt="Medical Team"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0A1A14] to-transparent"></div>
                                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0A1A14] to-transparent lg:hidden"></div>
                            </motion.div>
                        </div>
                    </section>
                )}

                <Footer
                    generals={generals}
                    services={services}
                    socials={socials}
                    scrollToSection={scrollToSection}
                />
            </div>
        </Base>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Home {...properties} />
        </CarritoProvider>,
    );
});
