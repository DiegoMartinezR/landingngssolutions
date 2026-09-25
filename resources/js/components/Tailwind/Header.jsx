import React, { useState, useEffect } from "react";
import { Menu, X, Droplets } from "lucide-react";

const navLinks = [
    { id: "sectores", label: "Servicios" },
    { id: "clientes", label: "Clientes" },
    { id: "productos", label: "Productos" },
    { id: "testimonios", label: "Testimonios" },
];

const Header = ({ scrollToForm, scrollToSection, forceFixed = false }) => {
    const [isScrolled, setIsScrolled] = useState(forceFixed);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (forceFixed) {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [forceFixed]);

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
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogoClick = (e) => {
        if (isHomePage) {
            e.preventDefault();
            if (scrollToSection) {
                scrollToSection("top", 1500);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setIsMobileMenuOpen(false);
        }
    };

    const handleCtaClick = (e) => {
        if (isHomePage && scrollToForm) {
            e.preventDefault();
            scrollToForm();
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header
            style={{
                animation: "headerSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-hidden ${isScrolled
                ? "bg-brand-dark/95 backdrop-blur-md shadow-lg border-b border-white/10 py-2.5 sm:py-3 lg:py-3"
                : "bg-transparent border-b border-transparent py-2.5 sm:py-3 lg:py-3.5"
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full flex justify-between items-center transition-all duration-300">
                <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 pl-2 cursor-pointer">
                    <img
                        src="/assets/img/logo-white.png"
                        alt="NGS Solutions"
                        className="h-7 sm:h-8 lg:h-9 xl:h-10 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
                    />
                </a>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={isHomePage ? `#${link.id}` : `/#${link.id}`}
                            onClick={(e) => handleNavClick(e, link.id)}
                            className="px-4 text-white/80 hover:text-brand-main font-medium text-[15px] xl:text-[17px] tracking-wider transition-colors duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <a
                    href={isHomePage ? "#contacto" : "/#contacto"}
                    onClick={handleCtaClick}
                    className="hidden md:inline-flex bg-brand-accent hover:bg-brand-accent/90 text-white px-6 py-4 rounded-full font-semibold text-[10px] xl:text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                    Solicitar Cotización
                </a>

                <button
                    className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <style>
                {`
                @keyframes headerSlideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes menuFadeIn {
                    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                `}
            </style>

            {isMobileMenuOpen && (
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full">
                    <div
                        style={{ animation: "menuFadeIn 0.2s ease-out forwards" }}
                        className="md:hidden mt-3 bg-brand-dark/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-5 flex flex-col gap-1"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={isHomePage ? `#${link.id}` : `/#${link.id}`}
                                onClick={(e) => handleNavClick(e, link.id)}
                                className="text-white/80 hover:text-brand-main font-semibold text-[14px] capitalize tracking-wide transition-colors py-3 px-4 rounded-xl hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={isHomePage ? "#contacto" : "/#contacto"}
                            onClick={handleCtaClick}
                            className="bg-brand-accent hover:bg-brand-accent/90 text-white text-center py-3.5 rounded-full font-bold text-[11px] uppercase tracking-wider mt-3 active:scale-[0.97] transition-all duration-200 shadow-md"
                        >
                            Solicitar Cotización
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
