import React from "react";

// --- High-Fidelity SVG Brand Logos ---

// 1. Aruma: Modern rounded bold typography
const ArumaLogo = ({ className = "h-8 sm:h-9" }) => (
    <svg viewBox="0 0 160 40" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="0"
            y="31"
            fontFamily="'Montserrat', 'Outfit', sans-serif"
            fontSize="34"
            fontWeight="900"
            letterSpacing="-0.5px"
        >
            aruma
        </text>
    </svg>
);

// 2. Fritz Sport: Star of David above FRITZ, = SPORT = below
const FritzSportLogo = ({ className = "h-11 sm:h-12" }) => (
    <svg viewBox="0 0 160 56" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Star of David */}
        <g transform="translate(68, 0) scale(0.65)" stroke="currentColor" strokeWidth="2.2" fill="none">
            <polygon points="18,0 36,30 0,30" />
            <polygon points="18,36 36,6 0,6" />
        </g>
        {/* FRITZ */}
        <text
            x="80"
            y="39"
            textAnchor="middle"
            fontFamily="'Kanit', 'Arial Black', sans-serif"
            fontSize="24"
            fontWeight="900"
            letterSpacing="1px"
        >
            FRITZ
        </text>
        {/* = SPORT = */}
        <g transform="translate(80, 50)">
            <line x1="-70" y1="-5" x2="-42" y2="-5" stroke="currentColor" strokeWidth="2" />
            <line x1="-70" y1="-1" x2="-42" y2="-1" stroke="currentColor" strokeWidth="2" />
            <text
                x="0"
                y="0"
                textAnchor="middle"
                fontFamily="'Montserrat', sans-serif"
                fontSize="12"
                fontWeight="900"
                letterSpacing="3.5px"
            >
                SPORT
            </text>
            <line x1="42" y1="-5" x2="70" y2="-5" stroke="currentColor" strokeWidth="2" />
            <line x1="42" y1="-1" x2="70" y2="-1" stroke="currentColor" strokeWidth="2" />
        </g>
    </svg>
);

// 3. Crocs: Iconic lowercase rounded bold typography + (TM)
const CrocsLogo = ({ className = "h-8 sm:h-9" }) => (
    <svg viewBox="0 0 150 40" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="0"
            y="31"
            fontFamily="'Arial Rounded MT Bold', 'Montserrat', sans-serif"
            fontSize="35"
            fontWeight="900"
            letterSpacing="-1px"
        >
            crocs
        </text>
        <text
            x="115"
            y="14"
            fontFamily="'Montserrat', sans-serif"
            fontSize="10"
            fontWeight="700"
        >
            TM
        </text>
    </svg>
);

// 4. Crepier: Elegant spaced serif/sans uppercase with EST. 1978
const CrepierLogo = ({ className = "h-9 sm:h-10" }) => (
    <svg viewBox="0 0 170 46" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="85"
            y="26"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="23"
            fontWeight="600"
            letterSpacing="6px"
        >
            CREPIER
        </text>
        <text
            x="85"
            y="42"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="9"
            fontWeight="600"
            letterSpacing="4px"
            opacity="0.85"
        >
            EST. 1978
        </text>
    </svg>
);

// 5. GD Group: Modern geometric circular emblem + Group
const GdGroupLogo = ({ className = "h-9 sm:h-10" }) => (
    <svg viewBox="0 0 175 44" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Modern GD Monogram */}
        <g transform="translate(4, 3)">
            {/* Outer G shape */}
            <path
                d="M 28 6 C 18 6 10 13 10 21 C 10 29 18 36 28 36 C 36 36 43 31 45 23 L 29 23 L 29 17 L 51 17 C 51.5 19 52 21 52 23 C 52 35 41 43 28 43 C 13 43 3 33 3 21 C 3 9 13 0 28 0 C 37 0 45 4 50 11 L 43 16 C 40 10 34 6 28 6 Z"
                fill="currentColor"
            />
            {/* Inner Arrow / D cut */}
            <path d="M 27 10 L 27 25 L 34 25 L 34 17 L 38 21 L 42 17 L 34 9 Z" fill="currentColor" />
            <circle cx="56" cy="4" r="2.5" fill="currentColor" />
        </g>
        <text
            x="76"
            y="32"
            fontFamily="'Montserrat', sans-serif"
            fontSize="27"
            fontWeight="700"
            letterSpacing="0.5px"
        >
            Group
        </text>
    </svg>
);

