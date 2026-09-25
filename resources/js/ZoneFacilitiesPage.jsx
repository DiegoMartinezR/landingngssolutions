import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowLeft,
    CheckCircle,
    ArrowRight,
    Search,
    ShieldCheck,
    PhoneIncoming,
    Navigation as NavigationIcon,
} from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import BookingModal from "./components/BookingModal";
import TextWithHighlight from "./Utils/TextWithHighlight";
import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
    Circle,
} from "@react-google-maps/api";
import Global from "./Utils/Global";
import { useTranslation } from "./hooks/useTranslation";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 10 },
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
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

// Hook measure scroll
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

const FacilityItem = ({ facility, openBooking, onFocusOnMap }) => {
    const { t } = useTranslation();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const handleNext = (e) => {
        e.stopPropagation();
        if (facility.gallery && facility.gallery.length > 0) {
            setCurrentImgIndex((prev) => (prev + 1) % facility.gallery.length);
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (facility.gallery && facility.gallery.length > 0) {
            setCurrentImgIndex(
                (prev) =>
                    (prev - 1 + facility.gallery.length) %
                    facility.gallery.length,
            );
        }
    };

    return (
        <motion.div
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col h-full border border-gray-100"
            variants={itemVariants}
        >
            <div className="h-72 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={facility.gallery[currentImgIndex]}
                        src={`/api/facility/media/${facility.gallery[currentImgIndex]}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => {
                            e.target.src = "/api/cover/thumbnail/null";
                        }}
                        alt={facility.title}
                        className="w-full h-full aspect-square object-cover"
                    />
                </AnimatePresence>

                {facility.gallery && facility.gallery.length > 1 && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white hover:text-[#1b3f90] transition-all border border-white/30"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white hover:text-[#1b3f90] transition-all border border-white/30"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full z-10 transition-all group-hover:bottom-6">
                            {facility.gallery.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImgIndex(i);
                                    }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        i === currentImgIndex
                                            ? "bg-white w-4"
                                            : "bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-black text-primary mb-4 tracking-tighter leading-[tight]">
                    <TextWithHighlight
                        text={facility.title}
                        color="text-azul"
                    />
                </h3>
                <p className="text-gray-500 mb-8 text-base font-light leading-relaxed flex-grow">
                    {facility.description}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                    <a
                        href={`/cleaning-services/${facility.slug}`}
                        className="relative flex items-center justify-center gap-3 w-full py-5 bg-[#1b3f90] text-white font-black rounded-full transition-all duration-300 shadow-lg shadow-[#1b3f90]/20 hover:shadow-2xl hover:shadow-[#1b3f90]/40 group/btn overflow-hidden transform hover:-translate-y-1"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Explore Local Services <ArrowRight size={20} />
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

const ZoneFacilitiesPage = ({
    zone,
    facilities,
    linkWhatsApp,
    randomImage,
    generals,
    services,
    landing,
}) => {
    const scrollY = useScroll();
    const [horizontalRef, horizontalProgress] = useHorizontalScroll();
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [actionType, setActionType] = useState("appointment"); // 'appointment' or 'estimate'

    const [mapInstance, setMapInstance] = useState(null);
    const mapContainerRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");

    // DEBUG LOGS FOR DATA ALIGNMENT
    useEffect(() => {
        console.log("Zone Page Mounted. Facilities Count:", facilities?.length);
    }, [facilities]);

    const filteredFacilities = useMemo(() => {
        const list = Array.isArray(facilities) ? facilities : [];
        if (!searchTerm || !searchTerm.trim()) return list;
        
        const low = searchTerm.toLowerCase().trim();
        return list.filter((f) => {
            const inTitle = String(f.title || "").toLowerCase().includes(low);
            const inDesc = String(f.description || "").toLowerCase().includes(low);
            const inZip = String(f.zip_codes || "").toLowerCase().includes(low);
            const inUbications = f.ubications?.some((ub) => 
                String(ub.address || "").toLowerCase().includes(low)
            );

            return inTitle || inDesc || inZip || inUbications;
        });
    }, [facilities, searchTerm]);

    const openBooking = (type = "appointment", service = null) => {
        setActionType(type);
        setSelectedService(service);
        setModalOpen(true);
    };

    const handleFocusOnMap = (facility) => {
        if (mapContainerRef.current) {
            mapContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            if (mapInstance && facility.latitude && facility.longitude) {
                const pos = {
                    lat: Number(facility.latitude),
                    lng: Number(facility.longitude),
                };
                mapInstance.panTo(pos);
                mapInstance.setZoom(15);

                // If there are sub-points, show the first one or just highlight the facility
                if (facility.ubications && facility.ubications.length > 0) {
                    setSelectedMarker({
                        ...facility,
                        uIdx: 0,
                        ub: facility.ubications[0],
                    });
                }
            }
        }
    };

    const { t } = useTranslation();

    const hero = landing?.find(
        (i) => i.correlative === "page_facility_hero",
    ) || {
        title: "Expert cleaning services in * " + zone.name + "*",
        description:
            "Experience the premium cleaning touch in " +
            zone.name +
            ". Professional staff, certified equipment, and 24/7 support.",
    };

    const supportPhone =
        generals.find((x) => x.correlative === "support_phone")?.description ||
        "(555) 123-4567";

    const mapCenter = useMemo(
        () => ({
            lat: Number(zone.latitude) || -12.046374,
            lng: Number(zone.longitude) || -77.042793,
        }),
        [zone.latitude, zone.longitude],
    );

    const bgImages = useMemo(() => {
        const imgs = facilities
            .filter((f) => f.gallery && f.gallery.length > 0)
            .map((f) => `/api/facility/media/${f.gallery[0]}`);

        if (imgs.length === 0 && hero?.image) {
            imgs.push(`/api/landing_home/media/${hero.image}`);
        }

        if (imgs.length === 0) {
            imgs.push(
                "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
            );
        }

        return imgs;
    }, [facilities, hero]);

    const landingBanner = landing?.find(
        (item) => item.correlative === "page_facility_banner",
    );

    useEffect(() => {
        if (bgImages.length <= 1) return;
        const timer = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bgImages]);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    return (
        <div className="bg-white min-h-screen">
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

            {/* FLAGSHIP HERO SECTION - ANIMATED SLIDESHOW */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-primary">
                <div className="absolute inset-0 w-full h-full transform scale-105">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={bgIndex}
                            src={bgImages[bgIndex]}
                            initial={{ opacity: 0, scale: 1.15 }}
                            animate={{ opacity: 0.55, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/40 to-primary"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-primary lg:px-0 text-center pt-20">
                    <div className="mb-12">
                        <motion.a
                            href="/offices"
                            className="inline-flex items-center gap-3 text-white/50 hover:text-accent  text-xs uppercase tracking-widest transition-all hover:gap-5"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <ArrowLeft size={18} /> Back to all service zones
                        </motion.a>
                    </div>

                    <ParallaxLayer scrollY={scrollY} speedY={-30}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tighter leading-[0.85] text-white whitespace-pre-line">
                                <TextWithHighlight
                                    text={`Explore *${zone.name}*`}
                                    split_coma={true}
                                    color="text-secondary"
                                />
                            </h1>

                            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 font-light tracking-wide leading-relaxed drop-shadow-lg">
                                {zone.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={() => openBooking("estimate")}
                                    className="relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-accent text-primary font-bold rounded-full transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 group/btn overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Request an Estimate{" "}
                                        <ArrowRight size={22} />
                                    </span>
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                </button>
                                <button
                                    onClick={() => {
                                        const el =
                                            document.getElementById(
                                                "coverage-map",
                                            );
                                        el?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }}
                                    className="relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full transition-all duration-300 hover:bg-white hover:text-primary hover:-translate-y-1 group/btn overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        View Coverage Map <MapPin size={22} />
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </ParallaxLayer>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
                    <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">
                        Discovery
                    </span>
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </section>

            <main className="min-h-screen bg-white font-sans text-negro pt-20">
                {/* SAME CONTAINER AS INSTALACIONES */}
                <motion.div
                    className="max-w-7xl mx-auto px-primary lg:px-0 py-8 lg:py-12"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div
                        id="coverage-map"
                        ref={mapContainerRef}
                        className="grid gap-10 mb-24 items-center scroll-mt-32"
                    >
                        {/* MAP PANEL - SYLED LIKE INSTALACIONES */}
                        <motion.div
                            className="h-[650px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group"
                            variants={itemVariants}
                        >
                            <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "100%",
                                        height: "650px",
                                    }}
                                    zoom={12}
                                    center={mapCenter}
                                    onLoad={(map) => {
                                        setMapInstance(map);
                                        const bounds =
                                            new window.google.maps.LatLngBounds();
                                        let hasMarkers = false;

                                        if (zone.latitude && zone.longitude) {
                                            bounds.extend({
                                                lat: Number(zone.latitude),
                                                lng: Number(zone.longitude),
                                            });
                                            hasMarkers = true;
                                        }

                                        facilities.forEach((fac) => {
                                            if (fac.latitude && fac.longitude) {
                                                bounds.extend({
                                                    lat: Number(fac.latitude),
                                                    lng: Number(fac.longitude),
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
                                    {/* Facilities Coverage Circles & Sub-points Markers */}
                                    {filteredFacilities.map((fac) => (
                                        <React.Fragment key={fac.id}>
                                            {/* Coverage Circle for Facility */}
                                            {fac.latitude && fac.longitude && (
                                                <Circle
                                                    center={{
                                                        lat: Number(
                                                            fac.latitude,
                                                        ),
                                                        lng: Number(
                                                            fac.longitude,
                                                        ),
                                                    }}
                                                    radius={Number(
                                                        fac.radius || 5000,
                                                    )}
                                                    options={{
                                                        fillColor: "#1b3f90",
                                                        fillOpacity: 0.08,
                                                        strokeColor: "#1b3f90",
                                                        strokeOpacity: 0.25,
                                                        strokeWeight: 1,
                                                        clickable: false,
                                                    }}
                                                />
                                            )}

                                            {/* Sub-points (Specific Service Areas) */}
                                            {Array.isArray(fac.ubications) &&
                                                fac.ubications.map(
                                                    (ub, uIdx) => {
                                                        const lat = Number(
                                                            ub.lat,
                                                        );
                                                        const lng = Number(
                                                            ub.lng,
                                                        );
                                                        if (
                                                            isNaN(lat) ||
                                                            isNaN(lng)
                                                        )
                                                            return null;

                                                        const isSelected =
                                                            selectedMarker?.id ===
                                                                fac.id &&
                                                            selectedMarker?.uIdx ===
                                                                uIdx;

                                                        return (
                                                            <Marker
                                                                key={`${fac.id}-ub-${uIdx}`}
                                                                position={{
                                                                    lat,
                                                                    lng,
                                                                }}
                                                                onClick={() =>
                                                                    setSelectedMarker(
                                                                        {
                                                                            ...fac,
                                                                            uIdx,
                                                                            ub,
                                                                        },
                                                                    )
                                                                }
                                                                title={
                                                                    ub.address ||
                                                                    fac.title
                                                                }
                                                            >
                                                                {isSelected && (
                                                                    <InfoWindow
                                                                        onCloseClick={() =>
                                                                            setSelectedMarker(
                                                                                null,
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="p-3 min-w-[200px]">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                                                <h4 className="font-black text-[#1b3f90] text-xs uppercase tracking-tight m-0">
                                                                                    {
                                                                                        fac.title
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                            <p className="text-[12px] font-bold text-gray-800 mb-1 leading-tight">
                                                                                {
                                                                                    ub.address
                                                                                }
                                                                            </p>
                                                                            <p className="text-[10px] text-gray-500 line-clamp-2 font-light mb-3">
                                                                                {
                                                                                    fac.description
                                                                                }
                                                                            </p>
                                                                            <a
                                                                                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-2 text-[10px] text-[#1b3f90] font-black uppercase tracking-widest hover:gap-3 transition-all underline underline-offset-4"
                                                                            >
                                                                                View
                                                                                Directions{" "}
                                                                                <ArrowRight
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                            </a>
                                                                        </div>
                                                                    </InfoWindow>
                                                                )}
                                                            </Marker>
                                                        );
                                                    },
                                                )}
                                        </React.Fragment>
                                    ))}
                                </GoogleMap>
                            </LoadScript>
                        </motion.div>
                    </div>

                    {/* DIVIDER LIKE INSTALACIONES */}
                    <div className="flex items-center gap-8 mb-24 opacity-20">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1b3f90]"></div>
                        <div className="w-3 h-3 rotate-45 border-2 border-[#1b3f90]"></div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1b3f90]"></div>
                    </div>

                    {/* FACILITIES GRID */}
                    <div className="mb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary tracking-tighter leading-tight mb-4">
                                Cleaning centers in <br />
                                <TextWithHighlight
                                    text={zone.name}
                                    color="text-azul"
                                />
                            </h3>

                            {/* MODERN SEARCH BAR */}
                            <div className="relative w-full max-w-md group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
                                    <Search className="text-gray-300 transition-colors" size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="City or ZIP code..."
                                    className="block w-full pl-14 pr-6 py-4 bg-gray-50 rounded-full border border-gray-100 shadow-sm focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-lg font-medium outline-none placeholder:text-gray-300 placeholder:font-light"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm("")}
                                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-primary transition-colors pr-2"
                                    >
                                        <span className="text-xs font-black uppercase tracking-widest">Clear</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            key={searchTerm ? "filtered" : "all"}
                        >
                            {filteredFacilities.map((facility) => (
                                <FacilityItem
                                    key={facility.id}
                                    facility={facility}
                                    openBooking={openBooking}
                                    onFocusOnMap={handleFocusOnMap}
                                />
                            ))}
                        </motion.div>

                        {filteredFacilities.length === 0 && (
                            <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200">
                                <Search
                                    size={64}
                                    className="mx-auto text-gray-200 mb-6"
                                />
                                <h3 className="text-3xl font-black text-gray-300 uppercase tracking-tighter">
                                    {searchTerm ? "No locations found matching your search" : "More locations opening soon"}
                                </h3>
                                <p className="text-gray-500 font-light mt-4">
                                    {searchTerm ? "Try searching by another ZIP code or city name." : `We are actively expanding into new areas of ${zone.name}.`}
                                </p>
                            </div>
                        )}
                    </div>

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
                                    e.target.src = "/api/cover/thumbnail/null";
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
                </motion.div>

                {/* SERVICES SECTION - IDENTICAL TO HOME.JSX */}
                {services && services.length > 0 && (
                    <section
                        id="services"
                        ref={horizontalRef}
                        className="relative bg-[#f8f9fa] mt-12"
                        style={{ height: "350vh" }}
                    >
                        {/* Sticky Container */}
                        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-[#f8f9fa]">
                            <div className="w-full px-4 text-center shrink-0 z-10 pt-24 md:pt-32 pb-4">
                                <h3 className="text-4xl md:text-7xl font-black text-primary tracking-tighter mb-4">
                                    Service Solutions
                                </h3>
                                <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
                                    Expert cleaning for any space. Choose the
                                    solution that fits your needs.
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
                                                                        size={
                                                                            18
                                                                        }
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
            </main>

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
                <ZoneFacilitiesPage {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
