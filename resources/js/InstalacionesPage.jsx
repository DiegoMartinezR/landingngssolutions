import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import {
    ChevronDown,
    Clock,
    Target,
    Grid,
    BookOpen,
    Users,
    User,
    ArrowRight,
    Phone,
    MapPin,
    ShieldCheck,
} from "lucide-react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ModalAppointment from "./components/Appointment/ModalAppointment";
import BookingModal from "./components/BookingModal";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";
import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
    Circle,
} from "@react-google-maps/api";
import Global from "./Utils/Global";
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
// Animación del botón (igual a tu versión)
const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
        },
    },
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
        },
    },
    hover: {
        scale: 1.1,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.5 },
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

const imageHover = {
    hover: {
        scale: 1.03,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
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

const ButtonShimmer = ({
    children,
    variant = "primary",
    className = "",
    href,
}) => {
    const baseStyle =
        "relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full transition-all duration-500 overflow-hidden group tracking-wide";

    const variants = {
        primary:
            "bg-primary text-white hover:bg-[#153272] hover:shadow-[0_10px_30px_rgba(27,63,144,0.3)]",
        accent: "bg-accent text-primary hover:bg-[#a6bb32] hover:shadow-[0_10px_30px_rgba(184,207,56,0.3)]",
        outline:
            "border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-primary",
    };

    return (
        <motion.a
            href={href}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            variants={buttonVariants}
            initial="hidden"
            animate={["visible", "pulse"]}
            whileHover="hover"
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </motion.a>
    );
};

const ZoneItem = ({ zone, index }) => {
    const isEven = index % 2 === 0;
    const isTriple = index % 3 === 0;

    const getImageClass = (totalImages, imgIndex, isEven, isTriple) => {
        if (totalImages === 1) return "col-span-12 row-span-12";
        if (totalImages === 2) return "col-span-12 row-span-6";
        if (totalImages === 3) {
            if (imgIndex === 0)
                return isEven
                    ? "col-span-6 row-span-6"
                    : isTriple
                      ? "col-span-12 row-span-6"
                      : "col-span-5 row-span-6";
            if (imgIndex === 1)
                return isEven
                    ? "col-span-6 row-span-6"
                    : isTriple
                      ? "col-span-6 row-span-6"
                      : "col-span-7 row-span-12";
            if (imgIndex === 2)
                return isEven
                    ? "col-span-12 row-span-6"
                    : isTriple
                      ? "col-span-6 row-span-6"
                      : "col-span-5 row-span-6";
        }
        if (totalImages === 4) return "col-span-6 row-span-6";
        if (totalImages >= 5) {
            if (imgIndex === 0) return "col-span-6 row-span-6";
            if (imgIndex === 1) return "col-span-6 row-span-4";
            if (imgIndex === 2) return "col-span-6 row-span-4";
            if (imgIndex === 3) return "col-span-6 row-span-6";
            if (imgIndex === 4) return "col-span-6 row-span-4";
        }
        return "col-span-6 row-span-6";
    };

    const { t } = useTranslation();
    return (
        <motion.div
            id={`zone-${zone.id}`}
            className="pt-12 scroll-mt-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div
                className={`flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"} md:items-start md:gap-8`}
            >
                <motion.div
                    className="md:w-1/2 mb-8 lg:mb-0 lg:pr-12"
                    variants={itemVariants}
                >
                    <motion.h2
                        className="text-[40px] text-primary leading-[42px] font-bold mb-2 lg:text-7xl tracking-tighter"
                        variants={slideUp}
                    >
                        <TextWithHighlight
                            text={zone.name}
                            split_coma={true}
                            color="text-primary"
                        />
                    </motion.h2>

                    <motion.p
                        className="mb-4 text-gray-500 lg:text-xl lg:pt-4 "
                        variants={fadeIn}
                    >
                        {zone.description}
                    </motion.p>

                    {zone.facilities && zone.facilities.length > 0 && (
                        <motion.div className="mb-10 " variants={fadeIn}>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {zone.facilities.map((facility) => (
                                    <li
                                        key={facility.id}
                                        className="group/item flex items-center gap-3 text-gray-500 hover:text-primary transition-colors"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(184,207,56,0.5)] group-hover/item:scale-125 transition-transform" />
                                        <span className="text-base text-gray-500 font-semibold tracking-tight">
                                            <TextWithHighlight
                                                text={facility.title}
                                                split_coma={true}
                                                color="text-primary"
                                            />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    <motion.div className="w-full px-[5%] lg:px-0 flex items-center justify-center lg:justify-start mt-6">
                        <ButtonShimmer
                            href={`/offices/${zone.slug}`}
                            variant="primary"
                            className="shadow-xl"
                        >
                            View location zone
                        </ButtonShimmer>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="md:w-1/2 grid grid-cols-12 grid-rows-12 gap-2 h-[552px]"
                    variants={containerVariants}
                >
                    {zone.gallery &&
                        zone.gallery.map((img, imgIndex) => (
                            <motion.div
                                key={imgIndex}
                                className={`${getImageClass(zone.gallery.length, imgIndex, isEven, isTriple)} rounded-lg overflow-hidden`}
                                whileHover="hover"
                                variants={imageHover}
                            >
                                <motion.img
                                    src={`/api/zone/media/${img}`}
                                    alt={`Zonas ${zone.name}`}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: imgIndex * 0.1 + 0.3 }}
                                    onError={(e) => {
                                        e.target.src =
                                            "/api/cover/thumbnail/null";
                                    }}
                                />
                            </motion.div>
                        ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

// Hook para medir el scroll general
const useScroll = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        setScrollY(window.scrollY);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollY;
};

const ParallaxLayer = ({
    children,
    speedX = 0,
    speedY = 0,
    className = "",
    scrollY = 0,
}) => {
    const moveX = scrollY * speedX * 0.01;
    const moveY = scrollY * speedY * 0.01;

    return (
        <div className={`will-change-transform ${className}`}>
            <div
                style={{ transform: `translate3d(${moveX}px, ${moveY}px, 0)` }}
                className="transition-transform duration-75 ease-out"
            >
                {children}
            </div>
        </div>
    );
};

const InstalacionesPage = ({ landing, zones, generals, services }) => {
    const scrollY = useScroll();
    const landingHero = landing?.find(
        (item) => item.correlative === "page_facility_hero",
    );
    const landingMap = landing?.find(
        (item) => item.correlative === "page_facility_map",
    );
    const landingBanner = landing?.find(
        (item) => item.correlative === "page_facility_banner",
    );
    const [selectedMarker, setSelectedMarker] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [actionType, setActionType] = useState("appointment"); // 'appointment' or 'estimate'

    const openBooking = (type = "appointment", service = null) => {
        setActionType(type);
        setSelectedService(service);
        setModalOpen(true);
    };

    const supportPhone =
        generals.find((x) => x.correlative === "support_phone")?.description ||
        "(555) 123-4567";

    const mapCenter = useMemo(() => {
        if (!zones || zones.length === 0)
            return { lat: -12.046374, lng: -77.042793 };

        let totalLat = 0;
        let totalLng = 0;
        let count = 0;

        zones.forEach((zone) => {
            if (zone.latitude && zone.longitude) {
                totalLat += Number(zone.latitude);
                totalLng += Number(zone.longitude);
                count++;
            }
        });

        if (count === 0) return { lat: -12.046374, lng: -77.042793 };

        return {
            lat: totalLat / count,
            lng: totalLng / count,
        };
    }, [zones]);

    const scrollToZone = (zoneId) => {
        const element = document.getElementById(`zone-${zoneId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="font-kanit">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shimmer { 100% { transform: translateX(100%); } }
            `,
                }}
            />
            <Header
                generals={generals}
                forceFixed={scrollY > 50}
                openBooking={openBooking}
            />

            {/* HERO SECTION - HOME STYLE */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-primary">
                <div
                    className="absolute inset-0 w-full h-full transform scale-105"
                    style={{
                        transform: `translateY(${scrollY * 0.4}px) scale(1.05)`,
                    }}
                >
                    {landingHero?.is_video == 1 ||
                    landingHero?.is_video == "1" ? (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <iframe
                                className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                                src={`https://www.youtube.com/embed/${landingHero.video?.split("v=")[1]?.split("&")[0] || landingHero.video?.split("/").pop()}?autoplay=1&mute=1&loop=1&playlist=${landingHero.video?.split("v=")[1]?.split("&")[0] || landingHero.video?.split("/").pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&bg=1`}
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                            ></iframe>
                        </div>
                    ) : (
                        <img
                            src={`/api/landing_home/media/${landingHero.image}`}
                            className="w-full h-full object-cover opacity-60"
                            alt="Background"
                            onError={(e) => {
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-primary lg:px-0 text-center pt-20">
                    <ParallaxLayer scrollY={scrollY} speedY={-30}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter leading-[0.9] text-white whitespace-pre-line">
                                <TextWithHighlight
                                    text={landingHero?.title}
                                    split_coma={true}
                                />
                            </h1>
                            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 font-light tracking-wide">
                                {landingHero?.description}
                            </p>
                        </motion.div>
                    </ParallaxLayer>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
                    <span className="text-white text-xs tracking-widest uppercase">
                        Explore
                    </span>
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </section>

            {zones ? (
                <div className="min-h-screen bg-white font-sans text-gray-500 pt-20">
                    <motion.div
                        className="max-w-7xl mx-auto px-primary lg:px-0 py-8 lg:py-12"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div
                            className="text-center mb-12"
                            variants={fadeIn}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight">
                                <TextWithHighlight
                                    text={landingMap?.title}
                                    split_coma={true}
                                    color="text-secondary"
                                />
                            </h2>

                            <p className="mt-10 text-2xl text-gray-500 max-w-3xl mx-auto font-light">
                                {landingMap?.description}
                            </p>
                        </motion.div>

                        <motion.div
                            className="mb-16 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative"
                            variants={fadeIn}
                        >
                            <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "100%",
                                        height: "650px",
                                    }}
                                    zoom={11}
                                    center={mapCenter}
                                    onLoad={(map) => {
                                        const bounds =
                                            new window.google.maps.LatLngBounds();
                                        let hasMarkers = false;
                                        zones.forEach((zone) => {
                                            if (
                                                zone.latitude &&
                                                zone.longitude
                                            ) {
                                                bounds.extend({
                                                    lat: Number(zone.latitude),
                                                    lng: Number(zone.longitude),
                                                });
                                                hasMarkers = true;
                                            }
                                        });
                                        if (hasMarkers) {
                                            map.fitBounds(bounds);
                                        }
                                    }}
                                    options={{
                                        mapTypeControl: false,
                                        streetViewControl: false,
                                        styles: [
                                            {
                                                featureType: "poi",
                                                stylers: [
                                                    { visibility: "off" },
                                                ],
                                            },
                                        ],
                                    }}
                                >
                                    {zones.map(
                                        (zone) =>
                                            zone.latitude &&
                                            zone.longitude && (
                                                <Marker
                                                    key={zone.id}
                                                    position={{
                                                        lat: Number(
                                                            zone.latitude,
                                                        ),
                                                        lng: Number(
                                                            zone.longitude,
                                                        ),
                                                    }}
                                                    title={zone.name}
                                                    onClick={() =>
                                                        setSelectedMarker(zone)
                                                    }
                                                >
                                                    {selectedMarker?.id ===
                                                        zone.id && (
                                                        <InfoWindow
                                                            onCloseClick={() =>
                                                                setSelectedMarker(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            <div className="p-2 min-w-[150px]">
                                                                <h4 className="font-bold text-primary text-base mb-1">
                                                                    <TextWithHighlight
                                                                        text={
                                                                            zone.name ||
                                                                            ""
                                                                        }
                                                                        color="text-secondary"
                                                                    />
                                                                </h4>
                                                                <p className="text-xs text-gray-600 mb-3">
                                                                    {zone.description?.substring(
                                                                        0,
                                                                        60,
                                                                    )}
                                                                    ...
                                                                </p>
                                                                <button
                                                                    onClick={() => {
                                                                        scrollToZone(
                                                                            zone.id,
                                                                        );
                                                                        setSelectedMarker(
                                                                            null,
                                                                        );
                                                                    }}
                                                                    className="w-full bg-primary text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-[#153272] transition-colors flex items-center justify-center gap-1"
                                                                >
                                                                    Go to zone{" "}
                                                                    <ArrowRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </InfoWindow>
                                                    )}
                                                </Marker>
                                            ),
                                    )}
                                    {zones.map(
                                        (zone) =>
                                            zone.latitude &&
                                            zone.longitude && (
                                                <Circle
                                                    key={`circle-${zone.id}`}
                                                    center={{
                                                        lat: Number(
                                                            zone.latitude,
                                                        ),
                                                        lng: Number(
                                                            zone.longitude,
                                                        ),
                                                    }}
                                                    radius={Number(
                                                        zone.radius || 5000,
                                                    )}
                                                    options={{
                                                        fillColor: "#1b3e8f",
                                                        fillOpacity: 0.1,
                                                        strokeColor: "#1b3e8f",
                                                        strokeOpacity: 0.4,
                                                        strokeWeight: 1,
                                                        clickable: false,
                                                    }}
                                                />
                                            ),
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </motion.div>

                        {/* CTA BANNER - AREA EXPANSION (PREMIUM BENTO STYLE) */}
                        <section className="relative rounded-[3rem] overflow-hidden mb-24 min-h-[450px] flex items-center group shadow-[0_32px_64px_-16px_rgba(27,63,144,0.3)]">
                            {/* Background Image & Overlay */}
                            <div className="absolute inset-0 z-0">
                                <motion.img
                                    src={`/api/landing_home/media/${landingBanner?.image}`}
                                    className="w-full h-[130%] object-cover transform scale-110"
                                    alt="Expansion Background"
                                    style={{
                                        translateY: (scrollY * -0.15) % 100,
                                    }}
                                    onError={(e) => {
                                        e.target.src =
                                            "/api/cover/thumbnail/null";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary opacity-60"></div>

                                {/* Animated Glowing Orbs */}
                                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
                                <div
                                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse"
                                    style={{ animationDelay: "1s" }}
                                ></div>
                            </div>

                            {/* Floating Glow Accent */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 opacity-30 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000"></div>

                            <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl mx-auto py-16">
                                <motion.h3
                                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-center text-white mb-8 tracking-tighter leading-[0.95] drop-shadow-2xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <TextWithHighlight
                                        text={landingBanner?.title}
                                        split_coma={true}
                                        color="text-secondary"
                                    />
                                </motion.h3>

                                <motion.p
                                    className="text-white/80 text-lg md:text-2xl  text-center mb-12 font-light max-w-xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {landingBanner?.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                                >
                                    <a
                                        href={`tel:${supportPhone}`}
                                        className="relative inline-flex items-center gap-4 font-medium  bg-accent text-primary px-10 py-5 rounded-full  text-lg shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 group/btn overflow-hidden w-full sm:w-auto justify-center"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            Contact Us
                                            <Phone
                                                size={22}
                                                className="group-hover/btn:rotate-12 transition-transform"
                                            />
                                        </span>
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                    </a>

                                    <button
                                        onClick={() => openBooking("estimate")}
                                        className="relative inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                                    >
                                        Get Free Estimate
                                    </button>
                                </motion.div>
                            </div>
                        </section>

                        <div className="flex items-center gap-8 mb-20 opacity-20">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary"></div>
                            <div className="w-3 h-3 rotate-45 border-2 border-primary"></div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary"></div>
                        </div>
                        <AnimatePresence>
                            {zones &&
                                zones.map((zone, index) => (
                                    <ZoneItem
                                        key={zone.id}
                                        zone={zone}
                                        index={index}
                                    />
                                ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            ) : (
                <MaintenancePage />
            )}
            <Footer generals={generals} />

            <BookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                service={selectedService}
                allServices={services || []}
                actionType={actionType}
            />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <InstalacionesPage {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
