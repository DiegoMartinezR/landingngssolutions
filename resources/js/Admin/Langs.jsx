import React, { useContext, useRef, useState } from "react";
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

import Swal from "sweetalert2";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import LangsRest from "../actions/Admin/LangsRest";
import { LanguageContext, LanguageProvider } from "../context/LanguageContext";

const langsRest = new LangsRest();

const Langs = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const imageRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        // imageRef.current.value = data?.image ?? "";
        imageRef.image.src = `/api/lang/media/${data?.image}`;
        imageRef.current.value = null;
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            // image: imageRef.current.value,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };
        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }

        const result = await langsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onStatusChange = async ({ id, status }) => {
        const result = await langsRest.status({ id, status });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await langsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar idioma",
            text: "¿Estas seguro de eliminar este idioma?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await langsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const { changeLanguage } = useContext(LanguageContext);

    const onUseLanguage = async (langData) => {
        try {
            // Obtén el token CSRF de las cookies automáticamente
            const response = await fetch("/set-current-lang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // Función para obtenerlo
                },
                body: JSON.stringify({ lang_id: langData.id }),
                credentials: "include", // Permite enviar cookies
            });

            if (response.ok) {
                await changeLanguage(langData); // ✅ Agrega await aquí
                window.location.reload(); // ⚠️ Opcional temporal para forzar actualización
            } else {
                console.error("Error:", await response.text());
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Función para extraer el token de la cookie
    const getCsrfTokenFromCookie = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookie ? decodeURIComponent(cookie[1]) : null;
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Idiomas"
                rest={langsRest}
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
                            text: "Nuevo idioma",
                            hint: "Nuevo idioma",
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
                        width: "60px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/lang/media/${data.image}`}
                                    style={{
                                        width: "50px",
                                        aspectRatio: 1,
                                        objectFit: "contain",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                />
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Titulo",
                    },

                    {
                        dataField: "description",
                        caption: "Descripción",
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
                                />
                            );
                        },
                    },
                    // {
                    //   dataField: 'status',
                    //   caption: 'Estado',
                    //   dataType: 'boolean',
                    //   cellTemplate: (container, { data }) => {
                    //     switch (data.status) {
                    //       case 1:
                    //         ReactAppend(container, <span className='badge bg-success rounded-pill'>Activo</span>)
                    //         break
                    //       case 0:
                    //         ReactAppend(container, <span className='badge bg-danger rounded-pill'>Inactivo</span>)
                    //         break
                    //       default:
                    //         ReactAppend(container, <span className='badge bg-dark rounded-pill'>Eliminado</span>)
                    //         break
                    //     }
                    //   }
                    // },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            /*  container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-success",
                                    title: "Usar",
                                    icon: "fa fa-check",
                                    onClick: () => onUseLanguage(data),
                                })
                            );*/
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
                title={isEditing ? "Editar idioma" : "Agregar idioma"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="indicators-container">
                    <input ref={idRef} type="hidden" />
                    <ImageFormGroup
                        eRef={imageRef}
                        label="Imagen"
                        aspect={16 / 9}
                        fit="cover"
                        required
                        col="col-sm-6"
                    />
                    <div className="col-md-6">
                        <InputFormGroup eRef={nameRef} label="Título" />
                        {/*<InputFormGroup eRef={imageRef} label='Símbolo' col='col-sm-4' rows={2} required />*/}
                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <LanguageProvider>
            <BaseAdminto {...properties} title="Idiomas">
                <Langs {...properties} />
            </BaseAdminto>
        </LanguageProvider>
    );
});
