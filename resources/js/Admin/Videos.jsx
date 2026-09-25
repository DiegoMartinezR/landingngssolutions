import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import InputFormGroup from "../components/Adminto/form/InputFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import VideosRest from "../actions/Admin/VideosRest";
import VideoFormGroup from "../components/Adminto/form/VideoFormGroup";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";

const videosRest = new VideosRest();

const Videos = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    const idRef = useRef();
    const nameRef = useRef();
    const videoFileRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        
        if (videoFileRef.current) {
            videoFileRef.current.setVideoSrc("");
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (idRef.current.value) {
            formData.append("id", idRef.current.value);
        }
        formData.append("name", nameRef.current.value);

        if (videoFileRef.current) {
            const videoFile = videoFileRef.current.getFile();
            if (videoFile) {
                formData.append("video", videoFile);
            } else if (!isEditing) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: "Por favor, selecciona un video para subir",
                    type: "danger",
                });
                return;
            }
        }

        const result = await videosRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar video",
            text: "¿Estás seguro de eliminar este video? Se borrará físicamente del servidor.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await videosRest.delete(id);
        if (!result) return;
        
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const copyToClipboard = (filename) => {
        const url = window.location.origin + `/videos/video/${filename}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Correcto",
                    body: "¡Enlace copiado al portapapeles!",
                    type: "success",
                });
            })
            .catch((err) => {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: "Error al copiar enlace: " + err,
                    type: "danger",
                });
            });
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Mis videos"
                rest={videosRest}
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
                            text: "Subir video",
                            hint: "Subir un nuevo video",
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
                        caption: "Nombre identificador",
                        width: "40%",
                    },
                    {
                        dataField: "video",
                        caption: "Previsualización y Enlace",
                        width: "45%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center gap-3">
                                    <video
                                        src={`/videos/video/${data.video}`}
                                        style={{
                                            width: "120px",
                                            height: "70px",
                                            objectFit: "cover",
                                            background: "#000",
                                            borderRadius: "4px",
                                        }}
                                        preload="metadata"
                                        controls
                                    />
                                    <div className="flex-grow-1">
                                        <code className="d-block mb-1 text-muted" style={{ fontSize: "11px", wordBreak: "break-all" }}>
                                            {window.location.origin + `/videos/video/${data.video}`}
                                        </code>
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-outline-primary"
                                            onClick={() => copyToClipboard(data.video)}
                                        >
                                            <i className="mdi mdi-content-copy me-1"></i>
                                            Copiar Enlace
                                        </button>
                                    </div>
                                </div>
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar nombre",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar nombre del video" : "Subir nuevo video"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row">
                    <input ref={idRef} type="hidden" />
                    
                    <InputFormGroup
                        eRef={nameRef}
                        label="Nombre Identificador"
                        col="col-12"
                        placeholder="Ej. Video Hero Principal"
                        required
                    />

                    {!isEditing && (
                        <>
                            <VideoFormGroup
                                eRef={videoFileRef}
                                label="Selecciona el archivo de video (MP4)"
                                col="col-12"
                                required
                            />
                            <div className="col-12 mt-2">
                                <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: "12px" }}>
                                    <i className="mdi mdi-information-outline me-1"></i>
                                    <strong>Tip de Optimización:</strong> Para que el video cargue e inicie de forma instantánea en la web (streaming continuo), asegúrate de que el archivo esté optimizado para web con <strong>FastStart</strong> (moov atom al inicio). Puedes usar herramientas gratuitas como Handbrake.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mis videos">
            <Videos {...properties} />
        </BaseAdminto>
    );
});
