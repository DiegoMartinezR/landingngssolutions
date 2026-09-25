import React, { useRef, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Swal from "sweetalert2";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import LandingHomeRest from "../actions/Admin/LandingHomeRest";
import { Notify } from "sode-extend-react";

const landingHomeRest = new LandingHomeRest();

const normalizeCorrelative = (correlative) => {
    if (!correlative) return "home";
    const parts = correlative.split("_");
    if (parts.length < 2) return "home";
    return parts[1]; // Devuelve 'home', 'services', etc.
};

const isYoutube = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
};

const EditableCell = ({
    data,
    field,
    currentLangId,
    defaultLangId,
    onSave,
    type = "text",
}) => {
    const [tempValue, setTempValue] = useState(data[field] || "");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTempValue(data[field] || "");
    }, [data, field]);

    const isBaseLanguage = currentLangId === defaultLangId;
    const isTranslatable = !isBaseLanguage;

    const handleSave = () => {
        onSave(field, tempValue);
        setIsEditing(false);
    };

    return (
        <div
            className={`d-flex gap-2 ${type === "textarea" ? "align-items-start" : "align-items-center"
                } ${isTranslatable ? "translation-field" : ""}`}
        >
            {isBaseLanguage ? (
                <span style={type === "textarea" ? { whiteSpace: "pre-wrap" } : {}}>{data[field]}</span>
            ) : (
                <>
                    {type === "textarea" ? (
                        <textarea
                            className="form-control flex-grow-1"
                            value={tempValue}
                            rows={3}
                            onChange={(e) => {
                                setTempValue(e.target.value);
                                setIsEditing(true);
                            }}
                            disabled={!isTranslatable}
                        />
                    ) : (
                        <input
                            className="form-control flex-grow-1"
                            value={tempValue}
                            onChange={(e) => {
                                setTempValue(e.target.value);
                                setIsEditing(true);
                            }}
                            disabled={!isTranslatable}
                        />
                    )}
                    {isEditing && isTranslatable && (
                        <button
                            className="btn btn-xs btn-soft-primary"
                            onClick={handleSave}
                        >
                            <i className="fa fa-save"></i>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const LandingHome = ({
    items: initialItems,
    current_lang_id,
    default_lang_id,
    app_developer,
}) => {
    const modalRef = useRef();
    const [activeTab, setActiveTab] = useState("home");
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [isVideoMobile, setIsVideoMobile] = useState(false);
    const [items, setItems] = useState(initialItems);
    const [translations, setTranslations] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    // Form refs
    const idRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const imageMobileRef = useRef(null);
    const videoMobileRef = useRef(null);
    const linkRef = useRef(null);
    const is_videoRef = useRef(null);
    const is_videoMobileRef = useRef(null);

    // Nombres de las páginas para los tabs
    const pageNames = {
        home: "Inicio",
        //   services: "Servicios",
        //  aboutus: "Nosotros",
        //facility: "Sedes",
        //contact: "Contacto",
        //blog: "Blog",
    };

    const loadTranslations = useCallback(async () => {
        if (current_lang_id !== default_lang_id) {
            setIsLoading(true);
            try {
                const response = await landingHomeRest.getByLang(
                    current_lang_id
                );
                const translationsMap = {};
                response.forEach((item) => {
                    if (item.original_id) {
                        translationsMap[item.original_id] = item;
                    }
                });
                setTranslations(translationsMap);
            } catch (error) {
                Notify.error("Error al cargar traducciones");
                console.error("Error loading translations:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setTranslations({});
        }
    }, [current_lang_id, default_lang_id]);

    const refreshAllData = useCallback(async () => {
        const response = await landingHomeRest.paginate({
            isLoadingAll: true,
        });
        if (Array.isArray(response)) {
            setItems(response);
        } else if (response && response.data) {
            setItems(response.data);
        }
        await loadTranslations();
    }, [loadTranslations]);

    // Cargar traducciones cuando cambia el idioma
    useEffect(() => {
        loadTranslations();
    }, [loadTranslations]);

    // Agrupar items por página - VERSIÓN CORREGIDA
    const groupedItems = items.reduce((acc, item) => {
        const page = normalizeCorrelative(item.correlative);

        if (!acc[page]) {
            acc[page] = [];
        }

        const translation = translations[item.original_id || item.id] || {};
        const displayItem = {
            ...item,
            title:
                current_lang_id !== default_lang_id
                    ? translation.title || item.title
                    : item.title,
            subtitle:
                current_lang_id !== default_lang_id
                    ? translation.subtitle || item.subtitle
                    : item.subtitle,
            description:
                current_lang_id !== default_lang_id
                    ? translation.description || item.description
                    : item.description,
            link:
                current_lang_id !== default_lang_id
                    ? translation.link || item.link
                    : item.link,
            image:
                current_lang_id !== default_lang_id
                    ? translation.image || item.image
                    : item.image,
            image_mobile:
                current_lang_id !== default_lang_id
                    ? translation.image_mobile || item.image_mobile
                    : item.image_mobile,
            is_video:
                current_lang_id !== default_lang_id
                    ? translation.is_video ?? item.is_video
                    : item.is_video,
            is_video_mobile:
                current_lang_id !== default_lang_id
                    ? translation.is_video_mobile ?? item.is_video_mobile
                    : item.is_video_mobile,
            video:
                current_lang_id !== default_lang_id
                    ? translation.video || item.video
                    : item.video,
            video_mobile:
                current_lang_id !== default_lang_id
                    ? translation.video_mobile || item.video_mobile
                    : item.video_mobile,
            is_translated: !!translation.id,
        };

        acc[page].push(displayItem);
        return acc;
    }, {});

    // Debug: Verificar agrupación
    useEffect(() => {
        console.log("Items agrupados:", groupedItems);
        console.log("Items en home:", groupedItems.home?.length);
        console.log("APP_DEVELOPER:", app_developer);
    }, [groupedItems, app_developer]);

    const onModalOpen = (data) => {
        setEditingItem(data);
        setModalKey((prev) => prev + 1);
        setIsEditing(!!data?.id);
        const isVideoChecked = data?.is_video == 1 || data?.is_video === "1";
        const isVideoMobileChecked = data?.is_video_mobile == 1 || data?.is_video_mobile === "1";
        setIsVideo(isVideoChecked);
        setIsVideoMobile(isVideoMobileChecked);

        setTimeout(() => {
            if (idRef.current) idRef.current.value = data?.id ?? "";
            if (titleRef.current) titleRef.current.value = data?.title ?? "";
            if (subtitleRef.current)
                subtitleRef.current.value = data?.subtitle ?? "";
            if (descriptionRef.current)
                descriptionRef.current.value = data?.description ?? "";
            if (linkRef.current) linkRef.current.value = data?.link ?? "";

            // Desktop video/image
            if (isVideoChecked) {
                if (videoRef.current) videoRef.current.value = data?.video ?? "";
            } else {
                const setImage = () => {
                    if (imageRef.image) {
                        imageRef.image.src = data?.image
                            ? `/api/landing_home/media/${data?.image}`
                            : "/api/cover/thumbnail/null";
                    }
                };
                setImage();
                setTimeout(setImage, 100);
            }
            if (imageRef.current) {
                imageRef.current.value = "";
            }

            // Mobile video/image
            if (isVideoMobileChecked) {
                if (videoMobileRef.current) videoMobileRef.current.value = data?.video_mobile ?? "";
            } else {
                const setImageMobile = () => {
                    if (imageMobileRef.image) {
                        imageMobileRef.image.src = data?.image_mobile
                            ? `/api/landing_home/media/${data?.image_mobile}`
                            : "/api/cover/thumbnail/null";
                    }
                };
                setImageMobile();
                setTimeout(setImageMobile, 100);
            }
            if (imageMobileRef.current) {
                imageMobileRef.current.value = "";
            }
        }, 150);

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("id", idRef.current?.value ?? "");
            formData.append("title", titleRef.current?.value ?? "");
            formData.append("subtitle", subtitleRef.current?.value ?? "");
            formData.append("description", descriptionRef.current?.value ?? "");
            formData.append("link", linkRef.current?.value ?? "");

            // Desktop
            formData.append(
                "is_video",
                isVideo ? "1" : "0"
            );
            if (isVideo) {
                formData.append("video", videoRef.current?.value ?? "");
            } else if (imageRef.current?.files?.[0]) {
                formData.append("image", imageRef.current.files[0]);
            }

            // Mobile
            formData.append(
                "is_video_mobile",
                isVideoMobile ? "1" : "0"
            );
            if (isVideoMobile) {
                formData.append("video_mobile", videoMobileRef.current?.value ?? "");
            } else if (imageMobileRef.current?.files?.[0]) {
                formData.append("image_mobile", imageMobileRef.current.files[0]);
            }

            formData.append("lang_id", current_lang_id);

            const res = await landingHomeRest.save(formData);
            if (!res) return;

            await refreshAllData();

            // Cerrar el modal de forma segura
            if (modalRef.current) {
                $(modalRef.current).modal("hide");
                // Por si acaso jQuery no está bien vinculado con Bootstrap 5
                if (window.bootstrap && bootstrap.Modal) {
                    const modalInst = bootstrap.Modal.getInstance(modalRef.current);
                    if (modalInst) modalInst.hide();
                }
            }

            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Correcto",
                body: "Sección guardada correctamente",
                type: "success",
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Error",
                body: "Hubo un error al enviar el formulario",
                type: "danger",
            });
        }
    };

    const shouldShowField = (fieldName) => {
        // Si APP_DEVELOPER=Editor → acceso total, ve todos los campos
        if (app_developer === "Editor") return true;
        // En cualquier otro caso (vacío, null, etc.) → modo cliente: solo mostrar campos con data
        if (!isEditing || !editingItem) return true;

        if (fieldName === "image" || fieldName === "video") {
            const hasImage = editingItem.image && editingItem.image !== "null";
            const hasVideo = editingItem.video && editingItem.video !== "null";
            return !!(hasImage || hasVideo);
        }
        if (fieldName === "image_mobile" || fieldName === "video_mobile") {
            const hasImageMobile = editingItem.image_mobile && editingItem.image_mobile !== "null";
            const hasVideoMobile = editingItem.video_mobile && editingItem.video_mobile !== "null";
            return !!(hasImageMobile || hasVideoMobile);
        }

        const value = editingItem[fieldName];
        if (value === null || value === undefined || value === "" || value === "null") {
            return false;
        }
        return true;
    };

    const handleSaveTranslation = async (itemId, field, value) => {
        try {
            const item = items.find((i) => i.id === itemId);
            if (!item) return;

            const payload = {
                original_id: item.original_id || item.id,
                [field]: value,
                lang_id: current_lang_id,
                title:
                    field === "title"
                        ? value
                        : translations[item.id]?.title || item.title,
                subtitle:
                    field === "subtitle"
                        ? value
                        : translations[item.id]?.subtitle || item.subtitle,
                description:
                    field === "description"
                        ? value
                        : translations[item.id]?.description ||
                        item.description,
                link:
                    field === "link"
                        ? value
                        : translations[item.id]?.link || item.link,
            };

            const result = await landingHomeRest.translate(payload);
            if (!result) return;

            // After saving translation, refresh all data to ensure UI is consistent
            await refreshAllData();

            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Correcto",
                body: "Traducción guardada correctamente",
                type: "success",
            });
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.png",
                title: "Error",
                body: "Error al guardar traducción",
                type: "danger",
            });
            console.error(error);
        }
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await landingHomeRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;

        await refreshAllData();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar sección",
            text: "¿Estás seguro de eliminar esta sección?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        const result = await landingHomeRest.delete(id);
        if (!result) return;

        await refreshAllData();

        Notify.add({
            icon: "/assets/img/icon.png",
            title: "Correcto",
            body: "Sección eliminada correctamente",
            type: "success",
        });
    };

    const isTranslationMode = current_lang_id !== default_lang_id;

    return (
        <>
            <div
                className={`card ${isTranslationMode ? "translation-mode" : ""
                    }`}
            >
                <div className="card-header d-flex justify-content-between align-items-center">
                    <ul className="nav nav-tabs card-header-tabs">
                        {Object.keys(pageNames).map((page) => (
                            <li key={page} className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === page ? "active" : ""
                                        }`}
                                    onClick={() => setActiveTab(page)}
                                >
                                    {pageNames[page]}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {isTranslationMode && (
                            <span
                                className="badge bg-success me-2"
                                style={{ padding: "6px" }}
                            >
                                <i className="fa fa-language me-1"></i> Modo
                                Traducción
                            </span>
                        )}
                        {/* <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                                onModalOpen({
                                    correlative: `page_${activeTab}_new`,
                                    lang_id: default_lang_id,
                                })
                            }
                        >
                            <i className="fa fa-plus me-1"></i> Nueva Sección
                        </button>*/}
                    </div>
                </div>

                <div className="card-body">
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>
                            <p className="mt-2">Cargando traducciones...</p>
                        </div>
                    ) : (
                        Object.keys(pageNames).map((page) => (
                            <div
                                key={page}
                                style={{
                                    display:
                                        activeTab === page ? "block" : "none",
                                }}
                            >
                                <h4 className="mb-4">
                                    Secciones de {pageNames[page]}
                                </h4>
                                <p className="text-muted mb-3">
                                    Mostrando {groupedItems[page]?.length || 0}{" "}
                                    secciones
                                </p>

                                {groupedItems[page]?.length === 0 ? (
                                    <div className="alert alert-info">
                                        No hay secciones configuradas para esta
                                        página
                                    </div>
                                ) : (
                                    <div className="row">
                                        {(groupedItems[page] || []).map(
                                            (item) => (
                                                <div
                                                    key={item.id}
                                                    className="col-md-6 mb-4"
                                                >
                                                    <div className="card h-100">
                                                        <div className="card-header d-flex justify-content-between align-items-center">
                                                            <h5 className="mb-0">
                                                                {item.correlative?.split(
                                                                    "_"
                                                                )[2] ||
                                                                    "Sección"}
                                                                <small className="text-muted ms-2">
                                                                    (
                                                                    {
                                                                        item.correlative
                                                                    }
                                                                    )
                                                                </small>
                                                            </h5>
                                                            {/*   <SwitchFormGroup
                                                                checked={
                                                                    item.visible
                                                                }
                                                                onChange={(e) =>
                                                                    onVisibleChange(
                                                                        {
                                                                            id: item.id,
                                                                            value: e
                                                                                .target
                                                                                .checked,
                                                                        }
                                                                    )
                                                                }
                                                            />*/}
                                                        </div>

                                                        <div className="card-body">
                                                            {item.is_video === "1" ||
                                                                item.is_video === 1 ? (
                                                                isYoutube(item.video) ? (
                                                                    (() => {
                                                                        const videoId =
                                                                            item.video?.includes(
                                                                                "v="
                                                                            )
                                                                                ? item.video
                                                                                    .split(
                                                                                        "v="
                                                                                    )[1]
                                                                                    ?.split(
                                                                                        "&"
                                                                                    )[0]
                                                                                : item.video?.includes(
                                                                                    "youtu.be/"
                                                                                )
                                                                                    ? item.video
                                                                                        .split(
                                                                                            "youtu.be/"
                                                                                        )[1]
                                                                                        ?.split(
                                                                                            "?"
                                                                                        )[0]
                                                                                    : item.video;
                                                                        return (
                                                                            <iframe
                                                                                width="100%"
                                                                                height="200"
                                                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                                                title="YouTube video player"
                                                                                frameBorder="0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                                className="mb-3"
                                                                            ></iframe>
                                                                        );
                                                                    })()
                                                                ) : (
                                                                    <video
                                                                        width="100%"
                                                                        height="200"
                                                                        controls
                                                                        src={item.video}
                                                                        className="mb-3"
                                                                        style={{ background: "#000", objectFit: "cover" }}
                                                                    ></video>
                                                                )
                                                            ) : item.image ? (
                                                                <img
                                                                    src={`/api/landing_home/media/${item.image}`}
                                                                    className="img-fluid mb-3"
                                                                    style={{
                                                                        maxHeight:
                                                                            "200px",
                                                                        width: "100%",
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                    onError={(
                                                                        e
                                                                    ) =>
                                                                    (e.target.src =
                                                                        "/api/cover/thumbnail/null")
                                                                    }
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="bg-light mb-3"
                                                                    style={{
                                                                        height: "200px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <span className="text-muted">
                                                                        Sin
                                                                        imagen/video
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {item.title && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Título:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={item}
                                                                        field="title"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.subtitle && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Subtítulo:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={item}
                                                                        field="subtitle"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.description && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Descripción:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={item}
                                                                        field="description"
                                                                        type="textarea"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.link && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Enlace:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={item}
                                                                        field="link"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="card-footer d-flex justify-content-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() =>
                                                                    onModalOpen(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    isTranslationMode
                                                                }
                                                            >
                                                                <i className="fa fa-edit"></i>{" "}
                                                                Editar
                                                            </button>
                                                            {/*    <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    onDeleteClicked(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-trash"></i>{" "}
                                                                Eliminar
                                                            </button>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar sección" : "Agregar sección"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="principal-container">
                    <input ref={idRef} type="hidden" />

                    <div className="col-md-6">
                        {shouldShowField("title") && (
                            <InputFormGroup
                                eRef={titleRef}
                                label="Título"
                                placeholder="Título principal de la sección"
                                required
                            />
                        )}

                        {shouldShowField("subtitle") && (
                            <InputFormGroup
                                eRef={subtitleRef}
                                label="Subtítulo"
                                placeholder="Subtítulo opcional"
                                required={app_developer !== "Editor"}
                            />
                        )}

                        {shouldShowField("description") && (
                            <TextareaFormGroup
                                eRef={descriptionRef}
                                label="Descripción"
                                rows={3}
                                placeholder="Descripción detallada de la sección"
                                required={app_developer !== "Editor"}
                            />
                        )}

                        {shouldShowField("link") && (
                            <InputFormGroup
                                eRef={linkRef}
                                label="Enlace"
                                placeholder="https://ejemplo.com"
                                required={app_developer !== "Editor"}
                            />
                        )}
                    </div>

                    <div className="col-md-6">
                        {/* DESKTOP */}
                        {shouldShowField("image") && (
                            <div className="mb-4 p-3 border rounded bg-light">
                                <h6 className="mb-3">
                                    <i className="fa fa-desktop me-2"></i>Versión Desktop
                                </h6>
                                {app_developer === "Editor" && (
                                    <SwitchFormGroup
                                        key={`sw-${modalKey}`}
                                        eRef={is_videoRef}
                                        checked={isVideo}
                                        onChange={(e) => setIsVideo(e.target.checked)}
                                        label="Usar video en lugar de imagen"
                                        specification="Solo se mostrará el video en la sección"
                                        refreshable={modalKey}
                                    />
                                )}
                                <div className={!isVideo ? "d-block" : "d-none"}>
                                    <ImageFormGroup
                                        eRef={imageRef}
                                        label="Imagen Desktop"
                                        col="col-12"
                                        aspect={16 / 9}
                                        fit="contain"
                                        required={!isEditing && !isVideo}
                                    />
                                </div>
                                <div className={isVideo ? "d-block" : "d-none"}>
                                    <InputFormGroup
                                        eRef={videoRef}
                                        label="URL de Video Desktop (YouTube)"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        col="col-12"
                                        required={isVideo && (!isEditing || app_developer !== "Editor")}
                                    />
                                </div>
                            </div>
                        )}

                        {/* MOBILE */}
                        {shouldShowField("image_mobile") && (
                            <div className="mb-4 p-3 border rounded bg-light">
                                <h6 className="mb-3">
                                    <i className="fa fa-mobile me-2"></i>Versión Mobile
                                </h6>
                                {app_developer === "Editor" && (
                                    <SwitchFormGroup
                                        key={`sw-mobile-${modalKey}`}
                                        eRef={is_videoMobileRef}
                                        checked={isVideoMobile}
                                        onChange={(e) => setIsVideoMobile(e.target.checked)}
                                        label="Usar video en lugar de imagen"
                                        specification="Solo se mostrará el video en mobile"
                                        refreshable={modalKey}
                                    />
                                )}
                                <div className={!isVideoMobile ? "d-block" : "d-none"}>
                                    <ImageFormGroup
                                        eRef={imageMobileRef}
                                        label="Imagen Mobile"
                                        col="col-12"
                                        aspect={9 / 16}
                                        fit="contain"
                                        required={!isEditing && !isVideoMobile}
                                    />
                                </div>
                                <div className={isVideoMobile ? "d-block" : "d-none"}>
                                    <InputFormGroup
                                        eRef={videoMobileRef}
                                        label="URL de Video Mobile (YouTube)"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        col="col-12"
                                        required={isVideoMobile && (!isEditing || app_developer !== "Editor")}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Landing Inicio">
            <LandingHome {...properties} />
        </BaseAdminto>
    );
});
