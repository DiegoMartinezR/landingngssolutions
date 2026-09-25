import React, { useEffect, useRef, useState } from "react";
// Inyectar CDN de banderas
const FlagIconsCDN = () => (
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
    />
);

import {
    Mail,
    User,
    MessageSquare,
    X,
    ChevronDown,
    Building2,
    Home as HomeIcon,
    HardHat,
    Calendar as CalendarIcon,
    Clock,
    Phone,
    MapPin,
    Square,
    Users,
    Layers,
    Type,
    ArrowRight,
    CheckCircle2,
    PawPrint,
    Briefcase,
    Info,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "../hooks/useTranslation";
import TextWithHighlight from "../Utils/TextWithHighlight";
import PublicAppointmentsRest from "../actions/PublicAppointmentsRest";
import PublicMessagesRest from "../actions/PublicMessagesRest";

const appointmentsRest = new PublicAppointmentsRest();
const messagesRest = new PublicMessagesRest();

const PhoneInput = ({ onPhoneChange, value: initialValue }) => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(initialValue || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await fetch(
                    "/assets/data/countries_phone.json",
                );
                const data = await response.json();
                setCountries(data);
                const peru = data.find((c) => c.iso2 === "PE");
                setSelectedCountry(peru || data[0]);
            } catch (error) {
                console.error("Error loading countries:", error);
            }
        };
        loadCountries();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhoneNumber(value);
        if (selectedCountry) {
            const fullNumber = `+${selectedCountry.phoneCode.replace(/\D/g, "")}${value}`;
            onPhoneChange(fullNumber);
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full">
            <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
                Phone Number
            </label>
            <div className="flex border border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 bg-gray-50/50">
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="flex items-center justify-between px-3 py-3 h-full border-r border-gray-200 bg-transparent rounded-l-xl w-24 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`fi fi-${selectedCountry?.iso2.toLowerCase()} mr-2`}
                            ></span>
                            <span className="text-sm font-semibold">
                                {selectedCountry?.iso2}
                            </span>
                        </div>
                        <ChevronDown
                            className={`h-3 w-3 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
                    </button>
                    {showDropdown && (
                        <div className="absolute z-[60] mt-2 w-72 bg-white shadow-2xl rounded-2xl py-2 max-h-72 overflow-auto border border-gray-100 backdrop-blur-xl">
                            {countries.map((country) => (
                                <div
                                    key={country.iso2}
                                    className="px-4 py-2.5 hover:bg-accent/5 cursor-pointer flex items-center transition-colors"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span
                                        className={`fi fi-${country.iso2.toLowerCase()} mr-3 shadow-sm`}
                                    ></span>
                                    <span className="flex-1 text-sm">
                                        {country.nameES}
                                    </span>
                                    <span className="text-xs font-mono text-gray-400">
                                        +{country.phoneCode}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm font-medium"
                />
            </div>
        </div>
    );
};

const InputField = ({ label, span = "1", ...props }) => (
    <div
        className={`relative group ${span === "2" ? "col-span-2" : "col-span-1"}`}
    >
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <input
                {...props}
                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-sm font-semibold text-primary group-hover:border-primary/40 transition-all duration-300"
            />
        </div>
    </div>
);

const TextAreaField = ({ label, span = "1", ...props }) => (
    <div
        className={`relative group ${span === "2" ? "col-span-2" : "col-span-1"}`}
    >
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <textarea
                {...props}
                rows={4}
                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-sm font-semibold text-primary resize-none group-hover:border-primary/40 transition-all duration-300"
            />
        </div>
    </div>
);

const SelectField = ({
    label,
    options,
    span = "1",
    onChange,
    value,
    name,
    placeholder,
    required,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div
            className={`relative group ${span === "2" ? "col-span-2" : "col-span-1"}`}
            ref={dropdownRef}
        >
            <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
                {label} {required && "(OBLIGATORIO)"}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-6 py-4 bg-white border ${
                        isOpen
                            ? "border-primary ring-[6px] ring-primary/5"
                            : "border-gray-100"
                    } rounded-2xl shadow-sm transition-all duration-300 text-sm font-semibold text-primary flex items-center justify-between group-hover:border-primary/40 text-left`}
                >
                    <span
                        className={
                            selectedOption ? "text-primary" : "text-gray-400"
                        }
                    >
                        {selectedOption
                            ? selectedOption.label
                            : placeholder || "Seleccione una opción"}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-primary/30 transition-transform duration-500 ease-out ${isOpen ? "rotate-180 text-primary" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    disabled={opt.disabled}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full px-5 py-3.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center justify-between mb-1 last:mb-0 ${
                                        value === opt.value
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-primary/70 hover:bg-gray-50 hover:text-primary"
                                    } ${opt.disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
                                >
                                    <span>{opt.label}</span>
                                    {value === opt.value ? (
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    ) : (
                                        opt.disabled && (
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                Ocupado
                                            </span>
                                        )
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Campo oculto para validación nativa si el navegador lo permite, aunque manejamos el estado manualmente */}
            <input
                type="hidden"
                name={name}
                value={value || ""}
                required={required}
            />
        </div>
    );
};

const CheckboxGroup = ({
    label,
    options,
    name,
    formData,
    setFormData,
    span = "2",
}) => (
    <div className={`col-span-${span} space-y-3`}>
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => (
                <label
                    key={opt}
                    className="flex items-center gap-3 p-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] cursor-pointer hover:bg-white hover:border-primary/20 transition-all duration-300 group"
                >
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-transform group-hover:scale-110"
                        checked={(formData[name] || []).includes(opt)}
                        onChange={(e) => {
                            const current = formData[name] || [];
                            const next = e.target.checked
                                ? [...current, opt]
                                : current.filter((i) => i !== opt);
                            setFormData((p) => ({ ...p, [name]: next }));
                        }}
                    />
                    <span className="text-sm font-bold text-primary/70 group-hover:text-primary transition-colors">
                        {opt}
                    </span>
                </label>
            ))}
        </div>
    </div>
);

