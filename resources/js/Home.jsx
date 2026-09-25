import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import ClientsMarquee from "./components/Tailwind/ClientsMarquee";
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
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
    Menu, X, Droplets, CheckCircle2, ShieldCheck, Star, Check, ArrowRight, ArrowLeft,
    ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, Mail, Phone, Factory,
    HardHat, UtensilsCrossed, Building2, Snowflake, Flame, Wrench, Cog,
    TimerOff, RefreshCw, Award, Facebook, Instagram, Linkedin, Sparkles,
    Activity, Clock, Stethoscope, HeartHandshake
} from "lucide-react";

const messagesRest = new MessagesRest();
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
};
const getStoredUTMs = () => {
    const getCookie = (name) => {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return "";
    };

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

    return {
        ...utms,
        web_url: window.location.href,
        referrer: document.referrer || "",
        x_breakdown_id:
            getCookie("X-Breakdown-ID") ||
            localStorage.getItem("atalaya_breakdown_id") ||
            "",
    };
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
    core_values = [],
    items = []

}) => {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);
    const heroScale = useTransform(scrollY, [0, 800], [1, 1.1]);

    const { scrollYProgress } = useScroll();

    const watermarkX = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 0.88, 0.92],
        ["-35vw", "35vw", "-35vw", "30vw", "21vw", "21vw"]
    );
    const watermarkY = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 0.88, 0.92],
        ["-25vh", "10vh", "25vh", "-10vh", "0vh", "0vh"]
    );
    const watermarkScale = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 0.88, 0.92],
        [0.3, 0.35, 0.3, 0.4, 0.95, 1.0]
    );
    const watermarkRotate = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 0.88, 0.92],
        [-15, 12, -8, 15, 0, 0]
    );
    const watermarkOpacity = useTransform(
        scrollYProgress,
        [0, 0.05, 0.82, 0.88, 0.92, 0.93],
        [0, 0.08, 0.08, 0.95, 0.0, 0]
    );

    const localPlateOpacity = useTransform(
        scrollYProgress,
        [0.86, 0.92],
        [0, 1]
    );

    // Form Fields State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [flow, setFlow] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeServiceIdx, setActiveServiceIdx] = useState(0);
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(null);
    const [productSwiper, setProductSwiper] = useState(null);
    const isMobile = useIsMobile();
    const [loadVideo, setLoadVideo] = useState(true);
    const handleProductQuote = (productName) => {
        setDetails(`Hola, deseo cotizar el producto: ${productName}`);
        scrollToSection("consulta", 1500);
    };

    const isAutoScrolling = useRef(false);

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
                    "sectores",
                    "clientes",
                    "productos",
                    "testimonios",
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
                ?.description || "+51 923 274 820",
        support_email:
            generals.find((g) => g.correlative === "support_email")
                ?.description || "ventas@groupngssolutions.com",
        footer_description:
            generals.find((g) => g.correlative === "footer_description")
                ?.description ||
            "Somos tu mejor aliado en soluciones tecnológicas. Especialistas en sistemas antihurto EAS para retail, ofreciendo equipos de última generación, instalación profesional, capacitación y soporte técnico a nivel nacional.",
        address:
            generals.find((g) => g.correlative === "address")?.description ||
            generals.find((g) => g.correlative === "address_principal")
                ?.description ||
            "Calle Juanjui 686 - El Agustino - Lima",
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
    const aliados = getSection("page_home_aliados");
    const diferencia = getSection("page_home_enfoque");
    const staffParams = getSection("page_home_staff");
    const productos = getSection("page_home_productos");
    const trataments = getSection("page_home_services"); // title/subtitle for services
    const transformation = getSection("page_home_testimonies"); // title/subtitle for success cases
    const sello_originalidad = getSection("page_home_sello");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const subject = "Solicitud de Asesoría Comercial - NGS Solutions";
        const description = `Empresa: ${company || "No especificada"} | Mensaje: ${details || "Sin detalles adicionales"}`;
        try {
            const result = await messagesRest.save({ name, email, phone, company, subject, description, ...getStoredUTMs() }, null, false);
            if (!result) throw new Error();
            Swal.fire({ title: "¡Solicitud Recibida!", text: "Nos pondremos en contacto con usted en menos de 24 horas.", icon: "success", confirmButtonColor: "#d57748" });
            setName(""); setEmail(""); setCompany(""); setPhone(""); setFlow(""); setDetails("");
        } catch (error) {
            Swal.fire({ title: "Error", text: "Hubo un problema al enviar su solicitud. Por favor, intente nuevamente.", icon: "error", confirmButtonColor: "#60a9be" });
        } finally { setIsSubmitting(false); }
    };

    const testimonials = (testimonies && testimonies.length > 0
        ? testimonies
        : [
            {
                name: "Roberto Villanueva",
                correlative: "Jefe de Prevención de Pérdidas - Supermercados del Norte",
                description: "La implementación de las antenas AM Pegasus de NGS Solutions redujo nuestra merma desconocida en un 45% in los primeros tres meses. Su soporte en Chiclayo es excelente.",
            },
            {
                name: "Clara Inga",
                correlative: "Gerente de Operaciones - Retail Moda Perú",
                description: "Trabajar de forma directa con NGS nos ha ahorrado costos de intermediación y nos dio acceso a tags rígidos desarrollados a medida para nuestras prendas delicadas.",
            },
            {
                name: "Santiago Peralta",
                correlative: "Especificador de Proyectos - Estudio Peralta & Asoc.",
                description: "Como arquitectos de centros comerciales, confiamos la integración de arcos antihurto a NGS por su diseño minimalista que respeta la estética del ingreso comercial.",
            }
        ]
    ).map((t) => ({
        name: t.name,
        role: t.correlative || t.role || "",
        text: t.description,
        initials: (t.name || "").split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2),
        image: t.image,
    }));

    const servicesList = services && services.length > 0 ? services : [
        {
            title: "Provisión de Suministros EAS",
            description: "Etiquetas adhesivas, tags rígidos, pines, acopladores y desactivadores de alta calidad compatibles con sistemas AM y RF. Aseguramos stock permanente para tu operación sin intermediarios.",
            image: null,
            characteristics: ["Tags rígidos ultra resistentes", "Etiquetas AM y RF de máxima detección", "Desactivadores y desacopladores de alta velocidad"],
        },
        {
            title: "Implementación de Antenas y Arcos",
            description: "Instalación profesional de antenas antihurto AM y RF con diseños modernos y elegantes que se integran a la estética de tu tienda sin obstaculizar el flujo de clientes.",
            image: null,
            characteristics: ["Antenas acrílicas premium", "Calibración digital antinterferencia", "Diseño minimalista y moderno"],
        },
        {
            title: "Soporte Técnico Especializado",
            description: "Asistencia rápida con cobertura nacional. Realizamos mantenimiento preventivo y correctivo para asegurar la operatividad y calibración óptima de tus sistemas antihurto.",
            image: null,
            characteristics: ["Técnicos locales en cada departamento", "Mantenimiento preventivo programado", "Respuesta de soporte ágil"],
        },
        {
            title: "Capacitación al Personal",
            description: "Formación especializada para tus equipos de seguridad y prevención de pérdidas, asegurando el uso correcto de los sistemas y la reducción de robos internos y externos.",
            image: null,
            characteristics: ["Instrucción práctica in-situ", "Manuales y guías de mejores prácticas", "Optimización de protocolos de prevención"],
        },
        {
            title: "Consultoría EAS a Medida",
            description: "Analizamos la infraestructura de tu tienda y los puntos críticos de vulnerabilidad para diseñar un sistema óptimo y costo-eficiente que maximice tu retorno de inversión.",
            image: null,
            characteristics: ["Análisis de riesgos y vulnerabilidad", "Diseño de soluciones personalizadas", "Retorno de inversión garantizado"],
        }
    ];

    const strenghtsList = strenghts && strenghts.length > 0 ? strenghts : [
        { name: "Técnicos Descentralizados", description: "Contamos con personal técnico calificado en cada departamento del Perú para una respuesta inmediata y local." },
        { name: "Postventa Garantizada", description: "Acompañamos a tu negocio con soporte continuo, capacitaciones a tu personal y auditorías periódicas de tus sistemas." },
        { name: "Desarrollo a Medida", description: "Si no tenemos el equipamiento exacto que requiere tu proyecto, lo importamos o lo desarrollamos para ti." },
        { name: "Trabajo Directo y Honesto", description: "Vendemos lo que realmente necesitas. Sin intermediarios, sin revendedores y con total transparencia comercial." },
        { name: "Tecnología Anti-Interferencias", description: "Nuestras antenas usan tecnología de última generación AM y RF para evitar falsas alarmas y falsos negativos." }
    ];

    const specialitiesList = specialities && specialities.length > 0 ? specialities : [
        { name: "Sistemas AM (Acustomagnético)", description: "Tecnología de alta penetración y excelente detección ideal para tiendas de ropa, farmacias y ferreterías." },
        { name: "Sistemas RF (Radiofrecuencia)", description: "Solución económica y efectiva para supermercados, librerías y retail en general." },
        { name: "Protección de Exhibición", description: "Sistemas de seguridad y alarmas interactivas para smartphones, tablets y electrónica en exhibición." },
        { name: "Contadores de Personas", description: "Sensores inteligentes para medir el aforo en tiempo real y analizar la conversión de tu tienda." },
        { name: "Accesorios y Tags EAS", description: "Etiquetas adhesivas, tags rígidos, pines y desacopladores de máxima resistencia en stock permanente." }
    ];

    const indicatorsList = indicators && indicators.length > 0 ? indicators : [
        { name: "1,200+", description: "Tiendas Protegidas" },
        { name: "24", description: "Departamentos Cobertura" },
        { name: "8+", description: "Años de Operación" },
        { name: "100%", description: "Soporte Técnico" }
    ];

    const staffParamsObj = staffParams || {
        title: "Ingeniería y Soporte de **Nivel Nacional**",
        description: "Contamos con un equipo de ingenieros y técnicos especializados listos para atenderte en cualquier región del Perú. Ofrecemos instalación profesional, calibración fina y mantenimiento preventivo para garantizar que tu inversión funcione al 100% todos los días.",
        image: null
    };

    return (
        <Base>
            <div className="font-sans text-gray-900 bg-[#f8f9fa] min-h-screen w-full overflow-x-hidden selection:bg-brand-main selection:text-white">


                {/* Floating WhatsApp CTA */}
                <WhatsApp data={generals} />

                <Header
                    scrollToForm={scrollToTop}
                    scrollToSection={scrollToSection}
                />

                {/* Hero Section with recommended responsive height (does NOT take full viewport height) */}
                <section
                    id="consulta"
                    className="relative w-full md:min-h-[520px] lg:h-[680px] xl:h-[620px] 2xl:h-[660px] flex items-center md:flex-col md:justify-center bg-brand-dark overflow-hidden pt-20 sm:pt-24 md:pt-20 lg:pt-24 pb-8 sm:pb-10 md:pb-6"
                >
                    {/* Hero Background Video / Image - Seamless on both Mobile & Desktop */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                        {(() => {
                            const rawVideo = (isMobile && hero?.video_mobile) ? hero.video_mobile : (hero?.video || ((hero?.is_video === 1 || hero?.is_video === "1" || !hero?.image) ? "https://videos.pexels.com/video-files/6195526/6195526-hd_1920_1080_25fps.mp4" : null));
                            const isYouTube = rawVideo && (rawVideo.includes("youtube.com") || rawVideo.includes("youtu.be"));
                            const youtubeId = isYouTube ? (rawVideo.split("v=")[1]?.split("&")[0] || rawVideo.split("/").pop()) : null;

                            if (isYouTube && youtubeId) {
                                return (
                                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                        <iframe
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] max-w-none opacity-60"
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                                            frameBorder="0"
                                            allow="autoplay; fullscreen"
                                        ></iframe>
                                    </div>
                                );
                            }

                            if (rawVideo) {
                                return (
                                    <video
                                        key={rawVideo}
                                        src={rawVideo}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover opacity-60 pointer-events-none"
                                    />
                                );
                            }

                            const bgImage = (isMobile && hero?.image_mobile)
                                ? `/api/landing_home/media/${hero.image_mobile}`
                                : (hero?.image ? `/api/landing_home/media/${hero.image}` : null);

                            if (bgImage) {
                                return (
                                    <img
                                        src={bgImage}
                                        alt="Hero Background"
                                        className="w-full h-full object-cover opacity-60 pointer-events-none"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                );
                            }

                            return (
                                <video
                                    src="https://videos.pexels.com/video-files/6195526/6195526-hd_1920_1080_25fps.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-cover opacity-60 pointer-events-none"
                                />
                            );
                        })()}
                        {/* Overlay para legibilidad del contenido */}
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/20 to-brand-dark pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
                        <div
                            className="lg:col-span-7 max-w-xl text-left space-y-4 animate-fade-in-up"
                        >
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-2xl mb-1 sm:mb-2">
                                <span className="font-brinnan text-white text-xs lg:text-sm font-semibold tracking-widest">
                                    {hero?.subtitle ||
                                        "Sistemas Antihurto EAS"}
                                </span>
                            </div>

                            <h1 className="font-brinnan text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[3.1rem] leading-[1.3] sm:leading-[1.32] md:leading-[1.30]  font-bold tracking-wide text-white mb-3 sm:mb-4 [text-shadow:_0_1px_5px_rgb(0_0_0_/_0.8)]">
                                {hero?.title ? (
                                    <FormattedText
                                        text={hero.title}
                                        boldClassName="font-medium text-brand-light"
                                    />
                                ) : (
                                    <span>Protege tu negocio con tecnología <span className="font-medium text-brand-light italic">EAS de confianza</span></span>
                                )}
                            </h1>

                            <p className="text-white/90 text-base 2xl:text-lg font-light leading-relaxed max-w-lg mb-5 sm:mb-6 line-clamp-3 [text-shadow:_0_1px_5px_rgb(0_0_0_/_0.8)]">
                                {hero?.description ||
                                    "Soluciones de seguridad retail sin intermediarios. Provisión, instalación, soporte técnico y capacitación garantizada a nivel nacional."}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <a
                                    href="#sectores"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("sectores", 1500);
                                    }}
                                    className="bg-brand-light text-dark px-7 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase shadow-md hover:scale-[1.02]"
                                >
                                    Ver Soluciones <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Lead form card - espacioso y cómodo */}
                        <div
                            className="hidden lg:block lg:col-span-5 w-full relative max-w-[490px] xl:max-w-[520px] ml-auto animate-fade-in-up"
                        >
                            <div className="bg-white/25 backdrop-blur-3xl p-6 sm:p-7 xl:p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/30 relative z-10">
                                <h2 className="font-brinnan text-xl sm:text-2xl font-light text-white text-center mb-4 xl:mb-5 tracking-wide">
                                    Solicita una{" "}
                                    <span className="font-medium text-brand-light">
                                        asesoría gratuita
                                    </span>
                                </h2>

                                <form
                                    className="space-y-3.5"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full bg-white border border-white/90 px-5 py-3 sm:py-3.5 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/15 transition-all font-medium shadow-sm"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) =>
                                                setCompany(e.target.value)
                                            }
                                            placeholder="Empresa / Negocio"
                                            className="w-full bg-white border border-white/90 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/15 transition-all font-medium shadow-sm"
                                        />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Teléfono"
                                            required
                                            className="w-full bg-white border border-white/90 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/15 transition-all font-medium shadow-sm"
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Correo electrónico"
                                        required
                                        className="w-full bg-white border border-white/90 px-5 py-3 sm:py-3.5 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/15 transition-all font-medium shadow-sm"
                                    />

                                    <textarea
                                        value={details}
                                        onChange={(e) =>
                                            setDetails(e.target.value)
                                        }
                                        placeholder="Describe tu proyecto o equipos que necesitas..."
                                        rows="2"
                                        className="w-full bg-white border border-white/90 px-5 py-2.5 sm:py-3 rounded-2xl text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/15 transition-all font-medium resize-none shadow-sm"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#d57748] hover:bg-[#c4683b] hover:brightness-105 text-white py-3.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2 transition-all duration-300"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Recibir Asesoría Gratuita"
                                        )}
                                    </button>

                                    <p className="text-center text-[11px] sm:text-xs text-white/90 mt-2 font-medium tracking-wide">
                                        Tus datos están protegidos y son confidenciales
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile Form Section - displays form below hero on mobile screens */}
                <section className="lg:hidden bg-brand-dark pt-0 pb-8 sm:py-10 px-4 sm:px-6">
                    <div className="max-w-lg mx-auto">
                        <div
                            className="w-full relative shadow-[0_20px_50px_rgba(26,60,52,0.1)]"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-main/30 to-transparent rounded-[40px] blur-3xl transform -rotate-3 z-0"></div>

                            <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/80 relative z-10">
                                <div className="font-brinnan text-xl sm:text-2xl font-light text-brand-dark text-center mb-5 sm:mb-8 tracking-wide">
                                    Solicita una{" "}
                                    <span className="font-medium text-brand-main">
                                        asesoría gratuita
                                    </span>
                                </div>

                                <form
                                    className="space-y-3 sm:space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full bg-white border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) =>
                                                setCompany(e.target.value)
                                            }
                                            placeholder="Empresa / Negocio"
                                            className="w-full bg-white border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Teléfono"
                                            required
                                            className="w-full bg-white border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Correo electrónico corporativo"
                                        required
                                        className="w-full bg-white border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium"
                                    />

                                    <textarea
                                        value={details}
                                        onChange={(e) =>
                                            setDetails(e.target.value)
                                        }
                                        placeholder="Describe tu proyecto o equipos que necesitas..."
                                        rows="2"
                                        className="w-full bg-white border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm text-brand-dark placeholder-gray-500 outline-none focus:border-brand-main focus:bg-white focus:ring-4 focus:ring-brand-main/10 transition-all font-medium resize-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#d57748] hover:bg-[#c4683b] text-white py-3.5 sm:py-4 rounded-full font-bold transition-all mt-4 sm:mt-6 text-[12px] sm:text-xs tracking-widest uppercase shadow-[0_10px_20px_rgba(213,119,72,0.25)] hover:shadow-[0_15px_30px_rgba(213,119,72,0.35)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Recibir Asesoría Gratuita"
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-dark mt-4 uppercase tracking-wider font-medium">
                                        Tus datos están protegidos y son
                                        confidenciales
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Dynamic Indicators bottom band - Modern High-Fidelity Cards (Design Proposal) */}
                <section className="bg-white py-12 sm:py-14 lg:py-16 px-4 sm:px-6 md:px-12 w-full relative">
                    <div className="max-w-[1400px] mx-auto relative z-10">
                        {/* Indicators Container */}
                        {indicatorsList && indicatorsList.length <= 4 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 xl:gap-12">
                                {indicatorsList.map((ind, idx) => {
                                    const proposalSvgIcons = [
                                        { src: "/assets/img/escudo.svg", alt: "Escudo y Protección" },
                                        { src: "/assets/img/ubicacion.svg", alt: "Ubicación y Cobertura" },
                                        { src: "/assets/img/precision.svg", alt: "Precisión y Detección" },
                                        { src: "/assets/img/soporte.svg", alt: "Soporte Especializado" },
                                    ];

                                    const renderProposalIcon = (index) => {
                                        const icon = proposalSvgIcons[index % proposalSvgIcons.length];
                                        return (
                                            <img
                                                src={icon.src}
                                                alt={ind.name || icon.alt}
                                                className="w-8 h-8 sm:w-9 sm:h-9 object-contain select-none pointer-events-none"
                                            />
                                        );
                                    };

                                    return (
                                        <div
                                            key={idx}
                                            className="w-full max-w-[320px] lg:max-w-none mx-auto bg-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 xl:p-9 border border-[#e8f1f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] shadow-[0_8px_25px_rgba(12,35,49,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center justify-between group min-h-[250px]"
                                        >
                                            {/* Circular Icon Badge */}
                                            <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-[#eaf4fb] border border-[#d6ecf7] flex items-center justify-center mb-6 sm:mb-7 transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-none">
                                                {renderProposalIcon(idx)}
                                            </div>

                                            {/* Metrics Number & Description */}
                                            <div className="flex flex-col items-center flex-1 justify-center w-full">
                                                <h3 className="font-brinnan text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-[2.5rem] font-bold text-[#0c2331] tracking-tight mb-2 sm:mb-2.5 leading-tight">
                                                    {ind.name}
                                                </h3>

                                                <p className="text-[15px] sm:text-[16px] font-normal text-[#486581] leading-relaxed max-w-[240px] mx-auto">
                                                    {ind.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Swiper
                                modules={[Autoplay]}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 4500,
                                    disableOnInteraction: false,
                                }}
                                className="w-full pb-4"
                            >
                                {Array.from({ length: Math.ceil((indicatorsList?.length || 0) / 4) }, (_, i) => indicatorsList.slice(i * 4, i * 4 + 4)).map((chunk, slideIdx) => (
                                    <SwiperSlide key={slideIdx} className="h-auto">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 xl:gap-8 w-full">
                                            {chunk.map((ind, idx) => {
                                                const globalIdx = slideIdx * 4 + idx;
                                                const proposalSvgIcons = [
                                                    { src: "/assets/img/escudo.svg", alt: "Escudo y Protección" },
                                                    { src: "/assets/img/ubicacion.svg", alt: "Ubicación y Cobertura" },
                                                    { src: "/assets/img/precision.svg", alt: "Precisión y Detección" },
                                                    { src: "/assets/img/soporte.svg", alt: "Soporte Especializado" },
                                                ];

                                                const renderProposalIcon = (index) => {
                                                    const icon = proposalSvgIcons[index % proposalSvgIcons.length];
                                                    return (
                                                        <img
                                                            src={icon.src}
                                                            alt={ind.name || icon.alt}
                                                            className="w-8 h-8 sm:w-9 sm:h-9 object-contain select-none pointer-events-none"
                                                        />
                                                    );
                                                };

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="w-full max-w-[320px] lg:max-w-none mx-auto bg-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 xl:p-9 border border-[#e8f1f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] shadow-[0_8px_25px_rgba(12,35,49,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center justify-between group min-h-[250px]"
                                                    >
                                                        <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-[#eaf4fb] border border-[#d6ecf7] flex items-center justify-center mb-6 sm:mb-7 transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-none">
                                                            {renderProposalIcon(globalIdx)}
                                                        </div>

                                                        <div className="flex flex-col items-center flex-1 justify-center w-full">
                                                            <h3 className="font-brinnan text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-[2.5rem] font-bold text-[#0c2331] tracking-tight mb-2 sm:mb-2.5 leading-tight">
                                                                {ind.name}
                                                            </h3>

                                                            <p className="text-[15px] sm:text-[16px] font-normal text-[#486581] leading-relaxed max-w-[240px] mx-auto">
                                                                {ind.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </section>




                {/* Interactive Services Carousel */}
                {servicesList && servicesList.length > 0 && (
                    <section
                        id="sectores"
                        className="pb-12 pt-8 px-4 sm:px-6 md:px-12 bg-white relative w-full"
                    >
                        <div className="max-w-[1400px] mx-auto px-4 md:px-12 outline-none focus:outline-none">
                            {/* Section Header */}
                            <ScrollReveal
                                direction="up"
                                staggerDelay={0.15}
                                className="flex flex-col mb-10 md:mb-14 gap-4"
                            >
                                <div className="max-w-4xl">
                                    <h2 className="font-brinnan text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                                        <FormattedText
                                            text={
                                                trataments?.title ||
                                                "Soluciones y servicios *EAS*"
                                            }
                                            boldClassName="font-bold text-brand-main"
                                        />
                                    </h2>
                                </div>
                            </ScrollReveal>

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
                                        <ScrollReveal direction="up" staggerDelay={0.15}>
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
                                                                    src={service.image ? `/api/service/media/${service.image}` : '/api/cover/thumbnail/null'}
                                                                    alt={service.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    onError={(e) => (e.target.src = '/api/cover/thumbnail/null')}
                                                                />
                                                                {/* Deep Oceanic Slate Gradient Overlay from Reference Design */}
                                                                <div
                                                                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                                                                    style={{
                                                                        background:
                                                                            'linear-gradient(180deg, rgba(25, 53, 77, 0) 32%, rgba(25, 53, 77, 0.42) 52%, rgba(25, 53, 77, 0.88) 72%, #19354d 95%)',
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
                                        </ScrollReveal>
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
                                            <ArrowLeft size={20} strokeWidth={2.2} className="group-hover:-translate-x-1.5 transition-transform duration-200" />
                                            <span>Volver a soluciones</span>
                                        </button>

                                        <div className="relative w-full">
                                            {/* Left Navigation Button */}
                                            <button
                                                onClick={() => setActiveServiceIdx((p) => (p - 1 + servicesList.length) % servicesList.length)}
                                                className="flex absolute left-2 md:-left-8 lg:-left-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#19354d] text-white items-center justify-center shadow-[0_4px_18px_rgba(25,53,77,0.35)] hover:bg-[#12283a] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
                                                aria-label="Anterior solución"
                                            >
                                                <ArrowLeft size={22} strokeWidth={2.2} className="text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
                                            </button>

                                            {/* Right Navigation Button */}
                                            <button
                                                onClick={() => setActiveServiceIdx((p) => (p + 1) % servicesList.length)}
                                                className="flex absolute right-2 md:-right-8 lg:-right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#19354d] text-white items-center justify-center shadow-[0_4px_18px_rgba(25,53,77,0.35)] hover:bg-[#12283a] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
                                                aria-label="Siguiente solución"
                                            >
                                                <ArrowRight size={22} strokeWidth={2.2} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                                            </button>

                                            <div
                                                className="relative h-[520px] sm:h-[600px] lg:h-[620px] w-full flex items-center justify-center perspective-1000 px-2 sm:px-4 md:px-8"
                                            >
                                                <AnimatePresence mode="popLayout">
                                                    {servicesList.map((service, idx) => {
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
                                                                            src={`/api/service/media/${service.image}`}
                                                                            alt={service.title}
                                                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                                            onError={(e) =>
                                                                            (e.target.src =
                                                                                "/api/cover/thumbnail/null")
                                                                            }
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden"></div>
                                                                    </div>

                                                                    {/* Content half */}
                                                                    <div className="w-full lg:w-1/2 p-5 sm:p-6 md:p-10 lg:p-16 flex flex-col justify-center overflow-y-auto">
                                                                        <h3 className="font-brinnan text-xl sm:text-2xl md:text-3xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
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
                                                                                <div className="space-y-4 mb-10 ">
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

                                                                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                                                            <a
                                                                                href="#contacto"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    scrollToTop();
                                                                                }}
                                                                                className="bg-brand-accent uppercase text-white px-8 py-4 rounded-full font-semibold hover:scale-105 duration-300 transition-all w-max text-xs  sm:text-sm tracking-wide shadow-md flex items-center gap-2"
                                                                            >
                                                                                Solicitar Cotización{" "}
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
                                        </div>


                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Continuous Content Area with Left Texture Overlay */}
                <div className="relative w-full bg-white overflow-hidden">
                    {/* Subtle Overlay Texture attached to the left */}
                    <div className="absolute left-0 top-0 bottom-0 w-[300px] sm:w-[480px] md:w-[330px] lg:w-[420px] pointer-events-none z-0 select-none overflow-hidden">
                        <img
                            src="/assets/img/overlay-1.png"
                            alt=""
                            className="w-full h-full object-cover object-left-top opacity-[0.06] pointer-events-none select-none"
                        />
                    </div>

                    {/* Clientes que confiaron - Marquesina doble */}
                    <ClientsMarquee
                        title={
                            <FormattedText
                                text={aliados?.title || "Empresas que *confían en nosotros*"}
                                boldClassName="font-bold text-brand-main"
                            />
                        }
                        core_values={core_values}
                        certifications={certifications}
                    />

                    {/* Products Section - Equipos más solicitados */}
                    <section
                        id="productos"
                        className="pb-16 pt-10 px-4 sm:px-6 md:px-12 relative w-full overflow-hidden bg-transparent"
                    >
                        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
                            {/* Section Header */}
                            <ScrollReveal direction="up" staggerDelay={0.15}>
                                <div className="mb-10 sm:mb-12 max-w-3xl">
                                    <h2 className="font-brinnan text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                                        {productos?.title ? (
                                            <FormattedText
                                                text={productos.title}
                                                boldClassName="font-bold text-brand-main"
                                            />
                                        ) : (
                                            <>
                                                Equipos{" "}
                                                <span className="font-bold text-brand-main">
                                                    más solicitados
                                                </span>
                                            </>
                                        )}
                                    </h2>
                                    {productos?.description && (
                                        <p className="text-gray-500 text-base sm:text-lg font-light leading-relaxed mt-2">
                                            {productos.description}
                                        </p>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Carousel Wrapper */}
                            <div className="relative w-full">
                                {/* Previous Button */}
                                <button
                                    onClick={() => productSwiper?.slidePrev()}
                                    className="hidden sm:flex absolute -left-3 md:-left-6 lg:-left-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 items-center justify-center text-[#19354d] hover:text-[#38a3c8] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                                    aria-label="Anterior equipo"
                                >
                                    <ChevronLeft size={22} strokeWidth={2.5} />
                                </button>

                                {/* Next Button */}
                                <button
                                    onClick={() => productSwiper?.slideNext()}
                                    className="hidden sm:flex absolute -right-3 md:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 items-center justify-center text-[#19354d] hover:text-[#38a3c8] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                                    aria-label="Siguiente equipo"
                                >
                                    <ChevronRight size={22} strokeWidth={2.5} />
                                </button>

                                {/* Swiper Carousel */}
                                <Swiper
                                    modules={[Autoplay]}
                                    onSwiper={setProductSwiper}
                                    spaceBetween={20}
                                    slidesPerView={1.15}
                                    centeredSlides={isMobile}
                                    autoplay={{ delay: 6000, disableOnInteraction: true }}
                                    breakpoints={{
                                        640: { slidesPerView: 2, spaceBetween: 24, centeredSlides: false },
                                        1024: { slidesPerView: 3, spaceBetween: 28, centeredSlides: false },
                                        1280: { slidesPerView: 3, spaceBetween: 32, centeredSlides: false },
                                    }}
                                    className="overflow-hidden py-4"
                                >
                                    {(() => {
                                        const isLegacyOrEmpty =
                                            !items ||
                                            items.length === 0 ||
                                            items.some(
                                                (item) =>
                                                    item.name === "Shampoo" ||
                                                    item.name === "Acondicionador"
                                            );
                                        const displayItems = !isLegacyOrEmpty
                                            ? items
                                            : [
                                                {
                                                    name: "Loop desactivador (RF)",
                                                    slug: "loop-desactivador-rf",
                                                    category: { name: "Accesorios y complementos" },
                                                    summary:
                                                        "El loop desactivador (RF) se integra de manera discreta en mostradores y puntos de cobro...",
                                                    image: "loop-desactivador.png",
                                                },
                                                {
                                                    name: "Bocina",
                                                    slug: "bocina-alarma-eas",
                                                    category: { name: "Accesorios y complementos" },
                                                    summary:
                                                        "La bocina es un componente esencial para asegurar la señalización acústica de alerta...",
                                                    image: "bocina.png",
                                                },
                                                {
                                                    name: "Mono transreceptor – ...",
                                                    slug: "mono-transreceptor-plexiglass",
                                                    category: { name: "Antenas" },
                                                    summary:
                                                        "El pedestal NGS mono plexiglass black está diseñado para máxima detección...",
                                                    image: "mono-transreceptor.png",
                                                },
                                                {
                                                    name: "Antena Pegasus AM",
                                                    slug: "antena-pegasus-am-premium",
                                                    category: { name: "Antenas AM" },
                                                    summary:
                                                        "Arco antihurto acrílico premium con tecnología acustomagnética y alertas visuales.",
                                                    image: "antena-pegasus-transparent.png",
                                                },
                                                {
                                                    name: "Sensor Ovni Strong RF",
                                                    slug: "sensor-ovni-strong-rf",
                                                    category: { name: "Tags Rígidos" },
                                                    summary:
                                                        "Tag de radiofrecuencia ultra-resistente con diseño circular plano que impide forzado.",
                                                    image: "sensor-ovni-transparent.png",
                                                },
                                                {
                                                    name: "Imán Desacoplador 12000GS",
                                                    slug: "desacoplador-magnetico-12000gs",
                                                    category: { name: "Desacopladores" },
                                                    summary:
                                                        "Desacoplador magnético de gran potencia compatible con todos los tags estándar.",
                                                    image: "desacoplador-iman-transparent.png",
                                                },
                                            ];

                                        return displayItems.map((item, idx) => {
                                            const imageSrc =
                                                item.image &&
                                                    (item.image.startsWith("http") ||
                                                        item.image.startsWith("/"))
                                                    ? item.image
                                                    : `/api/items/media/${item.image}`;

                                            return (
                                                <SwiperSlide key={idx} className="h-auto pb-4 pr-2 pt-1 pl-1">
                                                    <div
                                                        className="relative group h-full cursor-pointer select-none"
                                                        onClick={() => handleProductQuote(item.name)}
                                                    >
                                                        {/* Offset backing layer (high-tech EAS hardware cut) - static without shadow expansion */}
                                                        <div
                                                            className="absolute inset-0 translate-x-1.5 translate-y-2 bg-[#e8f1f7] rounded-tr-[26px] rounded-bl-[26px] -z-0"
                                                            style={{
                                                                clipPath:
                                                                    "polygon(26px 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%, 0% 26px)",
                                                            }}
                                                        />

                                                        {/* Border container: ensures border on all sides including top-left and bottom-right diagonal chamfers */}
                                                        <div
                                                            className="relative p-[1.5px] bg-[#dce8f0] group-hover:bg-[#b8d4e6] rounded-tr-[24px] rounded-bl-[24px] z-10 shadow-[0_4px_20px_rgba(25,53,77,0.04)] transition-colors duration-300"
                                                            style={{
                                                                clipPath:
                                                                    "polygon(22px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 22px)",
                                                            }}
                                                        >
                                                            {/* Main White Card Inner */}
                                                            <div
                                                                className="bg-white rounded-tr-[23px] rounded-bl-[23px] p-6 sm:p-7 flex flex-col justify-between h-[410px] sm:h-[430px]"
                                                                style={{
                                                                    clipPath:
                                                                        "polygon(21px 0%, 100% 0%, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0% 100%, 0% 21px)",
                                                                }}
                                                            >
                                                                {/* Top Category Badge */}
                                                                <div className="self-start">
                                                                    <span className="inline-block px-4 py-1.5 rounded-full border border-[#cde0ea] bg-white text-brand-dark text-xs font-medium tracking-wide">
                                                                        {item.category?.name ||
                                                                            item.category ||
                                                                            "Accesorios y complementos"}
                                                                    </span>
                                                                </div>

                                                                {/* Product Image Area */}
                                                                <div className="flex-1 flex items-center justify-center p-3 my-2 min-h-[190px]">
                                                                    <img
                                                                        src={imageSrc}
                                                                        alt={item.name}
                                                                        className="max-h-[180px] sm:max-h-[195px] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                                        onError={(e) => {
                                                                            e.target.src =
                                                                                "/assets/img/seguridad.webp";
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* Content */}
                                                                <div className="mt-auto pt-2">
                                                                    <h3
                                                                        className="font-brinnan text-brand-dark text-xl sm:text-[22px] font-bold leading-tight mb-2 tracking-tight line-clamp-1"
                                                                        title={item.name}
                                                                    >
                                                                        {item.name}
                                                                    </h3>
                                                                    <p className="text-[#5e7182] text-sm leading-relaxed line-clamp-2 h-[40px] font-normal">
                                                                        {item.summary ||
                                                                            item.description ||
                                                                            "Equipo especializado de alta seguridad y protección contra pérdidas para retail."}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            );
                                        });
                                    })()}
                                </Swiper>
                            </div>
                        </div>
                    </section>
                    {/* Nosotros (About Us) Section - Ocultado por solicitud */}
                    {false && nosotros && (
                        <section
                            id="impacto"
                            className=" py-12 md:py-20 bg-white relative overflow-hidden w-full"
                        >

                            <div className="absolute w-max left-0 top-0 z-0 opacity-[0.15] pointer-events-none">
                                <img src="/assets/img/overlay-2.png" alt="" srcset="" className="rotate-180" />
                            </div>

                            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
                                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                                    {/* Left Side: Images composition */}
                                    <div className="lg:col-span-6 relative w-full">
                                        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-gray-100 z-10">
                                            <img
                                                src={

                                                    `/api/landing_home/media/${nosotros.image}`

                                                }

                                                alt={
                                                    nosotros.subtitle || "Nosotros"
                                                }
                                                className="w-full h-[450px] md:h-[550px] object-cover object-center"
                                                onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </div>

                                    </div>

                                    {/* Right Side: Text info */}
                                    <div className="lg:col-span-6 space-y-8">
                                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-main/10 text-brand-main font-bold text-xs uppercase tracking-[0.2em]">

                                            {nosotros.subtitle || "Quiénes Somos"}
                                        </div>

                                        <h2 className="font-brinnan text-4xl md:text-5xl lg:text-6xl uppercase font-light text-brand-dark tracking-tight leading-tight">
                                            <FormattedText
                                                text={
                                                    nosotros.title ||
                                                    "Protegemos lo que con esfuerzo *has construido*"
                                                }
                                                boldClassName="font-medium text-brand-main block mt-2"
                                            />
                                        </h2>

                                        <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed  py-2">

                                            {nosotros.description ||
                                                "En NGS Solutions, combinamos innovación tecnológica y un equipo de ingeniería calificado para resguardar tus activos. Ofrecemos una presencia sólida y honesta, trabajando de forma directa para retail, almacenes y comercios en todo el país."}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <a
                                                href="#consulta"
                                                onClick={scrollToTop}
                                                className="bg-brand-accent hover:scale-105 duration-300  text-white px-8 py-4 rounded-full font-semibold  transition-all text-sm tracking-widest uppercase shadow-md"
                                            >
                                                Solicitar Asesoría
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {specialitiesList && (
                                    <ScrollReveal direction="up">
                                        <div className="relative max-w-7xl mt-20 mx-auto px-4">
                                            {/* Gradient Overlays for smooth side fade-out */}
                                            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none"></div>

                                            <style>{`
                                            .specialities-swiper {
                                                padding-top: 1.5rem !important;
                                                padding-bottom: 4rem !important; /* Space for pagination dots */
                                                padding-left: 1rem !important;
                                                padding-right: 1rem !important;
                                            }
                                            .specialities-swiper .swiper-pagination {
                                                bottom: 12px !important;
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                gap: 8px;
                                            }
                                            .specialities-swiper .swiper-pagination-bullet {
                                                width: 8px;
                                                height: 8px;
                                                background: #cbd5e1; /* gray-300 */
                                                opacity: 0.6;
                                                border-radius: 9999px;
                                                transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                                                margin: 0 !important;
                                            }
                                            .specialities-swiper .swiper-pagination-bullet-active {
                                                width: 24px; /* Elongated active dot pill */
                                                background: #60a9be; /* brand-main color */
                                                opacity: 1;
                                            }
                                        `}</style>

                                            <Swiper
                                                modules={[Autoplay, Pagination]}
                                                pagination={{
                                                    clickable: true,
                                                }}
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
                                                className="specialities-swiper w-full cursor-grab active:cursor-grabbing"
                                            >
                                                {specialitiesList.map((st, i) => {
                                                    const desc = [
                                                        "Tecnología de alta penetración y excelente detección ideal para tiendas de ropa, farmacias y ferreterías.",
                                                        "Solución económica y efectiva para supermercados, librerías y retail en general.",
                                                        "Sistemas de seguridad y alarmas interactivas para smartphones, tablets y electrónica en exhibición.",
                                                        "Sensores inteligentes para medir el aforo en tiempo real y analizar la conversión de tu tienda.",
                                                        "Etiquetas adhesivas, tags rígidos, pines y desacopladores de máxima resistencia en stock.",
                                                    ];

                                                    const icons = [
                                                        ShieldCheck,
                                                        Activity,
                                                        Sparkles,
                                                        Clock,
                                                        Building2,
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
                                                                className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col items-start w-full shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(26,60,52,0.08)] transition-all overflow-hidden h-full group relative"
                                                            >
                                                                {st.image ? (
                                                                    <div className="w-16 h-16 l   mb-6 transition-all duration-300 group-hover:scale-105 shrink-0">
                                                                        <img
                                                                            src={`/api/speciality/media/${st.image}`}
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

                                                                <h3 className="font-brinnan font-medium text-brand-dark text-xl leading-tight mb-4">
                                                                    {st.name}
                                                                </h3>

                                                                <p className="text-gray-600 text-md leading-relaxed font-light ">
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
                                )}
                            </div>
                        </section>
                    )}


                    {/* Trusted Allies / Partners Section - Infinite Carousel (Ocultado por solicitud) */}
                    {false && (
                        <section className="py-10 md:py-20 bg-white  relative overflow-hidden w-full">
                            {/* Animated background elements */}
                            <div className="absolute inset-0 opacity-40">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="dotGridAlly" width="32" height="32" patternUnits="userSpaceOnUse">
                                            <circle cx="2" cy="2" r="1" fill="#2e515b" opacity="0.1" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dotGridAlly)" />
                                </svg>
                            </div>

                            <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
                                {/* Header */}
                                <ScrollReveal direction="up" staggerDelay={0.1} className="text-center mb-0 ">
                                    <h4 className="font-brinnan  text-brand-main font-semibold tracking-widest uppercase text-xs mb-3">

                                        {aliados.subtitle ||
                                            "Nuestros Aliados"}
                                    </h4>
                                    <h2 className="!font-brinnan uppercase text-4xl md:text-5xl lg:text-6xl font-semibold text-brand-dark tracking-tight leading-tight max-w-5xl mx-auto">
                                        <FormattedText
                                            text={aliados.title ||
                                                "Empresas que *confían en nosotros*"}
                                            boldClassName="font-medium text-brand-main !font-brinnan"
                                        />
                                    </h2>

                                </ScrollReveal>

                                {/* Infinite Carousel */}
                                <div className="relative overflow-hidden py-10">
                                    {/* Gradient Overlays for fade effect */}
                                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#ffffff] to-transparent z-20 pointer-events-none"></div>
                                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#ffffff] to-transparent z-20 pointer-events-none"></div>

                                    <style>{`
                                .allies-swiper .swiper-wrapper {
                                    transition-timing-function: linear !important;
                                }
                            `}</style>

                                    <Swiper
                                        modules={[Autoplay]}
                                        spaceBetween={20}
                                        slidesPerView={2}
                                        breakpoints={{
                                            640: { slidesPerView: 3, spaceBetween: 30 },
                                            1024: { slidesPerView: 5, spaceBetween: 40 },
                                        }}
                                        loop={true}
                                        autoplay={{
                                            delay: 0,
                                            disableOnInteraction: false,
                                        }}
                                        speed={4000}
                                        allowTouchMove={true}
                                        className="allies-swiper w-full flex items-center"
                                    >
                                        {((core_values && core_values.length > 0) ? [...core_values, ...core_values] : []).map((ally, idx) => (
                                            <SwiperSlide key={`${ally.id || 'ally'}-${idx}`} className="flex justify-center items-center">
                                                <div
                                                    className="w-full h-24 md:h-32 px-4 flex flex-col items-center justify-center cursor-pointer group overflow-hidden relative hover:scale-[1.08] hover:-translate-y-1 transition-transform duration-300 ease-out"
                                                >
                                                    <div className="relative z-10 flex items-center justify-center h-full w-full">
                                                        <img
                                                            src={`/api/core_value/media/${ally.image}`}
                                                            alt={ally.name}
                                                            className="max-w-full max-h-full object-contain opacity-100 transition-all duration-300"
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* Call to Action */}
                                <div className="text-center mt-0 hidden">
                                    <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed  mb-12 whitespace-pre-line">
                                        {aliados.description ||
                                            "¿Quieres optimizar la prevención de pérdidas en tu negocio?"}

                                    </p>
                                    <a
                                        href="#consulta"
                                        onClick={scrollToTop}
                                        className="bg-brand-accent hover:scale-105 duration-300   text-white px-8 py-4 rounded-full font-semibold  transition-all text-sm tracking-widest uppercase shadow-md"
                                    >
                                        Solicitar Asesoría
                                    </a>
                                </div>

                            </div>

                        </section>
                    )}
                    {/* Bento Grid Features / Trust Swiper - Ocultado por solicitud */}
                    {false && strenghts && strenghts.length > 0 && (
                        <section
                            id="diferenciadores"
                            className="py-12 md:py-16 px-4 sm:px-6 bg-white relative overflow-hidden w-full"
                        >


                            <div className="absolute w-max right-0 bottom-0 z-0 opacity-[0.15] pointer-events-none">
                                <img src="/assets/img/overlay-2.png" alt="" srcset="" className="rotate-0 scale-x-[-1]" />
                            </div>



                            <div className="max-w-[1400px] mx-auto relative z-10">
                                <ScrollReveal
                                    direction="up"
                                    staggerDelay={0.15}
                                    className="text-center mb-16"
                                >
                                    <h3 className="font-brinnan text-brand-main font-semibold tracking-widest uppercase text-xs mb-3">
                                        {diferencia?.subtitle ||
                                            "Diferenciación NGS"}
                                    </h3>
                                    <h2 className="font-brinnan text-4xl md:text-5xl lg:text-6xl font-light uppercase text-brand-dark tracking-tight leading-tight">

                                        {diferencia?.title ? (
                                            <FormattedText
                                                text={diferencia.title}
                                                boldClassName="font-medium text-brand-main"
                                            />
                                        ) : (
                                            <span>Por qué elegir a <span className="font-medium text-brand-main">NGS Solutions</span></span>
                                        )}
                                    </h2>
                                    <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                                        {diferencia?.description ||
                                            "Ofrecemos soluciones directas, honestas y de alta tecnología para la protección de tu retail en todo el Perú."}
                                    </p>
                                </ScrollReveal>

                                <ScrollReveal direction="up">
                                    <div className="relative max-w-7xl mx-auto px-4">
                                        {/* Gradient Overlays for smooth side fade-out */}
                                        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none"></div>

                                        <style>{`
                                        .diferenciadores-swiper {
                                            padding-top: 1.5rem !important;
                                            padding-bottom: 4rem !important; /* Space for pagination dots */
                                            padding-left: 1rem !important;
                                            padding-right: 1rem !important;
                                        }
                                        .diferenciadores-swiper .swiper-pagination {
                                            bottom: 12px !important;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            gap: 8px;
                                        }
                                        .diferenciadores-swiper .swiper-pagination-bullet {
                                            width: 8px;
                                            height: 8px;
                                            background: #cbd5e1; /* gray-300 */
                                            opacity: 0.6;
                                            border-radius: 9999px;
                                            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                                            margin: 0 !important;
                                        }
                                        .diferenciadores-swiper .swiper-pagination-bullet-active {
                                            width: 24px; /* Elongated active dot pill */
                                            background: #60a9be; /* brand-main color */
                                            opacity: 1;
                                        }
                                    `}</style>

                                        <Swiper
                                            modules={[Autoplay, Pagination]}
                                            pagination={{
                                                clickable: true,
                                            }}
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
                                            className="diferenciadores-swiper w-full cursor-grab active:cursor-grabbing"
                                        >
                                            {strenghtsList.map((st, i) => {
                                                const desc = [
                                                    "Contamos con personal técnico calificado en cada departamento del Perú para una respuesta inmediata y local.",
                                                    "Acompañamos a tu negocio con soporte continuo, capacitaciones a tu personal y auditorías periódicas de tus sistemas.",
                                                    "Si no tenemos el equipamiento exacto que requiere tu proyecto, lo importamos o lo desarrollamos para ti.",
                                                    "Vendemos lo que realmente necesitas. Sin intermediarios, sin revendedores y con total transparencia comercial.",
                                                    "Nuestras antenas usan tecnología de última generación AM y RF para evitar falsas alarmas y falsos negativos."
                                                ];

                                                const icons = [
                                                    ShieldCheck,
                                                    MapPin,
                                                    Clock,
                                                    Wrench,
                                                    Building2,
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
                                                            className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col items-start w-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(26,60,52,0.08)] transition-all overflow-hidden h-full group relative"
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

                                                            <h3 className="font-brinnan font-medium text-brand-dark text-xl leading-tight mb-4">
                                                                {st.name}
                                                            </h3>

                                                            <p className="text-gray-600 text-md leading-relaxed font-light ">
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
                                <div className="flex items-center justify-center w-full flex-wrap gap-4">
                                    <a
                                        href="#contacto"
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        className="bg-brand-accent uppercase text-white px-8 py-4 rounded-full font-semibold hover:scale-105 duration-300 transition-all w-max text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-2"
                                    >
                                        Solicita Tu
                                        Evaluación Técnica{" "}
                                        <ArrowRight
                                            size={
                                                16
                                            }
                                        />
                                    </a>
                                </div>

                            </div>
                        </section>
                    )}
                    {/* Testimonials Section */}
                    {transformation && testimonials.length > 0 && (
                        <section id="testimonios" className="pb-10 pt-8 relative overflow-hidden w-full bg-transparent">

                            <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
                                <ScrollReveal direction="up" staggerDelay={0.1} className="max-w-3xl mb-10 sm:mb-12">
                                    <h2 className="font-brinnan text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                                        <FormattedText
                                            text={transformation.title || "Lo que dicen *nuestros clientes*"}
                                            boldClassName="font-bold text-brand-main"
                                        />
                                    </h2>
                                </ScrollReveal>

                                <div className="relative w-full">
                                    {/* Gradient Overlays for smooth side fade-out */}
                                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none"></div>

                                    <style>{`
                                    .testimonios-swiper {
                                        padding-top: 1.5rem !important;
                                        padding-bottom: 4rem !important; /* Space for pagination dots */
                                        padding-left: 1rem !important;
                                        padding-right: 1rem !important;
                                    }
                                    .testimonios-swiper .swiper-pagination {
                                        bottom: 12px !important;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        gap: 8px;
                                    }
                                    .testimonios-swiper .swiper-pagination-bullet {
                                        width: 8px;
                                        height: 8px;
                                        background: #cbd5e1; /* gray-300 */
                                        opacity: 0.6;
                                        border-radius: 9999px;
                                        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                                        margin: 0 !important;
                                    }
                                    .testimonios-swiper .swiper-pagination-bullet-active {
                                        width: 24px; /* Elongated active dot pill */
                                        background: #60a9be; /* brand-main color */
                                        opacity: 1;
                                    }
                                `}</style>

                                    <Swiper
                                        modules={[Autoplay, Pagination]}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        spaceBetween={24}
                                        slidesPerView={1}
                                        breakpoints={{
                                            768: { slidesPerView: 2 },
                                            1280: { slidesPerView: 3 }
                                        }}
                                        autoplay={{
                                            delay: 5000,
                                            disableOnInteraction: false
                                        }}
                                        className="testimonios-swiper w-full cursor-grab active:cursor-grabbing"
                                    >
                                        {console.log(testimonials)}
                                        {testimonials.map((t, i) => (
                                            <SwiperSlide key={i} className="h-auto">
                                                <div className="bg-white backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-[2rem] border border-brand-gray/10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full flex flex-col min-h-[280px] md:min-h-[360px]">
                                                    <div className="text-brand-main/30 mb-6">
                                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                                    </div>
                                                    <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed mb-8  flex-1">"{t.text}"</p>
                                                    <div className="border-t border-brand-gray/30 pt-6 flex items-center gap-4 mt-auto">
                                                        {t.image ? (
                                                            <img
                                                                className="w-12 h-12 rounded-full"
                                                                src={`/api/testimony/media/${t.image}`}
                                                                alt={t.name}
                                                                onError={(e) => {
                                                                    e.target.src =
                                                                        "/api/cover/thumbnail/null";
                                                                    e.target.style.display =
                                                                        "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-brand-main/20 flex items-center justify-center text-brand-main font-bold text-sm flex-shrink-0">{t.initials}</div>
                                                        )}
                                                        <div>
                                                            <h3 className="font-brinnan font-semibold text-brand-dark">{t.name}</h3>
                                                            {t.role && <p className="text-gray-600 text-sm">{t.role}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                <div className="flex justify-center mt-0">

                                    <a
                                        href="#contacto"
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        className="bg-brand-accent uppercase text-white px-8 py-4 rounded-full font-semibold hover:scale-105 duration-300 transition-all w-max text-sm tracking-wide shadow-md flex items-center gap-2"
                                    >
                                        Solicitar
                                        Evaluación Ahora{" "}
                                        <ArrowRight
                                            size={
                                                16
                                            }
                                        />
                                    </a>

                                </div>
                            </div>
                        </section>
                    )}
                </div>


                {/* Centered Authenticity Guarantee Section - Ocultado por solicitud */}
                {false && sello_originalidad && (
                    <section className="py-16 md:py-24 relative bg-brand-dark overflow-hidden w-full border-t border-brand-main/20 text-center lg:text-left">
                        {/* Grid overlay */}
                        <div className="absolute inset-0 z-0 opacity-[0.03]">
                            <div className="w-full h-full bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        </div>

                        {/* Large glowing background orb behind the centered plate */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-brand-main/20 blur-[120px] md:blur-[180px] opacity-25 rounded-full pointer-events-none z-0"></div>

                        {/* Organic vector overlays for background aesthetic */}
                        <div className="absolute top-[-10%] left-0 z-0 opacity-15 pointer-events-none transform ">
                            <img src="/assets/img/overlay-4.png" className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="absolute top-[-10%] right-0  z-0 opacity-15 pointer-events-none ">
                            <img src="/assets/img/overlay-5.png" className="w-full h-full object-contain" alt="" />
                        </div>

                        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                            {/* Left Column: Text and CTA Button */}
                            <div className="lg:col-span-7 flex flex-col items-center lg:items-start w-full">
                                <ScrollReveal direction="up" staggerDelay={0.15} className="flex flex-col items-center lg:items-start w-full">
                                    {sello_originalidad.subtitle && (
                                        <h4 className="bg-brand-main/10 border border-brand-main/30 text-brand-main text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full mb-6 inline-block">
                                            {sello_originalidad.subtitle}
                                        </h4>
                                    )}
                                    {sello_originalidad.title && (
                                        <h2 className="font-brinnan text-4xl uppercase   md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">



                                            <FormattedText
                                                text={sello_originalidad.title}
                                                boldClassName="font-medium text-brand-main"
                                            />
                                        </h2>
                                    )}
                                    {sello_originalidad.description && (
                                        <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-2xl text-center lg:text-left mb-8">
                                            {sello_originalidad.description}
                                        </p>
                                    )}
                                </ScrollReveal>

                                {/* CTA Button */}
                                <ScrollReveal direction="up" delay={0.4}>
                                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-0">
                                        <a
                                            href="#consulta"
                                            onClick={scrollToTop}
                                            className="bg-brand-accent hover:scale-105 duration-300 text-white px-10 py-5 rounded-full font-semibold transition-all text-xs lg:text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(213,119,72,0.3)] flex items-center gap-2"
                                        >
                                            Solicitar Cotización Ahora <ArrowRight size={18} />
                                        </a>
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Right Column: Centered spacious plate presentation */}
                            <div className="lg:col-span-5 w-full flex justify-center">
                                <ScrollReveal direction="up" delay={0.3} className="w-full max-w-lg px-4">
                                    <div className="perspective-1000 w-full flex justify-center">
                                        <motion.div
                                            style={{ opacity: localPlateOpacity }}
                                            whileHover={{
                                                scale: 1.05,
                                                rotateY: -4,
                                                rotateX: 4,
                                                boxShadow: "0 45px 90px rgba(0,0,0,0.85), 0 0 70px rgba(96,169,190,0.35)"
                                            }}
                                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                            className="relative w-full aspect-[1.6] rounded-[2rem] overflow-hidden border border-white/15 shadow-[0_30px_60px_rgba(0,0,0,0.7)] group bg-zinc-900 cursor-pointer"
                                        >
                                            <img
                                                src={`/api/landing_home/media/${sello_originalidad.image}`}
                                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-102"
                                                alt={sello_originalidad.title}
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                            {/* Glare reflect effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
                                        </motion.div>
                                    </div>
                                </ScrollReveal>
                            </div>
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








