import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import Swal from "sweetalert2";
import InputFormGroup from "@Adminto/form/InputFormGroup";
import TranslationsRest from "../Actions/Admin/TranslationsRest";
import SelectFormGroup from "@Adminto/form/SelectFormGroup";
import { renderToString } from "react-dom/server";

const translationsRest = new TranslationsRest();
const EditableCell = ({
    data,
    gridRef,
    isTranslationMode,
    current_lang_id,
    default_lang_id,
}) => {
    const [tempValue, setTempValue] = useState(data.value || data.value_base);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    // Determinar si está traducido
    const isTranslated = data.value !== null && data.value !== data.value_base;

    const handleSave = async () => {
        try {
            const payload = {
                group: data.group,
                key: data.key,
                value: tempValue,
                //  lang_id: data.lang_id,
            };

            if (isTranslationMode) {
                await translationsRest.translate(payload);
            } else {
                await translationsRest.save({ ...payload, id: data.id });
            }

            $(gridRef.current).dxDataGrid("instance").refresh();
            setIsEditing(false);
        } catch (error) {
            Notify.error("Error al guardar traducción");
        }
    };

    return (
        <div className="d-flex gap-2 align-items-center">
            {!isEditing && (
                <span className="text-nowrap">
                    {isTranslated ? (
                        <i className="fas fa-check text-success"></i>
                    ) : (
                        <i className="fas fa-times text-danger"></i>
                    )}
                </span>
            )}
            <input
                ref={inputRef}
                className="form-control flex-grow-1"
                value={tempValue}
                onChange={(e) => {
                    setTempValue(e.target.value);
                    setIsEditing(true);
                }}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setTimeout(() => setIsEditing(false), 200)}
            />
            {isEditing && (
                <button
                    className="btn btn-xs btn-soft-primary"
                    onClick={handleSave}
                >
                    {isTranslationMode ? (
                        <i className="fa fa-language"></i>
                    ) : (
                        <i className="fa fa-pen"></i>
                    )}
                </button>
            )}
        </div>
    );
};

const Translations = ({ current_lang_id, default_lang_id }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const groupRef = useRef();
    const keyRef = useRef();
    const valueRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";

        groupRef.current.value = data?.group ?? "";
        keyRef.current.value = data?.key ?? "";
        valueRef.current.value = data?.value_base ?? "";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            group: groupRef.current.value,
            key: keyRef.current.value,
            value: valueRef.current.value,
        };

        const result = await translationsRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await translationsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await translationsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    const isTranslationMode = current_lang_id !== default_lang_id;
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Traducciones"
                rest={translationsRest}
                remoteOperations={{
                    paging: true,
                    filtering: true,
                    sorting: true,
                }}
                toolBar={(container) => {
                    // ... (código existente)
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "group",
                        caption: "Grupo",
                        allowFiltering: false,
                        filterOperations: ["contains"],
                        filterType: "text",
                        cellTemplate: (container, { data }) => {
                            container.html(renderToString(<>{data.group}</>));
                        },
                    },
                    {
                        dataField: "key",
                        caption: "Clave",
                        allowFiltering: false,

                        filterOperations: ["contains"],
                        filterType: "text",
                        cellTemplate: (container, { data }) => {
                            container.html(renderToString(<>{data.key}</>));
                        },
                    },
                    {
                        dataField: "value_base",
                        caption: "Valor Español",
                        width: "200px",
                        allowFiltering: true,
                        filterOperations: ["contains"],
                        filterType: "text",
                    },
                    {
                        dataField: "is_translated",
                        caption: "Estado",
                        width: "80px",
                        allowFiltering: false,
                        filterType: "text",
                        cellTemplate: (container, { data }) => {
                            const isTranslated =
                                data.value && data.value !== data.value_base;
                            container.html(
                                renderToString(
                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{ height: "100%" }}
                                    >
                                        {isTranslated ? (
                                            <i
                                                className="fas fa-check-circle text-success"
                                                title="Traducido"
                                            ></i>
                                        ) : (
                                            <i
                                                className="fas fa-times-circle text-danger"
                                                title="Sin traducir"
                                            ></i>
                                        )}
                                    </div>
                                )
                            );
                        },
                        calculateFilterExpression: (
                            filterValue,
                            selectedFilterOperation
                        ) => {
                            if (filterValue === "traducido")
                                return ["is_translated", "=", true];
                            if (filterValue === "no traducido")
                                return ["is_translated", "=", false];
                            return null;
                        },
                    },
                    {
                        dataField: "value",
                        caption: isTranslationMode ? "Traducción" : "Valor",
                        allowFiltering: false, // No filtramos en esta columna
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <EditableCell
                                    data={data}
                                    gridRef={gridRef}
                                    isTranslationMode={isTranslationMode}
                                    current_lang_id={current_lang_id}
                                    default_lang_id={default_lang_id}
                                />
                            );
                        },
                    },
                ]}
                options={{
                    searchPanel: {
                        visible: true,
                        width: 240,
                        placeholder: "Buscar...",
                        highlightSearchText: true,
                    },
                    filterRow: {
                        visible: true,
                        applyFilter: "auto",
                    },
                    paging: {
                        pageSize: 10,
                    },
                    pager: {
                        showPageSizeSelector: true,
                        allowedPageSizes: [10, 25, 50, 100],
                        showInfo: true,
                    },
                }}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar traducción" : "Agregar traducción"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row" id="translations-container">
                    <input ref={idRef} type="hidden" />

                    <InputFormGroup
                        eRef={groupRef}
                        label="Grupo"
                        col="col-12"
                        required
                    />
                    <InputFormGroup
                        eRef={keyRef}
                        label="Clave"
                        col="col-6"
                        required
                    />
                    <InputFormGroup
                        eRef={valueRef}
                        label="Valor"
                        col="col-6"
                        required
                    />
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Traducciones">
            <Translations {...properties} />
        </BaseAdminto>
    );
});
