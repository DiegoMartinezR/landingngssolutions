import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, ArrowRight, Loader2, CheckCircle2, X } from "lucide-react";
import MessagesRest from "../actions/MessagesRest";

const messagesRest = new MessagesRest();

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

const cleanPhoneNumber = (phoneStr) => {
    if (!phoneStr) return "";
    let cleaned = phoneStr.replace(/\D/g, "");
    if (cleaned.length === 9 && cleaned.startsWith("9")) {
        cleaned = "51" + cleaned;
    }
    return cleaned;
};

const WhatsApp = ({ data = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAdvisorIndex, setSelectedAdvisorIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const containerRef = useRef(null);

    // Obtener asesores de WhatsApp configurados
    const advisors = (() => {
        const raw = data?.find(
            (x) => x.correlative === "whatsapp_advisors",
        )?.description;
        if (!raw) return [];
        try {
            const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    })();

    const generalPhone =
        data?.find(
            (x) =>
                x.correlative === "support_phone" ||
                x.correlative === "whatsapp" ||
                x.correlative === "phone",
        )?.description || "+51 999 888 777";

    const activeAdvisors =
        advisors.length > 0
            ? advisors
            : [
                  {
                      name: "Asesor Especialista",
                      phone: generalPhone,
                      position: "Seguridad Antihurto",
                      message:
                          "¡Hola! Deseo cotizar soluciones antihurto para mi negocio.",
                  },
              ];

    const currentAdvisor = activeAdvisors[selectedAdvisorIndex] || activeAdvisors[0];

    // Cerrar al hacer click fuera del widget
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                !isSubmitting
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, isSubmitting]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Por favor ingresa tu nombre completo";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Por favor ingresa tu número de celular";
        } else if (formData.phone.trim().replace(/\D/g, "").length < 7) {
            newErrors.phone = "Ingresa un número de celular válido";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Por favor ingresa tu correo electrónico";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
        ) {
            newErrors.email = "Ingresa un correo electrónico válido";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [redirectUrl, setRedirectUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const cleanDestPhone = cleanPhoneNumber(currentAdvisor.phone || generalPhone);
        const userName = formData.name.trim();
        const userPhone = formData.phone.trim();
        const userEmail = formData.email.trim();

        // 1. Construir mensaje personalizado para WhatsApp
        const waText = `¡Hola ${currentAdvisor.name}! Mi nombre es ${userName}. Quisiera solicitar información y cotización sobre soluciones de seguridad antihurto.\n\n*Mis Datos de Contacto:*\n📱 Celular: ${userPhone}\n✉️ Correo: ${userEmail}`;
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanDestPhone}&text=${encodeURIComponent(
            waText,
        )}`;
        setRedirectUrl(waUrl);

        // 2. Abrir WhatsApp INMEDIATAMENTE de manera síncrona dentro del evento de clic
        // Esto elimina por completo el bloqueo de popups del navegador
        try {
            const waWindow = window.open(waUrl, "_blank", "noopener,noreferrer");
            if (!waWindow || waWindow.closed || typeof waWindow.closed === "undefined") {
                // Respaldo mediante enlace nativo si hay bloqueadores estrictos
                const link = document.createElement("a");
                link.href = waUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.warn("Fallo al abrir ventana, usando fallback de redirección:", err);
            window.location.href = waUrl;
        }

        // 3. Mostrar confirmación en interfaz inmediatamente
        setIsSuccess(true);

        // 4. Guardar lead en la base de datos de forma concurrente (sin demorar al usuario)
        const payload = {
            name: userName,
            phone: userPhone,
            email: userEmail,
            subject: "Contacto WhatsApp",
            description: `Lead capturado desde botón flotante de WhatsApp.\nAsesor destino: ${currentAdvisor.name} (${currentAdvisor.phone})\nTeléfono: ${userPhone}\nCorreo: ${userEmail}`,
            triggered_by: "WhatsApp Flotante",
            ...getStoredUTMs(),
        };

        messagesRest
            .save(payload, null, false)
            .then(() => {
                console.log("Lead de WhatsApp guardado correctamente en panel admin.");
            })
            .catch((err) => {
                console.error("Error al registrar lead de WhatsApp:", err);
            });

        // 5. Cerrar y limpiar el formulario suavemente luego de 2.5s
        setTimeout(() => {
            setIsSuccess(false);
            setIsOpen(false);
            setFormData({ name: "", phone: "", email: "" });
        }, 2500);
    };

    // Formatear hora actual para el chat bubble
    const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <>
            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.15); opacity: 0.3; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
                .wa-pulse-ring {
                    animation: pulse-ring 2.5s infinite ease-in-out;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2.5s infinite ease-in-out;
                }
                .wa-speech-tail::after {
                    content: '';
                    position: absolute;
                    top: 12px;
                    left: -8px;
                    width: 0;
                    height: 0;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-right: 8px solid #ffffff;
                }
            `}</style>

            <div
                ref={containerRef}
                className="fixed bottom-6 right-6 z-[999] flex flex-col items-end"
                style={{ filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.15))" }}
            >
                {/* Popover / Formulario Flotante que emerge desde el punto del icono */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.25, y: 35, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.25, y: 35, x: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 26,
                            }}
                            style={{ transformOrigin: "bottom right" }}
                            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[380px] max-w-[400px] bg-white rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden relative"
                        >
                            {/* Header del Chat estilo WhatsApp */}
                            <div className="bg-gradient-to-r from-[#075E54] via-[#0e6e63] to-[#128C7E] p-4 text-white relative overflow-hidden">
                                {/* Decoración de fondo */}
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                                
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md p-1 border border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
                                                {currentAdvisor?.photo ? (
                                                    <img
                                                        src={`/assets/resources/${currentAdvisor.photo}`}
                                                        alt={currentAdvisor.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                            e.target.src = "/assets/img/whatsapp.svg";
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src="/assets/img/whatsapp.svg"
                                                        alt="WhatsApp"
                                                        className="w-7 h-7 drop-shadow-sm"
                                                    />
                                                )}
                                            </div>
                                            {/* Indicador Online en vivo */}
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#075E54] rounded-full"></span>
                                        </div>

                                        <div>
                                            <h4 className="font-extrabold text-[15px] leading-tight text-white flex items-center gap-1.5">
                                                <span>{currentAdvisor?.name || "Asesor Comercial"}</span>
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                                                <p className="text-[11px] text-emerald-100 font-medium">
                                                    En línea · Respuesta inmediata
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón Cerrar (✕) */}
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Cerrar formulario"
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center text-white/90 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Selector de asesores si hay más de 1 */}
                                {activeAdvisors.length > 1 && (
                                    <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                        <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider shrink-0">
                                            Asesor:
                                        </span>
                                        {activeAdvisors.map((adv, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedAdvisorIndex(idx)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                                                    selectedAdvisorIndex === idx
                                                        ? "bg-white text-[#075E54] font-bold shadow-sm"
                                                        : "bg-white/15 text-white/90 hover:bg-white/25"
                                                }`}
                                            >
                                                <span>{adv.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contenido del Chat / Formulario */}
                            <div className="p-5 bg-[#f0f2f5] max-h-[80vh] overflow-y-auto">
                                {/* Mensaje de bienvenida tipo globo de WhatsApp */}
                                <div className="relative mb-5 bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 wa-speech-tail">
                                    <p className="text-[13px] text-gray-700 leading-relaxed font-normal">
                                        👋 <strong className="font-semibold text-gray-900">¡Hola!</strong> Por favor completa tus datos para conectarte con un especialista y brindarte una <strong className="text-[#075E54]">atención personalizada</strong> por WhatsApp.
                                    </p>
                                    <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-400 font-medium">
                                        <span>{currentTime}</span>
                                    </div>
                                </div>

                                {isSuccess ? (
                                    /* Estado de Éxito */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl p-6 text-center shadow-sm border border-emerald-100 flex flex-col items-center justify-center gap-3 my-2"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#25D366] flex items-center justify-center">
                                            <CheckCircle2 className="w-9 h-9" />
                                        </div>
                                        <h5 className="font-bold text-gray-900 text-base">
                                            ¡Datos Registrados!
                                        </h5>
                                        <p className="text-xs text-gray-600 max-w-[240px]">
                                            ¡Listo! Se ha iniciado el chat oficial de WhatsApp.
                                        </p>
                                        {redirectUrl && (
                                            <a
                                                href={redirectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba58] text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                                            >
                                                <span>Clic aquí si no abrió el chat</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </motion.div>
                                ) : (
                                    /* Formulario */
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                                        {/* Campo: Nombre */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                                Nombre Completo <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Ej. Carlos Mendoza"
                                                    disabled={isSubmitting}
                                                    className={`w-full pl-9 pr-3 py-2.5 bg-white text-gray-900 text-sm rounded-xl border ${
                                                        errors.name
                                                            ? "border-red-400 focus:ring-red-300"
                                                            : "border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20"
                                                    } focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400`}
                                                />
                                            </div>
                                            {errors.name && (
                                                <p className="text-[11px] text-red-500 mt-1 font-medium pl-1">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Campo: Celular */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                                Nro de Celular / WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Ej. 987 654 321"
                                                    disabled={isSubmitting}
                                                    className={`w-full pl-9 pr-3 py-2.5 bg-white text-gray-900 text-sm rounded-xl border ${
                                                        errors.phone
                                                            ? "border-red-400 focus:ring-red-300"
                                                            : "border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20"
                                                    } focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-[11px] text-red-500 mt-1 font-medium pl-1">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Campo: Correo */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                                Correo Electrónico <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="ejemplo@empresa.com"
                                                    disabled={isSubmitting}
                                                    className={`w-full pl-9 pr-3 py-2.5 bg-white text-gray-900 text-sm rounded-xl border ${
                                                        errors.email
                                                            ? "border-red-400 focus:ring-red-300"
                                                            : "border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20"
                                                    } focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-[11px] text-red-500 mt-1 font-medium pl-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Botón de Enviar e Iniciar Chat */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                            className="mt-2 w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba58] text-white font-bold text-sm rounded-xl shadow-[0_8px_20px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Iniciando WhatsApp...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src="/assets/img/whatsapp.svg"
                                                        alt="WhatsApp"
                                                        className="w-5 h-5 brightness-0 invert"
                                                    />
                                                    <span>Iniciar chat de WhatsApp</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Microcopy de seguridad */}
                                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium text-center pt-1">
                                            <span>🔒 Tus datos están protegidos y seguros.</span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Botón Principal Flotante (Toggle) */}
                <div className="relative">
                    {/* Ring animado sutil cuando está cerrado */}
                    {!isOpen && (
                        <div className="absolute inset-0 rounded-full bg-[#25D366]/40 wa-pulse-ring pointer-events-none -z-10" />
                    )}

                    <motion.button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Abrir chat de WhatsApp"
                        className={`flex items-center justify-center bg-[#25D366] hover:bg-[#20ba58] text-white p-4 rounded-full shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition-all duration-300 border-2 border-white group z-50 cursor-pointer ${
                            !isOpen ? "animate-bounce-subtle" : ""
                        }`}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        {isOpen ? (
                            <X className="w-7 h-7 font-bold text-white transition-transform duration-200 rotate-90" />
                        ) : (
                            <img
                                src="/assets/img/whatsapp.svg"
                                alt="WhatsApp"
                                className="w-8 h-8 lg:w-9 lg:h-9"
                            />
                        )}

                        {/* Tooltip visible cuando el formulario está cerrado */}
                        {!isOpen && (
                            <div className="absolute -top-14 right-0 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block">
                                <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1.5">
                                    <span>Hola 👋</span>
                                    <span>¿En qué podemos ayudarte?</span>
                                    <div className="absolute bottom-0 right-6 w-2.5 h-2.5 bg-[#128C7E] rotate-45 transform translate-y-[4px]"></div>
                                </div>
                            </div>
                        )}
                    </motion.button>
                </div>
            </div>
        </>
    );
};

export default WhatsApp;
