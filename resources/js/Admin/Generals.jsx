import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";
import InputFormGroup from "../components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../components/Adminto/form/SelectFormGroup";
import TinyMCEFormGroup from "../components/Adminto/form/TinyMCEFormGroup";
import { Cookies } from "sode-extend-react";
import Tippy from "@tippyjs/react";

const generalsRest = new GeneralsRest();

const Generals = ({ generals }) => {
    const location =
        generals.find((x) => x.correlative == "location")?.description ?? "0,0";

    const [formData, setFormData] = useState({
        phones: generals
            .find((x) => x.correlative == "phone_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        emails: generals
            .find((x) => x.correlative == "email_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        address:
            generals.find((x) => x.correlative == "address")?.description ?? "",
        openingHours:
            generals.find((x) => x.correlative == "opening_hours")
                ?.description ?? "",
        supportPhone:
            generals.find((x) => x.correlative == "support_phone")
                ?.description ?? "",
        supportEmail:
            generals.find((x) => x.correlative == "support_email")
                ?.description ?? "",
        privacyPolicy:
            generals.find((x) => x.correlative == "privacy_policy")
                ?.description ?? "",
        termsConditions:
            generals.find((x) => x.correlative == "terms_conditions")
                ?.description ?? "",
        exchangePolicy:
            generals.find((x) => x.correlative == "exchange_policy")
                ?.description ?? "",
        seoTitle:
            generals.find((x) => x.correlative == "seo_title")?.description ??
            "",
        seoDescription:
            generals.find((x) => x.correlative == "seo_description")
                ?.description ?? "",
        seoKeywords:
            generals.find((x) => x.correlative == "seo_keywords")
                ?.description ?? "",
        cookiesPolicy:
            generals.find((x) => x.correlative == "cookies_policy")
                ?.description ?? "",
        footerDescription:
            generals.find((x) => x.correlative == "footer_description")
                ?.description ?? "",
        location: {
            lat: Number(location.split(",").map((x) => x.trim())[0]),
            lng: Number(location.split(",").map((x) => x.trim())[1]),
        },
        API_KEY_TINYMCE:
            generals.find((x) => x.correlative == "API_KEY_TINYMCE")
                ?.description ?? "",
        email_template:
            generals.find((x) => x.correlative == "email_template")
                ?.description ?? "",
        email_corporative:
            generals.find((x) => x.correlative == "email_corporative")
                ?.description ?? "",
        whatsappAdvisors: (() => {
            const advisorData = generals.find(
                (x) => x.correlative == "whatsapp_advisors",
            )?.description;
            try {
                return advisorData ? JSON.parse(advisorData) : [];
            } catch (e) {
                return [];
            }
        })(),
        company_name:
            generals.find((x) => x.correlative == "company_name")
                ?.description ?? "",
        company_description:
            generals.find((x) => x.correlative == "company_description")
                ?.description ?? "",
        company_logo:
            generals.find((x) => x.correlative == "company_logo")
                ?.description ?? "",
        company_url:
            generals.find((x) => x.correlative == "company_url")?.description ??
            "",
        company_locality:
            generals.find((x) => x.correlative == "company_locality")
                ?.description ?? "",
        company_region:
            generals.find((x) => x.correlative == "company_region")
                ?.description ?? "",
        company_country:
            generals.find((x) => x.correlative == "company_country")
                ?.description ?? "PE",
        twitter_site:
            generals.find((x) => x.correlative == "twitter_site")
                ?.description ?? "",
        facebook_page:
            generals.find((x) => x.correlative == "facebook_page")
                ?.description ?? "",
        instagram_profile:
            generals.find((x) => x.correlative == "instagram_profile")
                ?.description ?? "",
        linkedin_profile:
            generals.find((x) => x.correlative == "linkedin_profile")
                ?.description ?? "",
        google_site_verification:
            generals.find((x) => x.correlative == "google_site_verification")
                ?.description ?? "",
        bing_site_verification:
            generals.find((x) => x.correlative == "bing_site_verification")
                ?.description ?? "",
        og_image_default:
            generals.find((x) => x.correlative == "og_image_default")
                ?.description ?? "",
        company_address:
            generals.find((x) => x.correlative == "company_address")
                ?.description ?? "",
        company_phone:
            generals.find((x) => x.correlative == "company_phone")
                ?.description ?? "",
        company_email:
            generals.find((x) => x.correlative == "company_email")
                ?.description ?? "",
        facebook_pixel:
            generals.find((x) => x.correlative == "facebook_pixel")
                ?.description ?? "",
        google_tag_manager:
            generals.find((x) => x.correlative == "google_tag_manager")
                ?.description ?? "",
        google_analytics:
            generals.find((x) => x.correlative == "google_analytics")
                ?.description ?? "",
        tiktok_pixel:
            generals.find((x) => x.correlative == "tiktok_pixel")
                ?.description ?? "",
        head_scripts:
            generals.find((x) => x.correlative == "head_scripts")
                ?.description ?? "",
        body_scripts:
            generals.find((x) => x.correlative == "body_scripts")
                ?.description ?? "",
        atalaya_apikey:
            generals.find((x) => x.correlative == "atalaya_apikey")
                ?.description ?? "",
    });

    const [activeTab, setActiveTab] = useState("policies");

    const handleInputChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleAddField = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: [...prevState[field], ""],
        }));
    };

    const handleRemoveField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleMapClick = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await generalsRest.save([
                {
                    correlative: "phone_contact",
                    name: "Contact Phone",
                    description: formData.phones.join(","),
                },
                {
                    correlative: "email_contact",
                    name: "Contact Email",
                    description: formData.emails.join(","),
                },
                {
                    correlative: "address",
                    name: "Address",
                    description: formData.address,
                },
                {
                    correlative: "opening_hours",
                    name: "Opening Hours",
                    description: formData.openingHours,
                },
                {
                    correlative: "support_phone",
                    name: "Support Phone",
                    description: formData.supportPhone,
                },
                {
                    correlative: "support_email",
                    name: "Support Email",
                    description: formData.supportEmail,
                },
                {
                    correlative: "privacy_policy",
                    name: "Privacy Policy",
                    description: formData.privacyPolicy,
                },
                {
                    correlative: "terms_conditions",
                    name: "Terms and Conditions / Terms of Service",
                    description: formData.termsConditions,
                },
                {
                    correlative: "exchange_policy",
                    name: "Return & Shipping Policy",
                    description: formData.exchangePolicy,
                },
                {
                    correlative: "seo_title",
                    name: "SEO Title",
                    description: formData.seoTitle,
                },
                {
                    correlative: "seo_description",
                    name: "SEO Description",
                    description: formData.seoDescription,
                },
                {
                    correlative: "seo_keywords",
                    name: "SEO Keywords",
                    description: formData.seoKeywords,
                },
                {
                    correlative: "cookies_policy",
                    name: "Cookies Policy",
                    description: formData.cookiesPolicy,
                },
                {
                    correlative: "footer_description",
                    name: "Company Description (Footer)",
                    description: formData.footerDescription,
                },
                {
                    correlative: "location",
                    name: "Location",
                    description: `${formData.location.lat},${formData.location.lng}`,
                },
                {
                    correlative: "API_KEY_TINYMCE",
                    name: "TinyMCE API Key",
                    description: formData.API_KEY_TINYMCE,
                },
                {
                    correlative: "email_template",
                    name: "Booking Email Template",
                    description: formData.email_template,
                },
                {
                    correlative: "email_corporative",
                    name: "Corporative Email (Notification Copy)",
                    description: formData.email_corporative ?? "",
                },
                {
                    correlative: "whatsapp_advisors",
                    name: "Asesores de WhatsApp",
                    description: JSON.stringify(formData.whatsappAdvisors),
                },
                {
                    correlative: "company_name",
                    name: "Nombre de la Empresa",
                    description: formData.company_name,
                },
                {
                    correlative: "company_description",
                    name: "Descripción de la Empresa (SEO)",
                    description: formData.company_description,
                },
                {
                    correlative: "company_logo",
                    name: "URL del Logo (Schema)",
                    description: formData.company_logo,
                },
                {
                    correlative: "company_url",
                    name: "URL del Sitio Web (Schema)",
                    description: formData.company_url,
                },
                {
                    correlative: "company_locality",
                    name: "Localidad/Ciudad",
                    description: formData.company_locality,
                },
                {
                    correlative: "company_region",
                    name: "Región/Estado",
                    description: formData.company_region,
                },
                {
                    correlative: "company_country",
                    name: "País (Código)",
                    description: formData.company_country,
                },
                {
                    correlative: "twitter_site",
                    name: "Usuario de Twitter",
                    description: formData.twitter_site,
                },
                {
                    correlative: "facebook_page",
                    name: "URL Facebook",
                    description: formData.facebook_page,
                },
                {
                    correlative: "instagram_profile",
                    name: "URL Instagram",
                    description: formData.instagram_profile,
                },
                {
                    correlative: "linkedin_profile",
                    name: "URL LinkedIn",
                    description: formData.linkedin_profile,
                },
                {
                    correlative: "google_site_verification",
                    name: "Verificación de Google",
                    description: formData.google_site_verification,
                },
                {
                    correlative: "bing_site_verification",
                    name: "Verificación de Bing",
                    description: formData.bing_site_verification,
                },
                {
                    correlative: "og_image_default",
                    name: "Imagen OG por Defecto",
                    description: formData.og_image_default,
                },
                {
                    correlative: "company_address",
                    name: "Dirección SEO",
                    description: formData.company_address,
                },
                {
                    correlative: "company_phone",
                    name: "Teléfono SEO",
                    description: formData.company_phone,
                },
                {
                    correlative: "company_email",
                    name: "Email SEO",
                    description: formData.company_email,
                },
                {
                    correlative: "facebook_pixel",
                    name: "Facebook Pixel ID",
                    description: formData.facebook_pixel,
                },
                {
                    correlative: "google_tag_manager",
                    name: "GTM ID (GTM-XXXX)",
                    description: formData.google_tag_manager,
                },
                {
                    correlative: "google_analytics",
                    name: "Google Analytics ID (G-XXXX)",
                    description: formData.google_analytics,
                },
                {
                    correlative: "tiktok_pixel",
                    name: "TikTok Pixel ID",
                    description: formData.tiktok_pixel,
                },
                {
                    correlative: "head_scripts",
                    name: "Scripts Personalizados (HEAD)",
                    description: formData.head_scripts,
                },
                {
                    correlative: "body_scripts",
                    name: "Scripts Personalizados (BODY)",
                    description: formData.body_scripts,
                },
                {
                    correlative: "atalaya_apikey",
                    name: "Atalaya API Key",
                    description: formData.atalaya_apikey ?? "",
                },
            ]);

            // alert('Datos guardados exitosamente');
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            // alert('Error al guardar los datos');
        }
    };

    const seo_keywords = (
        generals.find((x) => x.correlative == "seo_keywords")?.description ?? ""
    )
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    useEffect(() => {
        $("#cbo-keywords option").prop("selected", true).trigger("change");
    }, [null]);

    console.log(formData);

    return (
        <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs" id="contactTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "contact" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("contact")}
                            type="button"
                            role="tab"
                        >
                            Información de Contacto
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "policies" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("policies")}
                            type="button"
                            role="tab"
                        >
                            Políticas y Términos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "seo" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("seo")}
                            type="button"
                            role="tab"
                        >
                            SEO (Básico)
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "seo_advanced" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("seo_advanced")}
                            type="button"
                            role="tab"
                        >
                            SEO Avanzado
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "pixels" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("pixels")}
                            type="button"
                            role="tab"
                        >
                            Píxeles y Seguimiento
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "email" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("email")}
                            type="button"
                            role="tab"
                        >
                            Configuración de Email
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "atalaya" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("atalaya")}
                            type="button"
                            role="tab"
                        >
                            Atalaya CRM
                        </button>
                    </li>
                    <li className="nav-item" role="presentation" hidden>
                        <button
                            className={`nav-link ${
                                activeTab === "location" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("location")}
                            type="button"
                            role="tab"
                        >
                            Ubicación
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="contactTabsContent">
                    <div
                        className={`tab-pane fade ${
                            activeTab === "contact" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-6" hidden>
                                {formData.phones.map((phone, index) => (
                                    <div
                                        key={`phone-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`phone-${index}`}
                                            className="form-label"
                                        >
                                            Teléfono {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`phone-${index}`}
                                                value={phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "phones",
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "phones",
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("phones")}
                                >
                                    Agregar teléfono
                                </button>
                            </div>
                            <div className="col-md-6" hidden>
                                {formData.emails.map((email, index) => (
                                    <div
                                        key={`email-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`email-${index}`}
                                            className="form-label"
                                        >
                                            Correo {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`email-${index}`}
                                                value={email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "emails",
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "emails",
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("emails")}
                                >
                                    Agregar correo
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Dirección
                            </label>
                            <textarea
                                className="form-control"
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                        <div className="mb-3" hidden>
                            <TextareaFormGroup
                                label="Horario de Atención"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        openingHours: e.target.value,
                                    })
                                }
                                value={formData.openingHours}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportPhone"
                                className="form-label"
                            >
                                Teléfono de Soporte
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="supportPhone"
                                value={formData.supportPhone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportPhone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportEmail"
                                className="form-label"
                            >
                                Correo de Soporte
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="supportEmail"
                                value={formData.supportEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportEmail: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <TextareaFormGroup
                                label="Descripción de la Empresa (Footer)"
                                value={formData.footerDescription}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        footerDescription: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Sección de Asesores de WhatsApp */}
                        <div
                            className="card mt-3"
                            style={{
                                backgroundColor: "#e3f2fd",
                                padding: "16px",
                            }}
                        >
                            <h6 className="mb-3">
                                <i className="mdi mdi-account-multiple me-2"></i>
                                Asesores de WhatsApp
                            </h6>
                            <p className="text-muted small mb-3">
                                Agrega múltiples asesores. Si hay más de uno, se
                                mostrará un modal para que el cliente elija.
                            </p>

                            {formData.whatsappAdvisors?.map(
                                (advisor, index) => (
                                    <div
                                        key={index}
                                        className="card mb-3"
                                        style={{
                                            padding: "12px",
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">
                                                Asesor #{index + 1}
                                            </h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    const newAdvisors =
                                                        formData.whatsappAdvisors.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        whatsappAdvisors:
                                                            newAdvisors,
                                                    });
                                                }}
                                            >
                                                <i className="mdi mdi-delete"></i>
                                            </button>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <label className="form-label small">
                                                    Nombre del Asesor
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Ej: Romer Palacio"
                                                    value={advisor.name || ""}
                                                    onChange={(e) => {
                                                        const newAdvisors = [
                                                            ...formData.whatsappAdvisors,
                                                        ];
                                                        newAdvisors[
                                                            index
                                                        ].name = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            whatsappAdvisors:
                                                                newAdvisors,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label className="form-label small">
                                                    Puesto/Cargo
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Ej: Asesor de Ventas"
                                                    value={
                                                        advisor.position || ""
                                                    }
                                                    onChange={(e) => {
                                                        const newAdvisors = [
                                                            ...formData.whatsappAdvisors,
                                                        ];
                                                        newAdvisors[
                                                            index
                                                        ].position =
                                                            e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            whatsappAdvisors:
                                                                newAdvisors,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label className="form-label small">
                                                    Número de WhatsApp
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control form-control-sm"
                                                    placeholder="+51999999999"
                                                    value={advisor.phone || ""}
                                                    onChange={(e) => {
                                                        const newAdvisors = [
                                                            ...formData.whatsappAdvisors,
                                                        ];
                                                        newAdvisors[
                                                            index
                                                        ].phone =
                                                            e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            whatsappAdvisors:
                                                                newAdvisors,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label className="form-label small">
                                                    Mensaje Inicial
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="¡Hola! Necesito información"
                                                    value={
                                                        advisor.message || ""
                                                    }
                                                    onChange={(e) => {
                                                        const newAdvisors = [
                                                            ...formData.whatsappAdvisors,
                                                        ];
                                                        newAdvisors[
                                                            index
                                                        ].message =
                                                            e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            whatsappAdvisors:
                                                                newAdvisors,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-12 mb-2">
                                                <label className="form-label small">
                                                    Foto del Asesor
                                                </label>
                                                {console.log(advisor)}
                                                {advisor.photo ? (
                                                    <div className="position-relative ">
                                                        <Tippy content="Eliminar foto">
                                                            <button
                                                                type="button"
                                                                className="position-absolute btn btn-xs btn-danger"
                                                                style={{
                                                                    top: "5px",
                                                                    left: "5px",
                                                                    zIndex: 10,
                                                                }}
                                                                onClick={() => {
                                                                    const newAdvisors =
                                                                        [
                                                                            ...formData.whatsappAdvisors,
                                                                        ];
                                                                    newAdvisors[
                                                                        index
                                                                    ].photo =
                                                                        null;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            whatsappAdvisors:
                                                                                newAdvisors,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <i className="mdi mdi-delete"></i>
                                                            </button>
                                                        </Tippy>
                                                        <img
                                                            src={`/assets/resources/${advisor.photo}`}
                                                            alt={advisor.name}
                                                            className="img-thumbnail"
                                                            style={{
                                                                width: "80px",
                                                                height: "80px",
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "50%",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="file"
                                                        className="form-control form-control-sm"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file =
                                                                e.target
                                                                    .files[0];
                                                            if (!file) return;
                                                            e.target.value =
                                                                null;

                                                            const ext =
                                                                file.name
                                                                    .split(".")
                                                                    .pop();
                                                            const imageName = `whatsapp-advisor-${index + 1}.${ext}`;

                                                            const request =
                                                                new FormData();
                                                            request.append(
                                                                "image",
                                                                file,
                                                            );
                                                            request.append(
                                                                "name",
                                                                imageName,
                                                            );

                                                            const result =
                                                                await fetch(
                                                                    "/api/admin/generals/upload",
                                                                    {
                                                                        method: "POST",
                                                                        headers:
                                                                            {
                                                                                "X-Xsrf-Token":
                                                                                    decodeURIComponent(
                                                                                        Cookies.get(
                                                                                            "XSRF-TOKEN",
                                                                                        ),
                                                                                    ),
                                                                            },
                                                                        body: request,
                                                                    },
                                                                );

                                                            if (!result.ok)
                                                                return;
                                                            const {
                                                                data: imageNameReturned,
                                                            } =
                                                                await result.json();

                                                            const newAdvisors =
                                                                [
                                                                    ...formData.whatsappAdvisors,
                                                                ];
                                                            newAdvisors[
                                                                index
                                                            ].photo = imageName;
                                                            setFormData({
                                                                ...formData,
                                                                whatsappAdvisors:
                                                                    newAdvisors,
                                                            });
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                    const newAdvisors = [
                                        ...(formData.whatsappAdvisors || []),
                                        {
                                            name: "",
                                            phone: "",
                                            message: "",
                                            photo: null,
                                            position: "",
                                        },
                                    ];
                                    setFormData({
                                        ...formData,
                                        whatsappAdvisors: newAdvisors,
                                    });
                                }}
                            >
                                <i className="mdi mdi-plus me-1"></i>
                                Agregar Asesor
                            </button>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "policies" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Política de Privacidad"
                                value={formData.privacyPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        privacyPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Términos y Condiciones"
                                value={formData.termsConditions}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        termsConditions: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3" hidden>
                            <QuillFormGroup
                                label="Políticas de Devolución"
                                value={formData.exchangePolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        exchangePolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3" hidden>
                            <QuillFormGroup
                                label="Política de Cookies"
                                value={formData.cookiesPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        cookiesPolicy: value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "seo" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <InputFormGroup
                            label="Título SEO"
                            value={formData.seoTitle ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoTitle: e.target.value,
                                })
                            }
                        />
                        <TextareaFormGroup
                            label="Descripción SEO"
                            value={formData.seoDescription ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoDescription: e.target.value,
                                })
                            }
                        />
                        <SelectFormGroup
                            id="cbo-keywords"
                            label="Palabras Clave SEO"
                            tags
                            multiple
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoKeywords: [...$(e.target).val()].join(
                                        ", ",
                                    ),
                                })
                            }
                        >
                            {seo_keywords.map((keyword, index) => {
                                return (
                                    <option key={index} value={keyword}>
                                        {keyword}
                                    </option>
                                );
                            })}
                        </SelectFormGroup>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "seo_advanced" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="mb-3 border-bottom pb-2">
                                    Información de Empresa (Schema.org)
                                </h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Nombre Legal"
                                            value={formData.company_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_name:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="URL del Sitio"
                                            value={formData.company_url}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_url: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <TextareaFormGroup
                                            label="Descripción de la Empresa"
                                            value={formData.company_description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_description:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Localidad / Ciudad"
                                            value={formData.company_locality}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_locality:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputFormGroup
                                            label="Región"
                                            value={formData.company_region}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_region:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputFormGroup
                                            label="País (Código PE, US, etc)"
                                            value={formData.company_country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_country:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <InputFormGroup
                                            label="Dirección Legal"
                                            value={formData.company_address}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_address:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Teléfono (Schema)"
                                            value={formData.company_phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_phone:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Email (Schema)"
                                            value={formData.company_email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_email:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-4">
                                <h5 className="mb-3 border-bottom pb-2">
                                    Redes Sociales
                                </h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Twitter (Usuario @)"
                                            value={formData.twitter_site}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    twitter_site:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Facebook Page URL"
                                            value={formData.facebook_page}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    facebook_page:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Instagram Profile URL"
                                            value={formData.instagram_profile}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    instagram_profile:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="LinkedIn Profile URL"
                                            value={formData.linkedin_profile}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    linkedin_profile:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-4">
                                <h5 className="mb-3 border-bottom pb-2">
                                    Verificación y Assets
                                </h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Google Site Verification"
                                            value={
                                                formData.google_site_verification
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    google_site_verification:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Bing Site Verification"
                                            value={
                                                formData.bing_site_verification
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bing_site_verification:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <InputFormGroup
                                            label="OG Image Default (URL)"
                                            value={formData.og_image_default}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    og_image_default:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "pixels" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="mb-3 border-bottom pb-2">
                                    Configuración de Píxeles de Seguimiento
                                </h5>
                                <p className="text-muted small mb-4">
                                    Ingresa solo los IDs de los píxeles. El
                                    sistema se encargará de inyectar el código
                                    necesario en todas las páginas.
                                </p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Facebook Pixel ID"
                                            placeholder="Ej: 123456789012345"
                                            value={formData.facebook_pixel}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    facebook_pixel:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Google Tag Manager ID"
                                            placeholder="Ej: GTM-XXXXXXX"
                                            value={formData.google_tag_manager}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    google_tag_manager:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="Google Analytics ID"
                                            placeholder="Ej: G-XXXXXXXXXX"
                                            value={formData.google_analytics}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    google_analytics:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            label="TikTok Pixel ID"
                                            placeholder="Ej: C1234567890ABCDE"
                                            value={formData.tiktok_pixel}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    tiktok_pixel:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <TextareaFormGroup
                                            label="Scripts Personalizados (Al final del HEAD)"
                                            placeholder="Pega aquí cualquier código HTML/JS (ej: Hotjar, Pixeles especiales)"
                                            value={formData.head_scripts}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    head_scripts:
                                                        e.target.value,
                                                })
                                            }
                                            rows={5}
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <TextareaFormGroup
                                            label="Scripts Personalizados (Al inicio del BODY)"
                                            placeholder="Pega aquí cualquier código HTML/JS"
                                            value={formData.body_scripts}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    body_scripts:
                                                        e.target.value,
                                                })
                                            }
                                            rows={5}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "email" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <InputFormGroup
                            label="Correo Corporativo (Copia de Notificación)"
                            value={formData.email_corporative}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email_corporative: e.target.value,
                                })
                            }
                        />
                        <InputFormGroup
                            label="API Key de TinyMCE"
                            value={formData.API_KEY_TINYMCE}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    API_KEY_TINYMCE: e.target.value,
                                })
                            }
                        />
                        <TinyMCEFormGroup
                            label="Plantilla de Email de Reserva"
                            value={formData.email_template}
                            onChange={(content) =>
                                setFormData({
                                    ...formData,
                                    email_template: content,
                                })
                            }
                            variables={[
                                "company",
                                "name",
                                "email",
                                "number",
                                "address",
                                "city",
                                "zip",
                                "property_type",
                                "sqft",
                                "floors",
                                "frequency",
                                "pets",
                                "date",
                                "time",
                                "service_title",
                                "description",
                                "support_phone",
                                "support_email",
                                "address_contact",

                                "domain",
                            ]}
                        />
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "atalaya" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="card-body">
                            <h5 className="card-title text-primary">Conecta tu formulario con Atalaya</h5>
                            <p className="text-muted small">
                                A continuación se muestra tu API key. Usa esta clave para conectar tu landing con Atalaya enviando los datos a la URL proporcionada con los headers y el cuerpo especificados.
                            </p>
                            <InputFormGroup
                                label="Tu API Key de Atalaya"
                                value={formData.atalaya_apikey}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        atalaya_apikey: e.target.value,
                                    })
                                }
                                placeholder="ae023df5-1267-11f1-b4a8-bc2411b94010"
                            />
                            
                            <div className="alert alert-info mt-3">
                                <h6>Detalles de Integración</h6>
                                <p className="small mb-1"><strong>URL:</strong> POST https://crm.atalaya.pe/free/leads</p>
                                <p className="small mb-1"><strong>Headers:</strong></p>
                                <pre className="bg-light p-2 rounded small">
{`{
  "Content-Type": "application/json",
  "Authorization": "Bearer ${formData.atalaya_apikey || '[Tu API Key]'}"
}`}
                                </pre>
                                <p className="small mb-1"><strong>Body:</strong></p>
                                <pre className="bg-light p-2 rounded small">
{`{
  "contact_name": "[Nombre completo]",
  "contact_phone": "[Teléfono]",
  "contact_email": "[Correo electrónico]",
  "tradename": "[Empresa]",
  "message": "[Caudal / Detalles]",
  "origin": "Landing Page"
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "location" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "400px",
                                }}
                                center={formData.location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker position={formData.location} />
                            </GoogleMap>
                        </LoadScript>
                        <small className="form-text text-muted">
                            Haz clic en el mapa para seleccionar la ubicación.
                        </small>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Guardar
                </button>
            </form>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Ajustes Generales">
            <Generals {...properties} />
        </BaseAdminto>,
    );
});
