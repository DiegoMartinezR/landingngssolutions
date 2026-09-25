import React, { useEffect, useRef, useState, useMemo } from "react";
import BaseAdminto from "@Adminto/Base";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";

import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import FacilitiesRest from "../actions/Admin/FacilitiesRest";
import ZonesRest from "../actions/Admin/ZonesRest";
import {
    GoogleMap,
    LoadScript,
    Marker,
    Autocomplete,
    Circle,
} from "@react-google-maps/api";
import Global from "../Utils/Global";

const facilitiesRest = new FacilitiesRest();
const zonesRest = new ZonesRest();
const libraries = ["places"];

const Facilities = ({ zones: initialZones }) => {
    const [itemData, setItemData] = useState([]);
    const gridRef = useRef();
    const modalRef = useRef();

    // Refs para campos del formulario
    const idRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    const latitudeRef = useRef();
    const longitudeRef = useRef();
    const radiusRef = useRef();

    // Estados para galería y zonas de servicio
    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();
    const [ubications, setUbications] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [zones, setZones] = useState(initialZones || []);

    const [mapInstance, setMapInstance] = useState(null);
    const [autocompleteInstance, setAutocompleteInstance] = useState(null);
    const subAutocompleteRefs = useRef([]);

    const [coordinate, setCoordinate] = useState({
        lat: -12.046374,
        lng: -77.042793,
    });
    const [radius, setRadius] = useState(5000);
    const [pickingIndex, setPickingIndex] = useState(null);
    const [activeTab, setActiveTab] = useState("general");

    const onMapLoad = (map) => {
        setMapInstance(map);
    };

    const onLoadAutocomplete = (autocomplete) => {
        setAutocompleteInstance(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocompleteInstance !== null) {
            const place = autocompleteInstance.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const newCoord = { lat, lng };
                setCoordinate(newCoord);
                mapInstance.panTo(newCoord);
                mapInstance.setZoom(17);

                latitudeRef.current.value = lat;
                longitudeRef.current.value = lng;
            }
        }
    };

    const onSubAutocompleteLoad = (autocomplete, index) => {
        subAutocompleteRefs.current[index] = autocomplete;
    };

    const onSubPlaceChanged = (index) => {
        const autocomplete = subAutocompleteRefs.current[index];
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address || place.name;

                const newUbications = [...ubications];
                newUbications[index].lat = lat;
                newUbications[index].lng = lng;
                newUbications[index].address = address;
                setUbications(newUbications);

                if (mapInstance) {
                    mapInstance.panTo({ lat, lng });
                    mapInstance.setZoom(17);
                }
            }
        }
    };

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (pickingIndex === null) {
            setCoordinate({ lat, lng });
            latitudeRef.current.value = lat;
            longitudeRef.current.value = lng;
        } else {
            const newUbications = [...ubications];
            newUbications[pickingIndex].lat = lat;
            newUbications[pickingIndex].lng = lng;
            setUbications(newUbications);
            setPickingIndex(null);
        }
    };

    useEffect(() => {
        if (!initialZones || initialZones.length === 0) {
            const getZones = async () => {
                const data = await zonesRest.paginate({
                    status: 1,
                    isLoadingAll: true,
                });
                setZones(Array.isArray(data) ? data : data?.data || []);
            };
            getZones();
        }
    }, [initialZones]);

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isNew: true,
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const removeGalleryImage = (index) => {
        setGallery((prev) => prev.filter((_, i) => i !== index));
    };

    const addUbication = () => {
        setUbications([...ubications, { address: "", lat: null, lng: null }]);
    };

    const updateUbication = (index, field, value) => {
        const newUbications = [...ubications];
        newUbications[index][field] = value;
        setUbications(newUbications);
    };

    const removeUbication = (index) => {
        const newUbications = ubications.filter((_, i) => i !== index);
        setUbications(newUbications);
        subAutocompleteRefs.current.splice(index, 1);
    };

    const onModalOpen = (data) => {
        setItemData(data || null);
        setIsEditing(!!data?.id);
        setPickingIndex(null);
        setActiveTab("general");
        subAutocompleteRefs.current = [];

        idRef.current.value = data?.id || "";
        titleRef.current.value = data?.title || "";
        descriptionRef.current.value = data?.description || "";
        latitudeRef.current.value = data?.latitude || "";
        longitudeRef.current.value = data?.longitude || "";
        radiusRef.current.value = data?.radius || 5000;
        setRadius(Number(data?.radius || 5000));

        $(modalRef.current)
            .find('[name="zip_codes"]')
            .val(data?.zip_codes || "");

        $(modalRef.current)
            .find('[name="zone_id"]')
            .val(data?.zone_id || "");

        const dc = data?.detailed_content || {};
        $(modalRef.current)
            .find('[name="dc_h1"]')
            .val(dc.h1 || "");
        $(modalRef.current)
            .find('[name="dc_hero_desc"]')
            .val(dc.hero_description || "");
        $(modalRef.current)
            .find('[name="dc_intro"]')
            .val(dc.intro || "");
        $(modalRef.current)
            .find('[name="dc_why_us_title"]')
            .val(dc.why_us_title || "");
        $(modalRef.current)
            .find('[name="dc_services_title"]')
            .val(dc.services_title || "");
        $(modalRef.current)
            .find('[name="dc_services_intro"]')
            .val(dc.services_intro || "");
        $(modalRef.current)
            .find('[name="dc_why_us"]')
            .val((dc.why_choose_us || []).join("\n"));
        $(modalRef.current)
            .find('[name="dc_diff_title"]')
            .val(dc.differentiator_title || "");
        $(modalRef.current)
            .find('[name="dc_diff_desc"]')
            .val(dc.differentiator_description || "");
        $(modalRef.current)
            .find('[name="dc_diff_items"]')
            .val((dc.differentiator_items || []).join("\n"));
        $(modalRef.current)
            .find('[name="dc_cov_msg"]')
            .val(dc.coverage_message || "");
        $(modalRef.current)
            .find('[name="dc_local_msg"]')
            .val(dc.local_message || "");
        $(modalRef.current)
            .find('[name="dc_final_msg"]')
            .val(dc.final_message || "");
        $(modalRef.current)
            .find('[name="dc_seo_block"]')
            .val(dc.seo_block || "");

        if (data?.gallery) {
            const existingImages = data.gallery.map((url) => ({
                url: `/api/facility/media/${url}`,
                isNew: false,
            }));
            setGallery(existingImages);
        } else {
            setGallery([]);
        }

        if (data?.ubications && Array.isArray(data.ubications)) {
            setUbications(
                data.ubications.map((u) => {
                    if (typeof u === "string") {
                        try {
                            const parsed = JSON.parse(u);
                            return {
                                address: parsed.address || u,
                                lat: parsed.lat || null,
                                lng: parsed.lng || null,
                            };
                        } catch (e) {
                            return { address: u, lat: null, lng: null };
                        }
                    }
                    return {
                        address: u.address || "",
                        lat: u.lat || null,
                        lng: u.lng || null,
                    };
                }),
            );
        } else {
            setUbications([]);
        }

        if (data?.latitude && data?.longitude) {
            setCoordinate({
                lat: Number(data.latitude),
                lng: Number(data.longitude),
            });
        } else {
            setCoordinate({ lat: -12.046374, lng: -77.042793 });
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(modalRef.current);

        // Individual overrides or complex packing
        const detailedContent = {
            h1: formData.get("dc_h1") || "",
            hero_description: formData.get("dc_hero_desc") || "",
            intro: formData.get("dc_intro") || "",
            why_us_title: formData.get("dc_why_us_title") || "",
            services_title: formData.get("dc_services_title") || "",
            services_intro: formData.get("dc_services_intro") || "",
            why_choose_us: (formData.get("dc_why_us") || "")
                .split("\n")
                .filter((x) => x.trim()),
            differentiator_title: formData.get("dc_diff_title") || "",
            differentiator_description: formData.get("dc_diff_desc") || "",
            differentiator_items: (formData.get("dc_diff_items") || "")
                .split("\n")
                .filter((x) => x.trim()),
            coverage_message: formData.get("dc_cov_msg") || "",
            local_message: formData.get("dc_local_msg") || "",
            final_message: formData.get("dc_final_msg") || "",
            seo_block: formData.get("dc_seo_block") || "",
        };

        formData.delete("detailed_content"); // remove empty if any
        formData.append("detailed_content", JSON.stringify(detailedContent));

        // Let's also ensure they are present as individual fields too
        Object.keys(detailedContent).forEach((key) => {
            const val = detailedContent[key];
            const finalVal = Array.isArray(val) ? val.join("\n") : val || "";
            if (!formData.has(`dc_${key}`)) {
                formData.append(`dc_${key}`, finalVal);
            }
        });

        // Let's also append separately to ensure they are picked up at top level
        Object.keys(detailedContent).forEach((key) => {
            const val = detailedContent[key];
            const finalVal = Array.isArray(val) ? val.join("\n") : val || "";
            formData.append(`dc_${key}`, finalVal);
        });

        if (isEditing) {
            formData.append("id", idRef.current.value);
        }

        gallery
            .filter((img) => img.isNew)
            .forEach((img, index) => {
                formData.append(`gallery[${index}]`, img.file);
            });

        const existingGallery = gallery
            .filter((img) => !img.isNew)
            .map((img) => img.url.split("/").pop());
        formData.append("existing_gallery", JSON.stringify(existingGallery));

        const validUbications = ubications.filter(
            (u) => u.address.trim() !== "",
        );
        formData.append("ubications", JSON.stringify(validUbications));

        formData.append("phones", JSON.stringify([]));
        formData.append("emails", JSON.stringify([]));
        formData.append("business_hours", JSON.stringify([]));
        formData.append("link", "");

        const result = await facilitiesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
        setUbications([]);
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await facilitiesRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                $(gridRef.current).dxDataGrid("instance").refresh();
            }
        } catch (error) {
            console.error("Error reordering facility:", error);
        }
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Centro de Servicio",
            text: "¿Estás seguro de eliminar este centro de servicio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await facilitiesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Zonas de Servicio"
                rest={facilitiesRest}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: "push",
                }}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar nueva zona de servicio",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: "asc",
                        sortIndex: 0,
                    },
                    {
                        dataField: "title",
                        caption: "Título",
                        width: "250px",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "400px" }}
                                    >
                                        {data.description}
                                    </div>,
                                ),
                            );
                        },
                    },
                    {
                        dataField: "ubications",
                        caption: "Zonas de Servicio",
                        cellTemplate: (container, { data }) => {
                            if (
                                !data.ubications ||
                                !Array.isArray(data.ubications)
                            )
                                return;
                            const count = data.ubications.length;
                            container.html(
                                `<span class="badge bg-soft-primary text-primary">${count} puntos marcados</span>`,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className:
                                        "btn btn-xs btn-soft-primary me-1",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                }),
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={
                    isEditing
                        ? "Editar Zona de Servicio"
                        : "Nueva Zona de Servicio"
                }
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />

                <ul className="nav nav-tabs nav-bordered mb-3" role="tablist">
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                            onClick={() => setActiveTab("general")}
                        >
                            <i className="fas fa-map-marked-alt me-1"></i> Zona
                            y Cobertura
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeTab === "landing" ? "active" : ""}`}
                            onClick={() => setActiveTab("landing")}
                        >
                            <i className="fas fa-globe me-1"></i> Custom Landing
                            Page (SEO)
                        </button>
                    </li>
                </ul>

                <LoadScript
                    googleMapsApiKey={Global.GMAPS_API_KEY}
                    libraries={libraries}
                >
                    <div className="tab-content">
                        {/* TAB 1: GENERAL INFO & MAP */}
                        <div
                            className={`tab-pane fade ${activeTab === "general" ? "show active" : ""}`}
                        >
                            <div className="row">
                                <div className="col-md-5">
                                    <InputFormGroup
                                        eRef={titleRef}
                                        name="title"
                                        label="Nombre del Centro"
                                        required
                                    />
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Sede / Distrito
                                        </label>
                                        <select
                                            name="zone_id"
                                            className="form-select"
                                            required
                                        >
                                            <option value="">
                                                Seleccione una sede
                                            </option>
                                            {zones.map((zone) => (
                                                <option
                                                    key={zone.id}
                                                    value={zone.id}
                                                >
                                                    {zone.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Descripción
                                        </label>
                                        <textarea
                                            ref={descriptionRef}
                                            name="description"
                                            className="form-control"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-6">
                                            <InputFormGroup
                                                eRef={latitudeRef}
                                                name="latitude"
                                                label="Latitud Central"
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-6">
                                            <InputFormGroup
                                                eRef={longitudeRef}
                                                name="longitude"
                                                label="Longitud Central"
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-12 mt-2">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Códigos Postales (Separados
                                                    por coma)
                                                </label>
                                                <textarea
                                                    name="zip_codes"
                                                    className="form-control"
                                                    rows={1}
                                                    placeholder="Ej: 91016, 91101, 91103"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mt-2">
                                            <InputFormGroup
                                                eRef={radiusRef}
                                                name="radius"
                                                label="Radio de Cobertura (metros)"
                                                type="number"
                                                onChange={(e) =>
                                                    setRadius(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label mb-0">
                                                Zonas de Atención
                                            </label>
                                            <button
                                                type="button"
                                                className="btn btn-xs btn-primary"
                                                onClick={addUbication}
                                            >
                                                <i className="fas fa-plus me-1"></i>{" "}
                                                Agregar Punto
                                            </button>
                                        </div>

                                        <div
                                            className="service-points-container overflow-auto"
                                            style={{ maxHeight: "300px" }}
                                        >
                                            {ubications.map(
                                                (ubication, index) => (
                                                    <div
                                                        key={index}
                                                        className="card border shadow-none mb-2 overflow-visible"
                                                    >
                                                        <div className="card-body p-2">
                                                            <div className="d-flex gap-1 mb-2">
                                                                <Autocomplete
                                                                    onLoad={(
                                                                        autocomplete,
                                                                    ) =>
                                                                        onSubAutocompleteLoad(
                                                                            autocomplete,
                                                                            index,
                                                                        )
                                                                    }
                                                                    onPlaceChanged={() =>
                                                                        onSubPlaceChanged(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="flex-grow-1"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Buscar lugar o dirección..."
                                                                        value={
                                                                            ubication.address
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateUbication(
                                                                                index,
                                                                                "address",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                </Autocomplete>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm ${pickingIndex === index ? "btn-warning" : "btn-outline-secondary"}`}
                                                                    onClick={() =>
                                                                        setPickingIndex(
                                                                            pickingIndex ===
                                                                                index
                                                                                ? null
                                                                                : index,
                                                                        )
                                                                    }
                                                                    title="Marcar punto manually on map"
                                                                >
                                                                    <i className="fas fa-crosshairs"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        removeUbication(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                            <div className="row g-1">
                                                                <div className="col-6">
                                                                    <small
                                                                        className="text-muted d-block font-monospace"
                                                                        style={{
                                                                            fontSize:
                                                                                "9px",
                                                                        }}
                                                                    >
                                                                        {ubication.lat
                                                                            ? `Lat: ${ubication.lat.toFixed(6)}`
                                                                            : "Lat: ---"}
                                                                    </small>
                                                                </div>
                                                                <div className="col-6 text-end">
                                                                    <small
                                                                        className="text-muted d-block font-monospace"
                                                                        style={{
                                                                            fontSize:
                                                                                "9px",
                                                                        }}
                                                                    >
                                                                        {ubication.lng
                                                                            ? `Lng: ${ubication.lng.toFixed(6)}`
                                                                            : "Lng: ---"}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                            {ubications.length === 0 && (
                                                <div className="text-center py-4 text-muted border rounded bg-light">
                                                    <small className="opacity-50 italic">
                                                        Haga clic en 'Agregar
                                                        Punto' para definir
                                                        zonas de atención.
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    <div className="mb-3">
                                        <label className="form-label d-flex justify-content-between">
                                            Visualización de Cobertura
                                            {pickingIndex !== null && (
                                                <span className="badge bg-warning text-dark animate-pulse border border-dark">
                                                    MODO MANUAL: Haga clic en el
                                                    mapa para ubicar{" "}
                                                    {ubications[pickingIndex]
                                                        ?.address ||
                                                        "Punto " +
                                                            (pickingIndex + 1)}
                                                </span>
                                            )}
                                        </label>

                                        <div className="mb-2">
                                            <Autocomplete
                                                onLoad={onLoadAutocomplete}
                                                onPlaceChanged={onPlaceChanged}
                                            >
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar dirección principal del centro..."
                                                />
                                            </Autocomplete>
                                        </div>
                                        <GoogleMap
                                            mapContainerStyle={{
                                                width: "100%",
                                                height: "450px",
                                                borderRadius: "16px",
                                                border: "4px solid #f8f9fa",
                                            }}
                                            center={coordinate}
                                            zoom={14}
                                            onLoad={onMapLoad}
                                            onClick={handleMapClick}
                                            options={{
                                                streetViewControl: false,
                                                mapTypeControl: false,
                                                fullscreenControl: false,
                                            }}
                                        >
                                            <Marker
                                                position={coordinate}
                                                label={{
                                                    text: "P",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                }}
                                                title="Punto Principal"
                                            />
                                            <Circle
                                                center={coordinate}
                                                radius={radius}
                                                options={{
                                                    fillColor: "#1b3f90",
                                                    fillOpacity: 0.12,
                                                    strokeColor: "#1b3f90",
                                                    strokeOpacity: 0.6,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                            {ubications.map(
                                                (u, i) =>
                                                    u.lat &&
                                                    u.lng && (
                                                        <Marker
                                                            key={i}
                                                            position={{
                                                                lat: u.lat,
                                                                lng: u.lng,
                                                            }}
                                                            icon={{
                                                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                                            }}
                                                            title={u.address}
                                                            animation={
                                                                pickingIndex ===
                                                                i
                                                                    ? 1
                                                                    : 0
                                                            }
                                                        />
                                                    ),
                                            )}
                                        </GoogleMap>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Galería de Imágenes
                                        </label>
                                        <input
                                            type="file"
                                            ref={galleryRef}
                                            multiple
                                            accept="image/*"
                                            onChange={handleGalleryChange}
                                            className="form-control"
                                        />
                                        <div
                                            className="d-flex flex-wrap gap-2 mt-2"
                                            style={{
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {gallery.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="position-relative"
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                    }}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt="Preview"
                                                        className="h-100 w-100 object-fit-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-xs position-absolute top-0 end-0 m-1"
                                                        onClick={() =>
                                                            removeGalleryImage(
                                                                index,
                                                            )
                                                        }
                                                        style={{
                                                            width: "18px",
                                                            height: "18px",
                                                            padding: 0,
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 2: LANDING PAGE & SEO */}
                        <div
                            className={`tab-pane fade ${activeTab === "landing" ? "show active" : ""}`}
                        >
                            <div className="row text-start p-3">
                                <div className="col-md-6">
                                    <h6 className="font-bold text-primary mb-3">
                                        Hero & Header Content
                                    </h6>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Título H1 (con * para destacar)
                                        </label>
                                        <input
                                            name="dc_h1"
                                            className="form-control"
                                            placeholder={
                                                itemData?.title
                                                    ? `Professional in *${itemData.title}*`
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Descripción Hero (Bajada)
                                        </label>
                                        <textarea
                                            name="dc_hero_desc"
                                            className="form-control"
                                            rows={5}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Mensaje Local (Barra de color)
                                        </label>
                                        <input
                                            name="dc_local_msg"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Introducción Principal
                                        </label>
                                        <textarea
                                            name="dc_intro"
                                            className="form-control"
                                            rows={5}
                                        />
                                    </div>
                                    <h6 className="font-bold text-primary mb-3">
                                        Why Us Section Quality
                                    </h6>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Título Quality
                                                </label>
                                                <input
                                                    name="dc_why_us_title"
                                                    className="form-control"
                                                    placeholder="Unmatched *Quality* in..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Why Choose Us (Checklist - Uno por
                                            línea)
                                        </label>
                                        <textarea
                                            name="dc_why_us"
                                            className="form-control"
                                            rows={5}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <h6 className="font-bold text-primary mb-3">
                                        Differentiator & Services Intro
                                    </h6>
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Título Soluciones
                                            </label>
                                            <input
                                                name="dc_services_title"
                                                className="form-control"
                                                placeholder="Specialized *Solutions*"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Introducción a Servicios
                                        </label>
                                        <input
                                            name="dc_services_intro"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Título Differentiator
                                                </label>
                                                <input
                                                    name="dc_diff_title"
                                                    className="form-control"
                                                    placeholder="The Azamora Standard"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Descripción Corta
                                                </label>
                                                <textarea
                                                    name="dc_diff_desc"
                                                    className="form-control"
                                                    rows={5}
                                                    placeholder="Why we are the preferred choice..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Highlights (Uno por línea)
                                        </label>
                                        <textarea
                                            name="dc_diff_items"
                                            className="form-control"
                                            rows={5}
                                        />
                                    </div>

                                    <hr className="my-4" />
                                    <h6 className="font-bold text-primary mb-3">
                                        Footer & SEO Optimization
                                    </h6>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Mensaje Final (Cierre)
                                        </label>
                                        <input
                                            name="dc_final_msg"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Mensaje de Cobertura (Low Footer)
                                        </label>
                                        <input
                                            name="dc_cov_msg"
                                            className="form-control"
                                            placeholder="We proudly serve *Pasadena*..."
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="form-label">
                                            Bloque SEO Keywords
                                        </label>
                                        <textarea
                                            name="dc_seo_block"
                                            className="form-control"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadScript>
            </Modal>
            <style>
                {`
                .pac-container { z-index: 10000 !important; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: none; margin-top: 5px; }
                .pac-item { padding: 8px 12px; cursor: pointer; }
                .pac-item:hover { background-color: #f8f9fa; }
                .service-points-container::-webkit-scrollbar { width: 4px; }
                .service-points-container::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
                .overflow-visible { overflow: visible !important; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                `}
            </style>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Zonas de Servicio">
            <Facilities {...properties} />
        </BaseAdminto>,
    );
});
