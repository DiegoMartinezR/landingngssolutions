import React from "react";
import {
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    ChevronRight,
    Youtube,
    Linkedin,
    Twitter,
} from "lucide-react";

const Footer = ({
    generals = [],
    services = [],
    socials = [],
    scrollToSection,
}) => {
    // Map generals
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

    const getSocialIcon = (name = "", iconClass = "") => {
        const n = name?.toLowerCase() || "";
        const i = iconClass?.toLowerCase() || "";

        if (n.includes("instagram") || i.includes("instagram")) {
            return (
                <Instagram
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            );
        }
        if (n.includes("facebook") || i.includes("facebook")) {
            return (
                <Facebook
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            );
        }
        if (
            n.includes("twitter") ||
            i.includes("twitter") ||
            n.includes("x.com")
        ) {
            return (
                <Twitter
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            );
        }
        if (n.includes("linkedin") || i.includes("linkedin")) {
            return (
                <Linkedin
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            );
        }
        if (n.includes("youtube") || i.includes("youtube")) {
            return (
                <Youtube
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            );
        }
        if (n.includes("tiktok") || i.includes("tiktok")) {
            return (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform"
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            );
        }
        if (n.includes("whatsapp") || i.includes("whatsapp")) {
            return (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="group-hover:scale-110 transition-transform"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
            );
        }

        return (
            <ChevronRight
                size={18}
                className="group-hover:scale-110 transition-transform"
            />
        );
    };

    const isHomePage =
        typeof window !== "undefined" && window.location.pathname === "/";

    const handleNavClick = (e, targetId) => {
        if (isHomePage) {
            e.preventDefault();
            if (scrollToSection) {
                scrollToSection(targetId, 1500);
            } else {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    };

    return (
        <footer className="bg-brand-dark w-full text-brand-gray pt-10 md:pt-14 pb-8 relative overflow-hidden border-t border-brand-main/20">
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-brand-main/5 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-main/10 rounded-full blur-[60px] md:blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 relative z-10 pb-8 md:pb-10 border-b border-white/5">
                {/* Brand Logo & Description */}
                <div className="lg:col-span-4 space-y-4 md:space-y-5 pr-4">
                    <div className="flex items-center">
                        <img
                            src="/assets/img/logo-white.png"
                            alt="NGS Solutions Logo"
                            className="h-8 sm:h-9 lg:h-12 w-auto object-contain"
                        />
                    </div>
                    <p className="text-sm md:text-base leading-relaxed font-light text-white max-w-md">
                        {generalsObj.footer_description}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                        {socials?.map((social, index) => {
                            if (!social.link) return null;
                            return (
                                <a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={social.name}
                                    role="link"
                                    aria-label={`Visitar nuestro perfil de ${social.name}`}
                                    className="w-9 h-9 rounded-full bg-brand-main/20 flex items-center justify-center hover:bg-brand-main hover:-translate-y-1 text-brand-light transition-all duration-300 border border-brand-main/30 group"
                                >
                                    {getSocialIcon(social.name, social.icon)}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Links / Treatments */}
                <div className="lg:col-span-3 lg:col-start-6">
                    <h3 className="font-brinnan text-brand-light text-sm font-semibold tracking-widest uppercase mb-4 sm:mb-5 flex items-center gap-2">
                        Soluciones EAS
                    </h3>
                    <ul className="space-y-2.5 sm:space-y-3 text-sm font-light text-white">
                        {services?.map((s, idx) => (
                            <li key={idx}>
                                <a
                                    href={
                                        isHomePage
                                            ? "#sectores"
                                            : "/#sectores"
                                    }
                                    onClick={(e) =>
                                        handleNavClick(e, "sectores")
                                    }
                                    aria-label={`Ir a la sección de ${s.title}`}
                                    className="hover:text-brand-light hover:pl-2 inline-flex items-center transition-all duration-300 group"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="opacity-0 -ml-4 mr-0 group-hover:opacity-100 transition-all text-brand-main"
                                    />
                                    {s.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact details */}
                <div className="lg:col-span-4">
                    <h3 className="font-brinnan text-brand-light text-sm font-semibold tracking-widest uppercase mb-4 sm:mb-5 flex items-center gap-2">
                        Contacto B2B
                    </h3>
                    <div className="space-y-3 text-sm font-light text-white">
                        <div className="flex items-start gap-3.5 p-3 rounded-xl transition-colors">
                            <div className="w-9 h-9 rounded-full bg-brand-main/20 flex flex-shrink-0 items-center justify-center text-white">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <strong className="block text-brand-light font-medium mb-0.5 tracking-wide">
                                    Oficina Principal
                                </strong>
                                <span className="leading-relaxed">
                                    {generalsObj.address}
                                </span>
                            </div>
                        </div>

                        {generalsObj.support_phone && (
                            <div className="flex items-start gap-3.5 p-3 rounded-xl transition-colors">
                                <div className="w-9 h-9 rounded-full bg-brand-main/20 flex flex-shrink-0 items-center justify-center text-white">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <strong className="block text-brand-light font-medium mb-0.5 tracking-wide">
                                        Atención Comercial
                                    </strong>
                                    <a href={`https://wa.me/${generalsObj.support_phone.replace(/\D/g, '')}`} aria-label={`Llamar a ${generalsObj.support_phone}`} target="_blank" rel="noreferrer" className="leading-relaxed text-brand-light font-medium hover:underline">
                                        {generalsObj.support_phone}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Legal / Copyright bottom bar */}
            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-12 pb-4 lg:pb-0 mt-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6 text-md font-light text-gray-600 relative z-10">
                <p className=" text-center  !text-white text-sm">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-medium text-white inline-flex uppercase">
                        NGS Solutions
                    </span>{" "}
                    Todos los derechos reservados. Powered by{" "}
                    <a
                        href="https://mundoweb.pe"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Sitio web de MundoWeb, se abre en una nueva pestaña"
                        className="text-brand-light hover:underline"
                    >
                        MundoWeb
                    </a>
                </p>
                <div className="flex items-center gap-6 text-sm">
                    <a
                        href="/privacy-policy"
                        aria-label="Leer Políticas de Privacidad"
                        className="text-white hover:text-brand-light transition-colors"
                    >
                        Políticas de Privacidad
                    </a>

                    <a
                        href="/terms-and-conditions"
                        aria-label="Leer Términos y Condiciones"
                        className="text-white hover:text-brand-light transition-colors"
                    >
                        Términos y Condiciones
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
