import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Swal from "sweetalert2";

import { renderToString } from "react-dom/server";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import LandingHomeRest from "../actions/Admin/LandingHomeRest";
import VideoFormGroup from "../components/Adminto/form/VideoFormGroup";

const landingHomeRest = new LandingHomeRest();

const LandingHome = ({ items }) => {
    console.log(items);
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();

    const videoRef = useRef();
    const linkRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const is_videoRef = useRef();
    const [isVideo, setIsVideo] = useState(false); // Estado para controlar si se está usando un video en lugar de una imagen

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";

        titleRef.current.value = data?.title ?? "";
        descriptionRef.current.value = data?.description ?? "";

        linkRef.current.value = data?.link ?? "";
        // Para establecer el video existente
        if (data?.is_video) {
            $(is_videoRef.current).prop("checked", false).trigger("click");
            setTimeout(() => {
                if (videoRef.current && data?.video) {
                    videoRef.current.setVideoSrc(
                        `/api/landing_home/video/${data.video}`
                    );
                }
            }, 100);
            setIsVideo(true); // Asegúrate de actualizar el estado isVideo
        } else {
            $(is_videoRef.current).prop("checked", true).trigger("click");
            imageRef.image.src = `/api/landing_home/media/${data?.image}`;
            imageRef.current.value = null;
            setIsVideo(false);
        }
        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = {
                id: idRef.current.value || undefined,
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                link: linkRef.current.value,
                is_video: is_videoRef.current.checked ? 1 : 0,
            };

            const formData = new FormData();
            for (const key in request) {
                formData.append(key, request[key]);
            }
            if (isVideo) {
                // Obtener el archivo de video
                // Para obtener el archivo de video
                if (videoRef.current) {
                    const videoFile = videoRef.current.getFile();
                    if (videoFile) {
                        formData.append("video", videoFile);
                    }
                }
            } else {
                const file = imageRef.current.files[0];
                if (file) {
                    formData.append("image", file);
                }
                formData.append("video", null);
            }

            const result = await landingHomeRest.save(formData);
            console.log(result);
            if (!result) return;

            console.log("Refrescando tabla...");
            $(gridRef.current).dxDataGrid("instance").refresh();

            console.log("Cerrando modal...");
            $(modalRef.current).modal("hide");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
            });
        }
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await landingHomeRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar sección",
            text: "¿Estás seguro de eliminar este sección?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await landingHomeRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Landing Home"
                rest={landingHomeRest}
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
                            text: "Nuevo sección",
                            hint: "Nuevo sección",
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
                        dataField: "image",
                        caption: "Imagen",
                        width: "100px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                data.is_video ? (
                                    <video
                                        src={`/api/landing_home/video/${data.video}`}
                                        autoPlay
                                        style={{
                                            width: "100px",
                                            height: "48px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            borderRadius: "4px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                ) : (
                                    <img
                                        src={`/api/landing_home/media/${data.image}`}
                                        style={{
                                            width: "100px",
                                            height: "48px",

                                            objectFit: "cover",
                                            objectPosition: "center",
                                            borderRadius: "4px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                )
                            );
                        },
                    },
                    {
                        dataField: "title",
                        caption: "Contenido",
                        width: "50%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                data.title ? (
                                    <p
                                        className="mb-0"
                                        style={{ width: "100%" }}
                                    >
                                        <b className="d-block">{data.title}</b>
                                    </p>
                                ) : (
                                    <i className="text-muted">
                                        - Sin contenido textual -
                                    </i>
                                )
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Contenido",
                        width: "50%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                data.description ? (
                                    <p
                                        className="mb-0"
                                        style={{ width: "100%" }}
                                    >
                                        <small
                                            className="text-wrap text-muted"
                                            style={{
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 2,
                                            }}
                                        >
                                            {data.description}
                                        </small>
                                    </p>
                                ) : (
                                    <i className="text-muted">
                                        - Sin contenido textual -
                                    </i>
                                )
                            );
                        },
                    },

                    {
                        dataField: "link",
                        caption: "Link",
                        cellTemplate: (container, { data }) => {
                            if (data.link) {
                                container.html(
                                    renderToString(
                                        <a href={data.link}>{data.link}</a>
                                    )
                                );
                            } else {
                                container.html(
                                    renderToString(
                                        <i className="text-muted">
                                            - Sin link -
                                        </i>
                                    )
                                );
                            }
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible}
                                    onChange={(e) =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: e.target.checked,
                                        })
                                    }
                                />
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
                                    title: "Editar",
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
                title={isEditing ? "Editar sección" : "Agregar sección"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="principal-container">
                    <input ref={idRef} type="hidden" />

                    <div className="col-md-6">
                        <TextareaFormGroup
                            eRef={titleRef}
                            label="Título"
                            rows={1}
                        />
                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                            rows={3}
                        />
                        <InputFormGroup eRef={linkRef} label="Link" />
                        <SwitchFormGroup
                            eRef={is_videoRef}
                            onChange={(e) => setIsVideo(e.target.checked)}
                            label="Usar video en lugar de imagen"
                            specification="Solo se mostrará el video en la sección"
                        />
                    </div>
                    <div className="col-md-6">
                        {!isVideo ? (
                            <ImageFormGroup
                                eRef={imageRef}
                                label="Imagen"
                                col="col-12"
                                aspect={16 / 9}
                                fit="contain"
                            />
                        ) : (
                            <VideoFormGroup
                                eRef={videoRef}
                                label="Selecciona un video"
                                col="col-12"
                            />
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