const ConfirmationSection = ({ type, formData, setFormData }) => {
    const confirmations =
        {
            residential: [
                "Entiendo que el servicio será evaluado de manera profesional según las condiciones y el alcance solicitado",
                "Deseo recibir un servicio de limpieza profesional con estándares de alta calidad",
                "Acepto recibir una propuesta personalizada acorde a mis necesidades",
            ],
            commercial: [
                "Entiendo que este servicio será evaluado de manera profesional según las necesidades de mi empresa",
                "Deseo contratar un servicio de limpieza corporativo confiable y de alto nivel",
                "Acepto recibir una propuesta personalizada acorde a las necesidades de mi negocio",
            ],
            post_construction: [
                "Entiendo que el servicio será evaluado según la etapa actual, las condiciones del sitio y el alcance del proyecto",
                "Deseo contratar un servicio profesional de limpieza post-construcción",
                "Acepto recibir una propuesta personalizada de acuerdo con las necesidades y características de la obra",
            ],
        }[type] || [];

    return (
        <div className="col-span-2 space-y-3 mt-4 border-t border-gray-100 pt-6">
            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-4">
                Confirmación del cliente (OBLIGATORIO)
            </h4>
            {confirmations.map((text, idx) => {
                const fieldName = `confirm_${idx}`;
                return (
                    <div
                        key={idx}
                        className="flex py-2  gap-4 rounded-2xl  items-center  group hover:border-primary/20 transition-all duration-300"
                    >
                        <input
                            type="checkbox"
                            required
                            name={fieldName}
                            id={`${type}_${fieldName}`}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-transform group-hover:scale-110"
                            checked={formData[fieldName] || false}
                            onChange={(e) =>
                                setFormData((p) => ({
                                    ...p,
                                    [fieldName]: e.target.checked,
                                }))
                            }
                        />
                        <label
                            htmlFor={`${type}_${fieldName}`}
                            className="text-xs text-primary/80 leading-snug cursor-pointer font-bold italic group-hover:text-primary transition-colors"
                        >
                            {text}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

const getStoredUTMs = () => {
    const utms = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
        (key) => {
            const val = sessionStorage.getItem(key);
            if (val) utms[key] = val;
        },
    );
    return utms;
};

export default function BookingModal({
    isOpen,
    onClose,
    service: initialService,
    actionType,
    allServices = [],
}) {
    const [localSelectedService, setLocalSelectedService] = useState(null);
    const [formData, setFormData] = useState({ privacy: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setLocalSelectedService(initialService);
            setFormData({ privacy: false });
            setOccupiedSlots([]);
        }
    }, [isOpen, initialService]);

    useEffect(() => {
        if (localSelectedService) {
            setFormData((prev) => ({
                privacy: prev.privacy || false,
                name: prev.name || "",
                email: prev.email || "",
                phone: prev.phone || "",
                city: prev.city || "",
                zip: prev.zip || "",
                company: prev.company || "",
                address: prev.address || "",
            }));
        }
    }, [localSelectedService]);

    useEffect(() => {
        if (formData.date && actionType === "appointment") {
            fetch(`/api/appointments/occupied?date=${formData.date}`)
                .then((res) => res.json())
                .then((data) => setOccupiedSlots(data))
                .catch((err) =>
                    console.error("Error fetching occupied slots:", err),
                );
        }
    }, [formData.date, actionType]);

    if (!isOpen) return null;

    const currentService = localSelectedService;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            // Reset subfields when parent fields change to prevent "stuck" fields
            if (name === "cleaning_type") {
                delete newData.move_type;
                delete newData.service_mode;
                delete newData.frequency;
                delete newData.frequency_custom;
                delete newData.rental_frequency;
                delete newData.rental_custom_details;
                delete newData.is_empty;
                delete newData.empty_property_details;
                delete newData.dirt_level;
                delete newData.extra_services;
                delete newData.confirm_0;
                delete newData.confirm_1;
                delete newData.confirm_2;
            }

            if (name === "service_mode") {
                delete newData.frequency;
                delete newData.frequency_custom;
            }

            if (name === "move_type") {
                delete newData.dirt_level;
            }

            if (name === "is_empty") {
                delete newData.empty_property_details;
            }

            if (name === "has_pets") {
                delete newData.pet_type;
                delete newData.pet_type_custom;
                delete newData.pet_count;
                delete newData.pet_count_exact;
                delete newData.pet_details;
            }

            if (name === "pet_type") {
                delete newData.pet_type_custom;
            }

            if (name === "pet_count") {
                delete newData.pet_count_exact;
            }

            if (name === "access_method") {
                delete newData.access_method_custom;
            }

            if (name === "business_type") {
                delete newData.business_type_custom;
            }

            if (name === "sqft_range") {
                delete newData.sqft_range_custom;
            }

            if (name === "project_category") {
                // Post-construction category Change
                delete newData.work_type;
                delete newData.cleaning_type;
                delete newData.current_stage;
                delete newData.residue_level;
                delete newData.sqft_range;
                delete newData.extra_services;
                delete newData.confirm_0;
                delete newData.confirm_1;
                delete newData.confirm_2;
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const rest =
            actionType === "appointment" ? appointmentsRest : messagesRest;

        const result = await rest.save({
            ...formData,
            ...getStoredUTMs(),
            service_id: currentService?.id,
            subject:
                actionType === "appointment"
                    ? "New Appointment Request"
                    : `Estimate Request: ${currentService?.title}`,
        });

        setIsSubmitting(false);
        if (result) {
            Swal.fire({
                icon: "success",
                title: t("public.modal.success_title", "¡Enviado!"),
                text: t(
                    "public.modal.success_msg",
                    "Nos pondremos en contacto pronto.",
                ),
                customClass: { popup: "rounded-[2rem]" },
            });
            onClose();
            setFormData({ privacy: false });
        }
    };

    const renderFormFields = () => {
        if (actionType === "appointment") {
            const timeOptions = [
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
            ].map((time) => ({
                label: time,
                value: time,
                disabled: occupiedSlots.includes(time),
            }));

            if (currentService?.form_type === "commercial") {
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Company Name"
                            name="company"
                            required
                            onChange={handleInputChange}
                            value={formData.company || ""}
                        />
                        <InputField
                            label="Contact Name"
                            name="name"
                            required
                            onChange={handleInputChange}
                            value={formData.name || ""}
                        />
                        <PhoneInput
                            onPhoneChange={(v) =>
                                setFormData((p) => ({ ...p, phone: v }))
                            }
                            value={formData.phone || ""}
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleInputChange}
                            value={formData.email || ""}
                        />
                        <InputField
                            label="Preferred Date"
                            name="date"
                            type="date"
                            required
                            onChange={handleInputChange}
                            value={formData.date || ""}
                        />
                        <SelectField
                            label="Preferred Time"
                            name="time"
                            options={timeOptions}
                            placeholder="Select available time"
                            required
                            onChange={handleInputChange}
                            value={formData.time || ""}
                        />
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                        label="Full Name"
                        name="name"
                        required
                        onChange={handleInputChange}
                        value={formData.name || ""}
                    />
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        onChange={handleInputChange}
                        value={formData.email || ""}
                    />
                    <PhoneInput
                        onPhoneChange={(v) =>
                            setFormData((p) => ({ ...p, phone: v }))
                        }
                        value={formData.phone || ""}
                    />
                    <InputField
                        label="City / Zip Code"
                        name="city_zip"
                        required
                        onChange={handleInputChange}
                        value={formData.city_zip || ""}
                    />
                    <InputField
                        label="Appointment Date"
                        name="date"
                        type="date"
                        required
                        onChange={handleInputChange}
                        value={formData.date || ""}
                    />
                    <SelectField
                        label="Appointment Time"
                        name="time"
                        options={timeOptions}
                        placeholder="Select available time"
                        required
                        onChange={handleInputChange}
                        value={formData.time || ""}
                    />
                    <div className="md:col-span-2">
                        <TextAreaField
                            label="Reason for Inquiry / Specific Needs"
                            name="description"
                            required
                            span="2"
                            onChange={handleInputChange}
                            value={formData.description || ""}
                        />
                    </div>
                </div>
            );
        }

        switch (currentService?.form_type) {
            case "residential":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Tipo de limpieza */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <Info size={16} /> Tipo de limpieza
                                (OBLIGATORIO)
                            </h3>
                            <SelectField
                                label="Seleccione el tipo de limpieza"
                                name="cleaning_type"
                                options={[
                                    {
                                        label: "Limpieza de mantenimiento",
                                        value: "maintenance",
                                    },
                                    {
                                        label: "Limpieza profunda",
                                        value: "deep",
                                    },
                                    {
                                        label: "Limpieza de mudanza",
                                        value: "move_in_out",
                                    },
                                    {
                                        label: "Limpieza para alquileres temporales",
                                        value: "rental",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.cleaning_type || ""}
                                span="2"
                            />

                            {/* Tipo de mudanza (DINÁMICO) */}
                            {formData.cleaning_type === "move_in_out" && (
                                <SelectField
                                    label="Tipo de mudanza"
                                    name="move_type"
                                    options={[
                                        { label: "Entrada", value: "entry" },
                                        { label: "Salida", value: "exit" },
                                    ]}
                                    required
                                    onChange={handleInputChange}
                                    value={formData.move_type || ""}
                                    span="2"
                                />
                            )}

                            {/* Modalidad del servicio (DINÁMICO) */}
                            {formData.cleaning_type === "maintenance" && (
                                <SelectField
                                    label="Modalidad del servicio"
                                    name="service_mode"
                                    options={[
                                        {
                                            label: "Servicio único",
                                            value: "one_time",
                                        },
                                        {
                                            label: "Servicio recurrente",
                                            value: "recurring",
                                        },
                                    ]}
                                    required
                                    onChange={handleInputChange}
                                    value={formData.service_mode || ""}
                                    span="2"
                                />
                            )}

                            {/* Frecuencia del servicio (DINÁMICO) */}
                            {formData.service_mode === "recurring" && (
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SelectField
                                        label="Frecuencia del servicio"
                                        name="frequency"
                                        options={[
                                            {
                                                label: "Semanal",
                                                value: "weekly",
                                            },
                                            {
                                                label: "Quincenal",
                                                value: "biweekly",
                                            },
                                            {
                                                label: "Mensual",
                                                value: "monthly",
                                            },
                                            {
                                                label: "Varias veces por semana",
                                                value: "several_times",
                                            },
                                            {
                                                label: "Personalizado",
                                                value: "custom",
                                            },
                                        ]}
                                        required
                                        onChange={handleInputChange}
                                        value={formData.frequency || ""}
                                        span="2"
                                    />
                                    {formData.frequency === "custom" && (
                                        <InputField
                                            label="Indique la frecuencia"
                                            name="frequency_custom"
                                            required
                                            onChange={handleInputChange}
                                            value={
                                                formData.frequency_custom || ""
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Alquileres temporales (DINÁMICO) */}
                            {formData.cleaning_type === "rental" && (
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SelectField
                                        label="¿Cuántos servicios al mes necesita?"
                                        name="rental_frequency"
                                        options={[
                                            {
                                                label: "1 a 3 servicios",
                                                value: "1-3",
                                            },
                                            {
                                                label: "4 a 8 servicios",
                                                value: "4-8",
                                            },
                                            {
                                                label: "9 o más servicios",
                                                value: "9+",
                                            },
                                            {
                                                label: "Personalizado",
                                                value: "custom",
                                            },
                                        ]}
                                        required
                                        onChange={handleInputChange}
                                        value={formData.rental_frequency || ""}
                                        span="2"
                                    />
                                    {formData.rental_frequency === "custom" && (
                                        <InputField
                                            label="Indique detalles si aplica"
                                            name="rental_custom_details"
                                            onChange={handleInputChange}
                                            value={
                                                formData.rental_custom_details ||
                                                ""
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Condición de la propiedad (DINÁMICO) */}
                            {formData.cleaning_type === "move_in_out" && (
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SelectField
                                        label="¿La propiedad está completamente vacía?"
                                        name="is_empty"
                                        options={[
                                            { label: "Sí", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                        required
                                        onChange={handleInputChange}
                                        value={formData.is_empty || ""}
                                        span="2"
                                    />
                                    {formData.is_empty === "no" && (
                                        <TextAreaField
                                            label="Indique los elementos presentes o áreas ocupadas para una mejor planificación del servicio"
                                            name="empty_property_details"
                                            required
                                            onChange={handleInputChange}
                                            value={
                                                formData.empty_property_details ||
                                                ""
                                            }
                                            span="2"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Nivel de suciedad (DINÁMICO) */}
                            {(formData.cleaning_type === "deep" ||
                                formData.move_type === "exit") && (
                                <SelectField
                                    label="Nivel de suciedad"
                                    name="dirt_level"
                                    options={[
                                        { label: "Bajo", value: "low" },
                                        { label: "Medio", value: "medium" },
                                        { label: "Alto", value: "high" },
                                    ]}
                                    required
                                    onChange={handleInputChange}
                                    value={formData.dirt_level || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Información del cliente & Ubicación */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <User size={16} /> Información del cliente &
                                Ubicación
                            </h3>
                            <InputField
                                label="Nombre completo"
                                name="name"
                                required
                                onChange={handleInputChange}
                                value={formData.name || ""}
                            />
                            <InputField
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                required
                                onChange={handleInputChange}
                                value={formData.email || ""}
                            />
                            <PhoneInput
                                onPhoneChange={(v) =>
                                    setFormData((p) => ({ ...p, phone: v }))
                                }
                                value={formData.phone || ""}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Ciudad"
                                    name="city"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.city || ""}
                                />
                                <InputField
                                    label="Código postal"
                                    name="zip"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.zip || ""}
                                />
                            </div>
                        </div>

                        {/* Detalles de la propiedad (OBLIGATORIO) */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                            <h3 className="col-span-3 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                                <HomeIcon size={16} /> Detalles de la propiedad
                                (OBLIGATORIO)
                            </h3>
                            <SelectField
                                label="Tipo de propiedad"
                                name="property_type"
                                options={[
                                    { label: "Casa", value: "house" },
                                    {
                                        label: "Departamento",
                                        value: "apartment",
                                    },
                                    { label: "Condominio", value: "condo" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.property_type || ""}
                                span="3"
                            />
                            <InputField
                                label="Habitaciones"
                                name="rooms"
                                type="number"
                                required
                                onChange={handleInputChange}
                                value={formData.rooms || ""}
                            />
                            <InputField
                                label="Baños"
                                name="bathrooms"
                                type="number"
                                step="0.5"
                                required
                                onChange={handleInputChange}
                                value={formData.bathrooms || ""}
                            />
                            <InputField
                                label="Pisos"
                                name="floors"
                                type="number"
                                required
                                onChange={handleInputChange}
                                value={formData.floors || ""}
                            />
                        </div>

                        {/* Mascotas (DINÁMICO) */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <PawPrint size={16} /> Mascotas (DINÁMICO)
                            </h3>
                            <SelectField
                                label="¿Tiene mascotas?"
                                name="has_pets"
                                options={[
                                    { label: "Sí", value: "yes" },
                                    { label: "No", value: "no" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.has_pets || ""}
                                span="2"
                            />
                            {formData.has_pets === "yes" && (
                                <>
                                    <SelectField
                                        label="Tipo de mascota"
                                        name="pet_type"
                                        options={[
                                            { label: "Perro", value: "dog" },
                                            { label: "Gato", value: "cat" },
                                            { label: "Otro", value: "other" },
                                        ]}
                                        required
                                        onChange={handleInputChange}
                                        value={formData.pet_type || ""}
                                        span="2"
                                    />
                                    {formData.pet_type === "other" && (
                                        <InputField
                                            label="Indique cuál"
                                            name="pet_type_custom"
                                            required
                                            onChange={handleInputChange}
                                            value={
                                                formData.pet_type_custom || ""
                                            }
                                        />
                                    )}

                                    <SelectField
                                        label="Cantidad"
                                        name="pet_count"
                                        options={[
                                            { label: "1", value: "1" },
                                            { label: "2", value: "2" },
                                            { label: "3", value: "3" },
                                            { label: "4", value: "4" },
                                            { label: "5 o más", value: "5+" },
                                        ]}
                                        required
                                        onChange={handleInputChange}
                                        value={formData.pet_count || ""}
                                        span="2"
                                    />
                                    {formData.pet_count === "5+" && (
                                        <InputField
                                            label="Indique la cantidad exacta"
                                            name="pet_count_exact"
                                            required
                                            onChange={handleInputChange}
                                            value={
                                                formData.pet_count_exact || ""
                                            }
                                        />
                                    )}

                                    <TextAreaField
                                        label="Áreas especiales (OPCIONAL)"
                                        name="pet_details"
                                        placeholder="Indique si hay acumulación de pelo, suciedad, olores..."
                                        onChange={handleInputChange}
                                        span="2"
                                        value={formData.pet_details || ""}
                                    />
                                </>
                            )}
                        </div>

                        {/* Servicios adicionales (OPCIONAL) */}
                        <div className="col-span-2 mt-4">
                            <CheckboxGroup
                                label="Servicios adicionales (OPCIONAL)"
                                name="extra_services"
                                options={[
                                    "Limpieza interior de horno",
                                    "Limpieza interior de refrigerador",
                                    "Limpieza interior de gabinetes",
                                    "Limpieza de ventanas interiores",
                                    "Limpieza de garaje",
                                ]}
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>

                        {/* Fecha y hora & Acceso */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <CalendarIcon size={16} /> Fecha y hora & Acceso
                            </h3>
                            <InputField
                                label="Fecha de inicio"
                                name="date"
                                type="date"
                                required
                                onChange={handleInputChange}
                                value={formData.date || ""}
                            />
                            <InputField
                                label="Hora de inicio"
                                name="time"
                                type="time"
                                required
                                onChange={handleInputChange}
                                value={formData.time || ""}
                            />
                            <SelectField
                                label="Acceso al inmueble (OPCIONAL)"
                                name="access_method"
                                options={[
                                    {
                                        label: "Cliente presente",
                                        value: "present",
                                    },
                                    { label: "Llave / código", value: "key" },
                                    {
                                        label: "Portero / recepción",
                                        value: "reception",
                                    },
                                    {
                                        label: "Instrucciones",
                                        value: "custom",
                                    },
                                ]}
                                onChange={handleInputChange}
                                span="2"
                                value={formData.access_method || ""}
                            />
                            {formData.access_method === "custom" && (
                                <InputField
                                    label="Indique detalles de acceso"
                                    name="access_method_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.access_method_custom || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Detalles adicionales (OPCIONAL) */}
                        <div className="col-span-2 mt-4">
                            <TextAreaField
                                label="Detalles adicionales (OPCIONAL)"
                                name="description"
                                span="2"
                                placeholder="Indique cualquier detalle adicional relevante..."
                                onChange={handleInputChange}
                                value={formData.description || ""}
                            />
                        </div>

                        {/* Confirmación del cliente (OBLIGATORIO) */}
                        <ConfirmationSection
                            type="residential"
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                );
            case "commercial":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Tipo de negocio */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <Briefcase size={16} /> Tipo de negocio
                            </h3>
                            <SelectField
                                label="Seleccione el tipo de negocio"
                                name="business_type"
                                options={[
                                    { label: "Oficina", value: "office" },
                                    {
                                        label: "Local comercial",
                                        value: "commercial",
                                    },
                                    {
                                        label: "Clínica / consultorio",
                                        value: "clinic",
                                    },
                                    {
                                        label: "Restaurante",
                                        value: "restaurant",
                                    },
                                    {
                                        label: "Edificio / condominio",
                                        value: "building",
                                    },
                                    { label: "Otro", value: "other" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.business_type || ""}
                                span="2"
                            />
                            {formData.business_type === "other" && (
                                <InputField
                                    label="Indique el tipo de negocio"
                                    name="business_type_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.business_type_custom || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Información de contacto & Ubicación */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <User size={16} /> Información de contacto &
                                Ubicación
                            </h3>
                            <InputField
                                label="Nombre de la empresa"
                                name="company"
                                required
                                onChange={handleInputChange}
                                value={formData.company || ""}
                            />
                            <InputField
                                label="Nombre del responsable"
                                name="name"
                                required
                                onChange={handleInputChange}
                                value={formData.name || ""}
                            />
                            <InputField
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                required
                                onChange={handleInputChange}
                                value={formData.email || ""}
                            />
                            <PhoneInput
                                onPhoneChange={(v) =>
                                    setFormData((p) => ({ ...p, phone: v }))
                                }
                                value={formData.phone || ""}
                            />
                            <InputField
                                label="Dirección del servicio"
                                name="address"
                                required
                                onChange={handleInputChange}
                                span="2"
                                value={formData.address || ""}
                            />
                            <InputField
                                label="Ciudad"
                                name="city"
                                required
                                onChange={handleInputChange}
                                value={formData.city || ""}
                            />
                            <InputField
                                label="Código postal"
                                name="zip"
                                required
                                onChange={handleInputChange}
                                value={formData.zip || ""}
                            />
                        </div>

                        {/* Tamaño del establecimiento */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <MapPin size={16} /> Tamaño del establecimiento
                            </h3>
                            <SelectField
                                label="Tamaño aproximado (sqft)"
                                name="sqft_range"
                                options={[
                                    {
                                        label: "Menos de 1,000 sqft",
                                        value: "<1000",
                                    },
                                    {
                                        label: "1,000 – 3,000 sqft",
                                        value: "1000-3000",
                                    },
                                    {
                                        label: "3,000 – 5,000 sqft",
                                        value: "3000-5000",
                                    },
                                    {
                                        label: "5,000 – 10,000 sqft",
                                        value: "5000-10000",
                                    },
                                    {
                                        label: "Más de 10,000 sqft",
                                        value: ">10000",
                                    },
                                    {
                                        label: "No estoy seguro",
                                        value: "not_sure",
                                    },
                                    { label: "Personalizado", value: "custom" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.sqft_range || ""}
                                span="2"
                            />
                            {formData.sqft_range === "custom" && (
                                <InputField
                                    label="Indique el tamaño aproximado"
                                    name="sqft_range_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.sqft_range_custom || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Modalidad & Periodicidad */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock size={16} /> Modalidad & Periodicidad
                            </h3>
                            <SelectField
                                label="Modalidad del servicio"
                                name="service_mode"
                                options={[
                                    {
                                        label: "Servicio único",
                                        value: "one_time",
                                    },
                                    {
                                        label: "Servicio recurrente programado",
                                        value: "recurring",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.service_mode || ""}
                                span="2"
                            />

                            {formData.service_mode === "recurring" && (
                                <SelectField
                                    label="Periodicidad del servicio"
                                    name="frequency"
                                    options={[
                                        { label: "Diario", value: "daily" },
                                        {
                                            label: "Varias veces por semana",
                                            value: "several_times",
                                        },
                                        { label: "Semanal", value: "weekly" },
                                        { label: "Mensual", value: "monthly" },
                                        {
                                            label: "Personalizado",
                                            value: "custom",
                                        },
                                    ]}
                                    required
                                    onChange={handleInputChange}
                                    value={formData.frequency || ""}
                                    span="2"
                                />
                            )}

                            {formData.frequency === "custom" && (
                                <InputField
                                    label="Indique la periodicidad"
                                    name="frequency_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.frequency_custom || ""}
                                />
                            )}
                        </div>

                        {/* Estado actual del espacio */}
                        <div className="col-span-2 mt-4">
                            <SelectField
                                label="Estado actual del espacio"
                                name="current_status"
                                options={[
                                    {
                                        label: "Mantenimiento regular",
                                        value: "regular",
                                    },
                                    {
                                        label: "Requiere limpieza inicial detallada",
                                        value: "initial_deep",
                                    },
                                    {
                                        label: "Requiere atención especializada",
                                        value: "specialized",
                                    },
                                ]}
                                onChange={handleInputChange}
                                span="2"
                                value={formData.current_status || ""}
                            />
                        </div>

                        {/* Servicios adicionales (OPCIONAL) */}
                        <div className="col-span-2 mt-4">
                            <CheckboxGroup
                                label="Servicios adicionales (OPCIONAL)"
                                name="extra_services"
                                options={[
                                    "Limpieza de alfombras",
                                    "Pulido de pisos",
                                    "Desinfección profesional",
                                    "No requiero servicios adicionales",
                                ]}
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>

                        {/* Fecha y hora & Condiciones de acceso */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <CalendarIcon size={16} /> Fecha y hora &
                                Condiciones de acceso
                            </h3>
                            <InputField
                                label="Fecha de inicio"
                                name="date"
                                type="date"
                                required
                                onChange={handleInputChange}
                                value={formData.date || ""}
                            />
                            <InputField
                                label="Hora de inicio"
                                name="time"
                                type="time"
                                required
                                onChange={handleInputChange}
                                value={formData.time || ""}
                            />
                            <SelectField
                                label="Condiciones de acceso"
                                name="access_method"
                                options={[
                                    { label: "Acceso libre", value: "free" },
                                    { label: "Llave / código", value: "key" },
                                    {
                                        label: "Acceso con supervisor",
                                        value: "supervisor",
                                    },
                                    {
                                        label: "Horario restringido",
                                        value: "restricted",
                                    },
                                    { label: "Personalizado", value: "custom" },
                                ]}
                                onChange={handleInputChange}
                                span="2"
                                value={formData.access_method || ""}
                            />
                            {formData.access_method === "custom" && (
                                <InputField
                                    label="Indique detalles de acceso"
                                    name="access_method_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.access_method_custom || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Detalles adicionales */}
                        <div className="col-span-2 mt-4">
                            <TextAreaField
                                label="Detalles adicionales (OPCIONAL)"
                                name="description"
                                span="2"
                                placeholder="Indique cualquier detalle adicional relevante..."
                                onChange={handleInputChange}
                                value={formData.description || ""}
                            />
                        </div>

                        {/* Confirmación del cliente */}
                        <ConfirmationSection
                            type="commercial"
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                );
            case "post_construction":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Tipo de proyecto & Tipo de obra */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <HardHat size={16} /> Tipo de proyecto & Tipo de
                                obra
                            </h3>
                            <SelectField
                                label="Tipo de proyecto"
                                name="project_category"
                                options={[
                                    {
                                        label: "Residencial",
                                        value: "residential",
                                    },
                                    { label: "Comercial", value: "commercial" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.project_category || ""}
                                span="2"
                            />
                            <SelectField
                                label="Tipo de obra"
                                name="work_type"
                                options={[
                                    {
                                        label: "Construcción nueva",
                                        value: "new",
                                    },
                                    { label: "Remodelación", value: "remodel" },
                                    {
                                        label: "Renovación parcial",
                                        value: "partial",
                                    },
                                    {
                                        label: "Proyecto finalizado que requiere limpieza",
                                        value: "finished",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.work_type || ""}
                                span="2"
                            />
                            {/* Tipo de limpieza requerida */}
                            <SelectField
                                label="Tipo de limpieza requerida"
                                name="cleaning_type"
                                options={[
                                    {
                                        label: "Limpieza inicial",
                                        value: "initial",
                                    },
                                    {
                                        label: "Limpieza intermedia",
                                        value: "intermediate",
                                    },
                                    { label: "Limpieza final", value: "final" },
                                    {
                                        label: "Limpieza de detalle",
                                        value: "detail",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.cleaning_type || ""}
                                span="2"
                            />
                            {/* Etapa actual del proyecto */}
                            <SelectField
                                label="Etapa actual del proyecto"
                                name="current_stage"
                                options={[
                                    {
                                        label: "Obra en proceso",
                                        value: "in_progress",
                                    },
                                    {
                                        label: "Etapa avanzada",
                                        value: "advanced",
                                    },
                                    {
                                        label: "Listo para limpieza final",
                                        value: "ready_final",
                                    },
                                    {
                                        label: "Terminado y próximo a entrega",
                                        value: "finished_delivery",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.current_stage || ""}
                                span="2"
                            />
                            {/* Nivel de residuos */}
                            <SelectField
                                label="Nivel de residuos"
                                name="residue_level"
                                options={[
                                    { label: "Ligero", value: "light" },
                                    { label: "Medio", value: "medium" },
                                    { label: "Alto", value: "high" },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.residue_level || ""}
                                span="2"
                            />
                            {/* Tamaño del proyecto */}
                            <SelectField
                                label="Tamaño aproximado (sqft)"
                                name="sqft_range"
                                options={[
                                    {
                                        label: "Menos de 1,000 sqft",
                                        value: "<1000",
                                    },
                                    {
                                        label: "1,000 – 3,000 sqft",
                                        value: "1000-3000",
                                    },
                                    {
                                        label: "3,000 – 5,000 sqft",
                                        value: "3000-5000",
                                    },
                                    {
                                        label: "5,000 – 10,000 sqft",
                                        value: "5000-10000",
                                    },
                                    {
                                        label: "Más de 10,000 sqft",
                                        value: ">10000",
                                    },
                                    {
                                        label: "No estoy seguro",
                                        value: "not_sure",
                                    },
                                ]}
                                required
                                onChange={handleInputChange}
                                value={formData.sqft_range || ""}
                                span="2"
                            />
                        </div>

                        {/* Información de contacto & Ubicación */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <User size={16} /> Información de contacto &
                                Ubicación
                            </h3>
                            <InputField
                                label="Nombre de empresa / contratista"
                                name="company"
                                required
                                onChange={handleInputChange}
                                value={formData.company || ""}
                            />
                            <InputField
                                label="Nombre del responsable"
                                name="name"
                                required
                                onChange={handleInputChange}
                                value={formData.name || ""}
                            />
                            <InputField
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                required
                                onChange={handleInputChange}
                                value={formData.email || ""}
                            />
                            <PhoneInput
                                onPhoneChange={(v) =>
                                    setFormData((p) => ({ ...p, phone: v }))
                                }
                                value={formData.phone || ""}
                            />
                            <InputField
                                label="Dirección del proyecto"
                                name="address"
                                required
                                onChange={handleInputChange}
                                span="2"
                                value={formData.address || ""}
                            />
                            <InputField
                                label="Ciudad"
                                name="city"
                                required
                                onChange={handleInputChange}
                                value={formData.city || ""}
                            />
                            <InputField
                                label="Código postal"
                                name="zip"
                                required
                                onChange={handleInputChange}
                                value={formData.zip || ""}
                            />
                        </div>

                        {/* Fecha y hora & Acceso al sitio */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <h3 className="col-span-2 text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <CalendarIcon size={16} /> Fecha y hora & Acceso
                                al sitio
                            </h3>
                            <InputField
                                label="Fecha requerida"
                                name="date"
                                type="date"
                                required
                                onChange={handleInputChange}
                                value={formData.date || ""}
                            />
                            <InputField
                                label="Hora de inicio"
                                name="time"
                                type="time"
                                required
                                onChange={handleInputChange}
                                value={formData.time || ""}
                            />
                            <SelectField
                                label="Condiciones de acceso"
                                name="access_method"
                                options={[
                                    { label: "Acceso libre", value: "free" },
                                    { label: "Llave / código", value: "key" },
                                    {
                                        label: "Acceso con supervisor",
                                        value: "supervisor",
                                    },
                                    {
                                        label: "Horario restringido",
                                        value: "restricted",
                                    },
                                    { label: "Personalizado", value: "custom" },
                                ]}
                                onChange={handleInputChange}
                                span="2"
                                value={formData.access_method || ""}
                            />
                            {formData.access_method === "custom" && (
                                <InputField
                                    label="Indique detalles de acceso"
                                    name="access_method_custom"
                                    required
                                    onChange={handleInputChange}
                                    value={formData.access_method_custom || ""}
                                    span="2"
                                />
                            )}
                        </div>

                        {/* Franja operativa del proyecto */}
                        <div className="col-span-2 mt-4">
                            <SelectField
                                label="Franja operativa del proyecto (OPCIONAL)"
                                name="operational_window"
                                options={[
                                    { label: "Mañana", value: "morning" },
                                    { label: "Tarde", value: "afternoon" },
                                    { label: "Noche", value: "night" },
                                    { label: "Madrugada", value: "dawn" },
                                    { label: "Flexible", value: "flexible" },
                                ]}
                                onChange={handleInputChange}
                                span="2"
                                value={formData.operational_window || ""}
                            />
                        </div>

                        {/* Detalles adicionales del proyecto */}
                        <div className="col-span-2 mt-4">
                            <TextAreaField
                                label="Detalles adicionales (OPCIONAL)"
                                name="description"
                                span="2"
                                placeholder="Indique cualquier detalle relevante sobre el proyecto..."
                                onChange={handleInputChange}
                                value={formData.description || ""}
                            />
                        </div>

                        {/* Confirmación del cliente */}
                        <ConfirmationSection
                            type="post_construction"
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderServiceSelector = () => {
        const filteredServices = allServices.filter((srv) => {
            if (
                actionType === "appointment" &&
                srv.form_type === "post_construction"
            )
                return false;
            return true;
        });

        return (
            <div className="flex flex-wrap justify-center gap-6">
                {filteredServices.map((srv) => (
                    <button
                        key={srv.id}
                        onClick={() => setLocalSelectedService(srv)}
                        className="group relative flex flex-col items-center p-0 bg-white border border-gray-100 rounded-[2rem]  transition-all text-center overflow-hidden h-full shadow-sm w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[350px]"
                    >
                        {/* Service Image Container */}
                        <div className="relative w-full h-48 overflow-hidden">
                            <img
                                src={`/api/service/media/${srv.image}`}
                                alt={srv.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        {/* Content Container */}
                        <div className="p-6 flex flex-col items-center flex-1 w-full">
                            <h4 className="text-xl font-black text-primary mb-3 font-kanit">
                                {srv.title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-6 font-medium">
                                {srv.description}
                            </p>

                            <div className="mt-auto px-6 py-3 bg-secondary group-hover:bg-primary group-hover:text-white rounded-full text-primary text-[10px] font-black uppercase tracking-widest transition-color duration-200 flex items-center gap-2">
                                Select Service{" "}
                                <ArrowRight size={12} strokeWidth={3} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <FlagIconsCDN />
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative w-full ${!currentService ? "max-w-5xl" : "max-w-6xl"} bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch max-h-[90vh] ${currentService ? "min-h-[600px]" : ""} transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 bg-gray-100/50 hover:bg-gray-200 rounded-full transition-colors text-gray-800"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Dynamic Content */}
                <div
                    className={`${!currentService ? "w-full" : "w-full md:w-3/5"} p-8 md:p-12 overflow-y-auto custom-scrollbar`}
                >
                    <div className="mb-8">
                        {!currentService && (
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-primary text-white text-[10px] font-black tracking-widest uppercase rounded-full">
                                    Paso 01
                                </div>
                                <div className="h-px w-10 bg-gray-100"></div>
                            </div>
                        )}
                        <h2 className="text-[32px] font-bold leading-tight text-primary mb-2">
                            {!currentService
                                ? "Selecciona un Servicio"
                                : actionType === "appointment"
                                  ? "Programar una Cita"
                                  : "Solicitar Evaluación"}
                        </h2>
                        <p className="text-gray-500 font-light italic">
                            {!currentService
                                ? "Elige el servicio de limpieza que te interesa para continuar."
                                : actionType === "estimate"
                                  ? "Completa el formulario a continuación y te responderemos con una propuesta personalizada."
                                  : "Elige una fecha y hora para que nuestro equipo visite tu propiedad."}
                        </p>
                    </div>

                    {!currentService ? (
                        renderServiceSelector()
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {renderFormFields()}

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-colors">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                    required
                                    checked={formData.privacy}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            privacy: e.target.checked,
                                        }))
                                    }
                                />
                                <label
                                    htmlFor="privacy"
                                    className="text-xs text-gray-500 leading-tight cursor-pointer font-medium"
                                >
                                    He leído y acepto la{" "}
                                    <a
                                        href="#"
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Política de Privacidad
                                    </a>{" "}
                                    y autorizo el tratamiento de mis datos para
                                    fines de comunicación.
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {allServices.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLocalSelectedService(null)
                                        }
                                        className="sm:w-1/3 border-2 border-primary/5 text-primary py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-sm"
                                    >
                                        Volver
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.privacy}
                                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(28,36,66,0.15)] hover:shadow-[0_15px_35px_rgba(28,36,66,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {isSubmitting
                                        ? "Enviando..."
                                        : currentService?.form_type ===
                                            "residential"
                                          ? "Solicitar evaluación profesional"
                                          : currentService?.form_type ===
                                              "commercial"
                                            ? "Solicitar propuesta corporativa"
                                            : currentService?.form_type ===
                                                "post_construction"
                                              ? "Solicitar propuesta post-construcción"
                                              : actionType === "estimate"
                                                ? "Enviar Solicitud"
                                                : "Confirmar Cita"}
                                    {!isSubmitting && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Side: Image */}
                {currentService && (
                    <div className="hidden md:block w-2/5 relative min-h-full animate-in fade-in slide-in-from-right-10 duration-700 overflow-hidden">
                        <img
                            key={currentService?.id}
                            src={`/api/service/media/${currentService?.image}`}
                            alt={currentService?.title}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                        />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] z-10" />
                        <div className="absolute bottom-10 left-10 right-10 z-20">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem]">
                                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2 font-kanit">
                                    Selected Service
                                </p>
                                <h3 className="text-white text-2xl font-black font-kanit">
                                    {currentService?.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
