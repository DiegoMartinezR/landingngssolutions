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
    <div className={`relative group col-span-${span}`}>
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <input
                {...props}
                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all duration-300 text-sm font-semibold text-primary"
            />
        </div>
    </div>
);

const TextAreaField = ({ label, span = "1", ...props }) => (
    <div className={`relative group col-span-${span}`}>
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <textarea
                {...props}
                rows={4}
                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all duration-300 text-sm font-semibold text-primary resize-none"
            />
        </div>
    </div>
);

const SelectField = ({ label, options, span = "1", ...props }) => (
    <div className={`relative group col-span-${span}`}>
        <label className="block text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <select
                {...props}
                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none appearance-none transition-all duration-300 text-sm font-semibold text-primary"
            >
                <option value="">
                    {props.placeholder || "Select an option"}
                </option>
                {options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                    >
                        {opt.label} {opt.disabled ? "(Occupied)" : ""}
                    </option>
                ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary/30 group-focus-within:text-primary transition-colors">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

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
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const rest =
            actionType === "appointment" ? appointmentsRest : messagesRest;

        const result = await rest.save({
            ...formData,
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
                        />
                        <InputField
                            label="Contact Name"
                            name="name"
                            required
                            onChange={handleInputChange}
                        />
                        <PhoneInput
                            onPhoneChange={(v) =>
                                setFormData((p) => ({ ...p, phone: v }))
                            }
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Preferred Date"
                            name="date"
                            type="date"
                            required
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Preferred Time"
                            name="time"
                            options={timeOptions}
                            placeholder="Select available time"
                            required
                            onChange={handleInputChange}
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
                    />
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        onChange={handleInputChange}
                    />
                    <PhoneInput
                        onPhoneChange={(v) =>
                            setFormData((p) => ({ ...p, phone: v }))
                        }
                    />
                    <InputField
                        label="City / Zip Code"
                        name="city_zip"
                        required
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Appointment Date"
                        name="date"
                        type="date"
                        required
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="Appointment Time"
                        name="time"
                        options={timeOptions}
                        placeholder="Select available time"
                        required
                        onChange={handleInputChange}
                    />
                    <div className="md:col-span-2">
                        <TextAreaField
                            label="Reason for Inquiry / Specific Needs"
                            name="description"
                            required
                            span="2"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            );
        }

        switch (currentService?.form_type) {
            case "residential":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Full Name"
                            name="name"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleInputChange}
                        />
                        <PhoneInput
                            onPhoneChange={(v) =>
                                setFormData((p) => ({ ...p, phone: v }))
                            }
                        />
                        <InputField
                            label="Address"
                            name="address"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="City"
                            name="city"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Zip Code"
                            name="zip"
                            required
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Property Type"
                            name="property_type"
                            options={[
                                { label: "House", value: "house" },
                                { label: "Apartment", value: "apartment" },
                                { label: "Condo", value: "condo" },
                            ]}
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Approx. Sq Ft"
                            name="sqft"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Rooms"
                            name="rooms"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Bathrooms"
                            name="bathrooms"
                            type="number"
                            step="0.5"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Floors"
                            name="floors"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Cleaning Type"
                            name="cleaning_type"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Deep Clean", value: "deep" },
                                {
                                    label: "Move-In / Move-Out",
                                    value: "move_in_out",
                                },
                                { label: "Recurring", value: "recurring" },
                            ]}
                            required
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Frequency"
                            name="frequency"
                            options={[
                                { label: "One-time", value: "one_time" },
                                { label: "Weekly", value: "weekly" },
                                { label: "Bi-weekly", value: "bi_weekly" },
                                { label: "Monthly", value: "monthly" },
                            ]}
                            required
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Do you have pets?"
                            name="pets"
                            options={[
                                { label: "No", value: "no" },
                                { label: "Yes", value: "yes" },
                            ]}
                            onChange={handleInputChange}
                        />
                        <div className="md:col-span-2">
                            <TextAreaField
                                label="Additional Comments"
                                name="description"
                                span="2"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                );
            case "commercial":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Company Name"
                            name="company"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Contact Name"
                            name="name"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleInputChange}
                        />
                        <PhoneInput
                            onPhoneChange={(v) =>
                                setFormData((p) => ({ ...p, phone: v }))
                            }
                        />
                        <InputField
                            label="Business Address"
                            name="address"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="City"
                            name="city"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Type of Establishment"
                            name="business_type"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Approx. Sq Ft"
                            name="sqft"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Number of Floors"
                            name="floors"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Required Frequency"
                            name="frequency"
                            onChange={handleInputChange}
                        />

                        <div className="md:col-span-2 flex flex-col gap-4">
                            <InputField
                                label="Preferred Schedule"
                                name="preferred_time"
                                onChange={handleInputChange}
                            />
                            <TextAreaField
                                label="Additional Comments"
                                name="description"
                                span="2"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                );
            case "post_construction":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField
                            label="Residential or Commercial?"
                            name="construction_type"
                            options={[
                                { label: "Residential", value: "residential" },
                                { label: "Commercial", value: "commercial" },
                            ]}
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Name / Company"
                            name="name"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleInputChange}
                        />
                        <PhoneInput
                            onPhoneChange={(v) =>
                                setFormData((p) => ({ ...p, phone: v }))
                            }
                        />
                        <InputField
                            label="Project Address"
                            name="address"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="City"
                            name="city"
                            required
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Approx. Sq Ft"
                            name="sqft"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Number of Floors"
                            name="floors"
                            type="number"
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Type of Work"
                            name="work_type"
                            onChange={handleInputChange}
                        />
                        <SelectField
                            label="Residue Level"
                            name="residue_level"
                            options={[
                                { label: "Low", value: "low" },
                                { label: "Medium", value: "medium" },
                                { label: "High", value: "high" },
                            ]}
                            onChange={handleInputChange}
                        />

                        <div className="md:col-span-2 flex flex-col  gap-4">
                            <InputField
                                label="Estimated Date"
                                name="date"
                                type="date"
                                onChange={handleInputChange}
                            />
                            <TextAreaField
                                label="Additional Comments"
                                name="description"
                                span="2"
                                onChange={handleInputChange}
                            />
                        </div>
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
                                    Step 01
                                </div>
                                <div className="h-px w-10 bg-gray-100"></div>
                            </div>
                        )}
                        <h2 className="text-[32px] font-bold leading-tight text-primary mb-2">
                            {!currentService
                                ? "Select a Service"
                                : actionType === "appointment"
                                  ? "Schedule an Appointment"
                                  : "Request an Estimate"}
                        </h2>
                        <p className="text-gray-500 font-light italic">
                            {!currentService
                                ? "Choose the cleaning service you're interested in to proceed."
                                : actionType === "estimate"
                                  ? "Fill out the form below and we'll get back to you with a personalized quote."
                                  : "Pick a date and time for our team to visit your property."}
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
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Privacy Policy
                                    </a>{" "}
                                    and authorize the processing of my data for
                                    communication purposes.
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
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.privacy}
                                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(28,36,66,0.15)] hover:shadow-[0_15px_35px_rgba(28,36,66,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : actionType === "estimate"
                                          ? "Send Request"
                                          : "Confirm Appointment"}
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
