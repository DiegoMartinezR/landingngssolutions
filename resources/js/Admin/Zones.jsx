import React, { useEffect, useRef, useState } from "react";
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
import ZonesRest from "../actions/Admin/ZonesRest";
import {
    GoogleMap,
    LoadScript,
    Marker,
    Autocomplete,
    Circle,
} from "@react-google-maps/api";
import Global from "../Utils/Global";

const zonesRest = new ZonesRest();
const libraries = ["places"];

const Zones = () => {
    const [itemData, setItemData] = useState([]);
    const gridRef = useRef();
    const modalRef = useRef();

    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();

    const latitudeRef = useRef();
    const longitudeRef = useRef();
    const radiusRef = useRef();

    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    const [mapInstance, setMapInstance] = useState(null);
    const [autocompleteInstance, setAutocompleteInstance] = useState(null);
    const [coordinate, setCoordinate] = useState({
        lat: -12.046374,
        lng: -77.042793,
    }); // Center of Lima or default
    const [radius, setRadius] = useState(5000);

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

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setCoordinate({ lat, lng });
        latitudeRef.current.value = lat;
        longitudeRef.current.value = lng;
    };

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

    const onModalOpen = (data) => {
        setItemData(data || null);
        setIsEditing(!!data?.id);

        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        descriptionRef.current.value = data?.description || "";

        latitudeRef.current.value = data?.latitude || "";
        longitudeRef.current.value = data?.longitude || "";
        radiusRef.current.value = data?.radius || 5000;
        setRadius(Number(data?.radius || 5000));

        if (data?.gallery) {
            const existingImages = data.gallery.map((url) => ({
                url: `/api/zone/media/${url}`,
                isNew: false,
            }));
            setGallery(existingImages);
        } else {
            setGallery([]);
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

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("description", descriptionRef.current.value);

        formData.append("latitude", latitudeRef.current.value || "");
        formData.append("longitude", longitudeRef.current.value || "");
        formData.append("radius", radiusRef.current.value || 5000);

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

        const result = await zonesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await zonesRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                $(gridRef.current).dxDataGrid("instance").refresh();
            }
        } catch (error) {
            console.error("Error reordering zone:", error);
        }
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Zona",
            text: "¿Estás seguro de eliminar esta zona?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await zonesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Zonas / Sedes"
                rest={zonesRest}
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
                            hint: "Agregar nueva zona",
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
                        dataField: "name",
                        caption: "Nombre",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "300px" }}
                                    >
                                        {data.description}
                                    </div>,
                                ),
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
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
                title={isEditing ? "Editar Zona" : "Nueva Zona"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                <div className="row">
                    <div className="col-md-12">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre de la Zona"
                            required
                        />
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                ref={descriptionRef}
                                className="form-control"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <InputFormGroup
                                    eRef={latitudeRef}
                                    label="Latitud"
                                    readOnly={true}
                                />
                            </div>
                            <div className="col-md-4">
                                <InputFormGroup
                                    eRef={longitudeRef}
                                    label="Longitud"
                                    readOnly={true}
                                />
                            </div>
                            <div className="col-md-4">
                                <InputFormGroup
                                    eRef={radiusRef}
                                    label="Radio (metros)"
                                    type="number"
                                    onChange={(e) =>
                                        setRadius(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Ubicación en el mapa
                            </label>
                            <LoadScript
                                googleMapsApiKey={Global.GMAPS_API_KEY}
                                libraries={libraries}
                            >
                                <div className="mb-2">
                                    <Autocomplete
                                        onLoad={onLoadAutocomplete}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Buscar lugar..."
                                        />
                                    </Autocomplete>
                                </div>
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "8px",
                                    }}
                                    center={coordinate}
                                    zoom={15}
                                    onLoad={onMapLoad}
                                    onClick={handleMapClick}
                                    options={{
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                    }}
                                >
                                    <Marker position={coordinate} />
                                    <Circle
                                        center={coordinate}
                                        radius={radius}
                                        options={{
                                            fillColor: "#1b3f90",
                                            fillOpacity: 0.2,
                                            strokeColor: "#1b3f90",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 2,
                                        }}
                                    />
                                </GoogleMap>
                            </LoadScript>
                            <small className="text-muted">
                                Busca un lugar o haz clic en el mapa para marcar
                                la ubicación.
                            </small>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Galería de imágenes
                            </label>
                            <input
                                type="file"
                                ref={galleryRef}
                                multiple
                                accept="image/*"
                                onChange={handleGalleryChange}
                                className="form-control"
                            />
                            <div className="d-flex flex-wrap gap-2 mt-2">
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
                                            className="img-thumbnail h-100 w-100 object-fit-cover"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-xs position-absolute top-0 end-0"
                                            onClick={() =>
                                                removeGalleryImage(index)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <style>
                {`
                    .pac-container {
                        z-index: 10000 !important;
                    }
                `}
            </style>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Zonas">
            <Zones {...properties} />
        </BaseAdminto>,
    );
});