// 6. Mentha & Chocolate: Luxury high-contrast fashion monogram
const MenthaChocolateLogo = ({ className = "h-10 sm:h-11" }) => (
    <svg viewBox="0 0 170 50" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="85"
            y="30"
            textAnchor="middle"
            fontFamily="'Playfair Display', 'Didot', 'Georgia', serif"
            fontSize="34"
            fontWeight="400"
            letterSpacing="2px"
        >
            M&amp;CH
        </text>
        <text
            x="85"
            y="46"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="3.5px"
            opacity="0.8"
        >
            MENTHA &amp; CHOCOLATE
        </text>
    </svg>
);

// 7. Tayssir: Tech streetwear logotype TAYS2IR TRANSWEAR
const TayssirLogo = ({ className = "h-8 sm:h-9" }) => (
    <svg viewBox="0 0 160 42" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="0"
            y="26"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontSize="23"
            fontWeight="900"
            letterSpacing="2.5px"
        >
            TAYS<tspan fontSize="21" letterSpacing="1px">2</tspan>IR
        </text>
        <text
            x="1"
            y="38"
            fontFamily="'Montserrat', sans-serif"
            fontSize="7"
            fontWeight="800"
            letterSpacing="5px"
            opacity="0.75"
        >
            TRANSWEAR
        </text>
    </svg>
);

// 8. Palmas Logistics: Geometric bold typography with LOGISTICS
const PalmasLogisticsLogo = ({ className = "h-8 sm:h-9" }) => (
    <svg viewBox="0 0 170 42" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="0"
            y="25"
            fontFamily="'Kanit', 'Montserrat', sans-serif"
            fontSize="24"
            fontWeight="900"
            letterSpacing="3px"
        >
            PALMAS
        </text>
        <text
            x="1"
            y="38"
            fontFamily="'Montserrat', sans-serif"
            fontSize="8"
            fontWeight="700"
            letterSpacing="5px"
            opacity="0.8"
        >
            LOGISTICS
        </text>
    </svg>
);

// 9. Casalinda: Home roof silhouette + casalinda + Lo mejor para su hogar
const CasalindaLogo = ({ className = "h-9 sm:h-10" }) => (
    <svg viewBox="0 0 170 46" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Trapezoid Roof Icon */}
        <polygon points="12,12 8,12 18,3 90,3 100,12 12,12" fill="currentColor" />
        <text
            x="0"
            y="28"
            fontFamily="'Montserrat', sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="-0.5px"
        >
            casalinda
        </text>
        <text
            x="48"
            y="40"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="8.5"
            fontWeight="500"
            opacity="0.85"
        >
            Lo mejor para su hogar
        </text>
    </svg>
);

// 10. Kayser: Bold modern capital sans with registered trademark
const KayserLogo = ({ className = "h-7 sm:h-8" }) => (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <text
            x="0"
            y="26"
            fontFamily="'Kanit', 'Montserrat', sans-serif"
            fontSize="26"
            fontWeight="900"
            letterSpacing="2.5px"
        >
            KAYSER
        </text>
        <text
            x="126"
            y="12"
            fontFamily="'Montserrat', sans-serif"
            fontSize="10"
            fontWeight="700"
        >
            ®
        </text>
    </svg>
);

