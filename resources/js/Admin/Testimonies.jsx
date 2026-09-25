import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/form/InputFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TestimoniesRest from "../Actions/Admin/TestimoniesRest";
import Swal from "sweetalert2";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";

const testimoniesRest = new TestimoniesRest();

const Testimonies = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const correlativeRef = useRef();
    const descriptionRef = useRef();
    const ratingRef = useRef();
    const imageRef = useRef();
    const imageSecondaryRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);
        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        correlativeRef.current.value = data?.correlative ?? "";
        descriptionRef.current.value = data?.description ?? "";
        ratingRef.current.value = data?.rating ?? 5;
        imageRef.image.src = `/api/testimony/media/${data?.image}`;
        imageRef.current.value = null;
        imageSecondaryRef.image.src = `/api/testimony/media/${data?.image_secondary}`;
        imageSecondaryRef.current.value = null;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            correlative: correlativeRef.current.value,
            description: descriptionRef.current.value,
            rating: ratingRef.current.value,
        };
        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }
        const fileSecondary = imageSecondaryRef.current.files[0];
        if (fileSecondary) {
            formData.append("image_secondary", fileSecondary);
        }

        const result = await testimoniesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onSyncGoogle = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "Sincronizar con Google",
            text: "¿Quieres importar las últimas reseñas de Google Places? Se guardarán como 'No Visibles' para tu revisión.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Sí, sincronizar",
            cancelButtonText: "Cancelar",
        });

        if (!isConfirmed) return;

        Swal.fire({
            title: "Sincronizando...",
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
        });

        const result = await testimoniesRest.syncGoogle();
        Swal.close();

        if (result && result.status == 200) {
            Swal.fire(
                "¡Éxito!",
                result.message ||
                    "Las reseñas se han sincronizado. Revisa la lista para activarlas.",
                "success",
            );
            $(gridRef.current).dxDataGrid("instance").refresh();
        } else {
            Swal.fire(
                "Error",
                result?.message ||
                    "No se pudo completar la sincronización. Revisa los logs o las llaves en el archivo .env.",
                "error",
            );
        }
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await testimoniesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar testimonio",
            text: "¿Estas seguro de eliminar este testimonio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await testimoniesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Testimonios"
                rest={testimoniesRest}
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
                    /*    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "fab fa-google",
                            text: "Sincronizar Google",
                            hint: "Importar reseñas de Google Places",
                            type: "default",
                            stylingMode: "outlined",
                            onClick: () => onSyncGoogle(),
                        },
                    });*/
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo testimonio",
                            hint: "Nuevo testimonio",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Autor",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <p className="mb-0" style={{ width: "100%" }}>
                                    <b className="d-block">{data.name}</b>
                                    <small className="text-nowrap text-muted truncate">
                                        {data.correlative}
                                    </small>
                                </p>,
                            );
                        },
                    },
                    {
                        dataField: "description",
                        caption: "Reseña",
                        width: "40%",
                    },
                    {
                        dataField: "rating",
                        caption: "Calificación",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <i
                                            key={i}
                                            className={`fa fa-star ${
                                                i < data.rating
                                                    ? "text-warning"
                                                    : "text-muted opacity-25"
                                            }`}
                                        />
                                    ))}
                                </div>,
                            );
                        },
                    },
                    {
                        dataField: "image",
                        caption: "Imágenes",
                        width: "120px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex gap-1">
                                    <img
                                        src={`/api/testimony/media/${data.image}`}
                                        title="Antes"
                                        style={{
                                            width: "50px",
                                            aspectRatio: 1,
                                            objectFit: "contain",
                                            objectPosition: "center",
                                            borderRadius: "4px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                    {data.image_secondary && (
                                        <img
                                            src={`/api/testimony/media/${data.image_secondary}`}
                                            title="Después"
                                            style={{
                                                width: "50px",
                                                aspectRatio: 1,
                                                objectFit: "contain",
                                                objectPosition: "center",
                                                borderRadius: "4px",
                                            }}
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                            }
                                        />
                                    )}
                                </div>,
                            );
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
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
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar testimonio" : "Agregar testimonio"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row" id="testimony-container">
                    <input ref={idRef} type="hidden" />
                    <ImageFormGroup
                        eRef={imageRef}
                        label="Foto Antes (Before)"
                        col="col-md-6"
                        aspect={1}
                        fit="contain"
                        required
                    />
                    <div className="col-md-6 hidden" hidden>
                    <ImageFormGroup
                        eRef={imageSecondaryRef}
                        label="Foto Después (After)"
                        col="col-md-6"
                        aspect={1}
                        fit="contain"
                    />
                    </div>

                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre"
                            required
                        />
                      
                        <label className="form-label">Calificación</label>
                        <select
                            ref={ratingRef}
                            className="form-select"
                            defaultValue={5}
                        >
                            <option value={5}>5 Estrellas</option>
                            <option value={4}>4 Estrellas</option>
                            <option value={3}>3 Estrellas</option>
                            <option value={2}>2 Estrellas</option>
                            <option value={1}>1 Estrella</option>
                        </select>
                  
                    </div>
                    <div className="col-md-12">
                        <InputFormGroup
                            eRef={correlativeRef}
                            label="Ubicación / Edad"
                            required
                        />
                    </div>
                    <TextareaFormGroup
                        type="text"
                        eRef={descriptionRef}
                        label="Descripción"
                        rows={3}
                        placeholder="Ingresa el texto del testimonio"
                        required
                        col="col-md-12"
                    />
                  
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Testimonios">
            <Testimonies {...properties} />
        </BaseAdminto>,
    );
});
