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

import Swal from "sweetalert2";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SpecialitiesRest from "../actions/Admin/SpecialitiesRest";

const specialitiesRest = new SpecialitiesRest();

const Specialities = () => {
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
   
        imageRef.image.src = `/api/speciality/media/${data?.image}`;
        imageRef.current.value = null;
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
      
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

        const result = await specialitiesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onStatusChange = async ({ id, status }) => {
        const result = await specialitiesRest.status({ id, status });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await specialitiesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar enfoque",
            text: "¿Estas seguro de eliminar este enfoque?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await specialitiesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Enfoques"
                rest={specialitiesRest}
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
                            text: "Nueva enfoque",
                            hint: "Nueva enfoque",
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
                                    src={`/api/speciality/media/${data.image}`}
                                    style={{
                                        width: "50px",
                                        aspectRatio: 1,
                                        objectFit: "contain",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                />,
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
                        width: "800px",
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "100px",
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
                        width: "100px",
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
                title={isEditing ? "Editar enfoque" : "Agregar enfoque"}
                onSubmit={onModalSubmit}
                size="sm"
            >
                <div className="row" id="indicators-container">
                    <input ref={idRef} type="hidden" />
            
                    <div className="col-12">
                        <InputFormGroup eRef={nameRef} label="Título" />
                         <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                        />
                        <ImageFormGroup
                            eRef={imageRef}
                            label="Símbolo"
                            aspect={9 / 9}
                            fit="cover"
                            required
                           
                           
                        />
                      
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Enfoques">
            <Specialities {...properties} />
        </BaseAdminto>,
    );
});