// 11. New Athletic: Dynamic slanted NA ribbon emblem + New Athletic text
const NewAthleticLogo = ({ className = "h-11 sm:h-12" }) => (
    <svg viewBox="0 0 160 52" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic slanted NA emblem */}
        <g transform="translate(48, 2)">
            <path
                d="M 12 0 L 26 0 L 14 20 L 0 20 Z"
                fill="currentColor"
            />
            <path
                d="M 32 0 L 46 0 L 34 20 L 20 20 Z"
                fill="currentColor"
            />
            <path
                d="M 40 0 L 58 0 L 64 20 L 48 20 Z"
                fill="currentColor"
            />
            <polygon points="42,8 55,8 48,15" fill="#ffffff" />
        </g>
        <text
            x="80"
            y="44"
            textAnchor="middle"
            fontFamily="'Kanit', 'Montserrat', sans-serif"
            fontSize="17"
            fontWeight="900"
            letterSpacing="0.5px"
        >
            New Athletic
        </text>
    </svg>
);

// 12. Platanitos: Mascot emblem + lowercase organic logotype
const PlatanitosLogo = ({ className = "h-9 sm:h-10" }) => (
    <svg viewBox="0 0 170 42" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Mascot / umbrella-palm silhouette */}
        <g transform="translate(2, 4)">
            {/* Top cap / umbrella */}
            <path
                d="M 2 16 C 2 8 8 2 16 2 C 24 2 30 8 30 16 C 26 15 22 17 19 19 C 16 17 12 15 8 16 C 5 15 3 15 2 16 Z"
                fill="currentColor"
            />
            {/* Lower stems */}
            <path
                d="M 9 18 C 9 24 12 28 12 32 C 14 32 14 24 15 19 C 17 24 18 32 20 32 C 20 26 23 22 23 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
        </g>
        <text
            x="40"
            y="28"
            fontFamily="'Outfit', 'Montserrat', sans-serif"
            fontSize="26"
            fontWeight="800"
            letterSpacing="-0.5px"
        >
            platanitos
        </text>
    </svg>
);

// --- Dual Marquee Component ---
const ClientsMarquee = ({ title, core_values = [], certifications = [] }) => {
    // Default mockup logos fallback if no dynamic data
    const defaultRow1 = [
        { name: "Aruma", component: <ArumaLogo /> },
        { name: "Fritz Sport", component: <FritzSportLogo /> },
        { name: "Crocs", component: <CrocsLogo /> },
        { name: "Crepier", component: <CrepierLogo /> },
        { name: "GD Group", component: <GdGroupLogo /> },
        { name: "Mentha & Chocolate", component: <MenthaChocolateLogo /> },
    ];

    const defaultRow2 = [
        { name: "Tayssir", component: <TayssirLogo /> },
        { name: "Palmas Logistics", component: <PalmasLogisticsLogo /> },
        { name: "Casalinda", component: <CasalindaLogo /> },
        { name: "Kayser", component: <KayserLogo /> },
        { name: "New Athletic", component: <NewAthleticLogo /> },
        { name: "Platanitos", component: <PlatanitosLogo /> },
    ];

    // Priority 1: Use core_values from backend (same as "Nuestros Aliados")
    // Priority 2: Use certifications if provided
    // Priority 3: Fallback to high-fidelity mockup logos
    let row1 = [];
    let row2 = [];

    const activeList =
        core_values && core_values.length > 0
            ? core_values
            : certifications && certifications.length > 0
            ? certifications
            : null;

    if (activeList && activeList.length > 0) {
        if (activeList.length === 1) {
            row1 = activeList;
            row2 = activeList;
        } else {
            row1 = activeList.filter((_, idx) => idx % 2 === 0);
            row2 = activeList.filter((_, idx) => idx % 2 !== 0);
            if (row2.length === 0) row2 = row1;
        }
    } else {
        row1 = defaultRow1;
        row2 = defaultRow2;
    }

    // Build seamless track ensuring at least 8 items per base cycle before duplication
    const buildTrack = (arr) => {
        if (!arr || arr.length === 0) return [];
        let base = [...arr];
        while (base.length < 8) {
            base = [...base, ...arr];
        }
        return [...base, ...base];
    };

    const track1 = buildTrack(row1);
    const track2 = buildTrack(row2);

    return (
        <section
            id="clientes"
            className="py-12 sm:py-16 md:py-20 bg-transparent relative w-full overflow-hidden select-none"
        >
            {/* CSS Keyframe animations for seamless 60fps infinite marquee */}
            <style>{`
                @keyframes marquee-to-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                @keyframes marquee-to-right {
                    0% { transform: translate3d(-50%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
                .marquee-track-left {
                    display: flex;
                    width: max-content;
                    animation: marquee-to-left 38s linear infinite;
                    will-change: transform;
                }
                .marquee-track-right {
                    display: flex;
                    width: max-content;
                    animation: marquee-to-right 38s linear infinite;
                    will-change: transform;
                }
                .marquee-container:hover .marquee-track-left,
                .marquee-container:hover .marquee-track-right {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Section Title */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 text-center mb-10 sm:mb-14">
                <h2 className="font-brinnan text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                    {title ? (
                        title
                    ) : (
                        <>
                            Empresas que{" "}
                            <span className="font-bold text-brand-main">
                                confían en nosotros
                            </span>
                        </>
                    )}
                </h2>
            </div>

            {/* Marquee Wrapper with side fade gradients */}
            <div className="relative w-full overflow-hidden marquee-container py-2">
                {/* Left and Right Smooth Gradient Masks */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 md:w-56 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 md:w-56 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

                <div className="flex flex-col gap-6 sm:gap-9">
                    {/* Row 1: Moves to the LEFT */}
                    <div className="overflow-hidden w-full flex">
                        <div className="marquee-track-left flex items-center">
                            {track1.map((item, idx) => (
                                <div
                                    key={`r1-${idx}`}
                                    className="px-6 sm:px-10 md:px-14 flex items-center justify-center h-16 sm:h-20 shrink-0 cursor-pointer transition-all duration-300 group"
                                    title={item.name}
                                >
                                    {item.image ? (
                                        <img
                                            src={
                                                item.image.startsWith("http") ||
                                                item.image.startsWith("/")
                                                    ? item.image
                                                    : `/api/core_value/media/${item.image}`
                                            }
                                            alt={item.name || "Aliado"}
                                            className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[130px] sm:max-w-[170px] w-auto object-contain transition-all duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src =
                                                    "/api/cover/thumbnail/null";
                                            }}
                                        />
                                    ) : item.component ? (
                                        <div className="text-[#19354d] opacity-90 group-hover:opacity-100 group-hover:text-[#00a3e0] transition-all duration-300 group-hover:scale-105">
                                            {item.component}
                                        </div>
                                    ) : (
                                        <span className="font-brinnan font-bold text-lg text-[#19354d] group-hover:text-brand-main transition-colors">
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Moves to the RIGHT */}
                    <div className="overflow-hidden w-full flex">
                        <div className="marquee-track-right flex items-center">
                            {track2.map((item, idx) => (
                                <div
                                    key={`r2-${idx}`}
                                    className="px-6 sm:px-10 md:px-14 flex items-center justify-center h-16 sm:h-20 shrink-0 cursor-pointer transition-all duration-300 group"
                                    title={item.name}
                                >
                                    {item.image ? (
                                        <img
                                            src={
                                                item.image.startsWith("http") ||
                                                item.image.startsWith("/")
                                                    ? item.image
                                                    : `/api/core_value/media/${item.image}`
                                            }
                                            alt={item.name || "Aliado"}
                                            className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[130px] sm:max-w-[170px] w-auto object-contain transition-all duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src =
                                                    "/api/cover/thumbnail/null";
                                            }}
                                        />
                                    ) : item.component ? (
                                        <div className="text-[#19354d] opacity-90 group-hover:opacity-100 group-hover:text-[#00a3e0] transition-all duration-300 group-hover:scale-105">
                                            {item.component}
                                        </div>
                                    ) : (
                                        <span className="font-brinnan font-bold text-lg text-[#19354d] group-hover:text-brand-main transition-colors">
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientsMarquee;
