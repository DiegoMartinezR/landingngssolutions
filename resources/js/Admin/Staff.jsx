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
import StaffRest from "../actions/Admin/StaffRest";

const staffRest = new StaffRest();

const Staff = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Refs para campos del formulario
    const idRef = useRef();
    const nameRef = useRef();
    const jobRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();
    const bannerRef = useRef();

    const [characteristics, setCharacteristics] = useState([{ value: "" }]);
    const [socials, setSocials] = useState([{ value: "" }]);
    const [isEditing, setIsEditing] = useState(false);

    // Manejo de características
    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { value: "" }]);
    };

    const updateCharacteristic = (index, value) => {
        const newCharacteristics = [...characteristics];
        newCharacteristics[index].value = value;
        setCharacteristics(newCharacteristics);
    };

    const removeCharacteristic = (index) => {
        if (characteristics.length <= 1) return;
        const newCharacteristics = characteristics.filter(
            (_, i) => i !== index,
        );
        setCharacteristics(newCharacteristics);
    };
    // Manejo de redes sociales
    const addSocial = () => {
        setSocials([...socials, { value: "" }]);
    };
    const updateSocial = (index, value) => {
        const newSocials = [...socials];
        newSocials[index].value = value;
        setSocials(newSocials);
    };
    const removeSocial = (index) => {
        if (socials.length <= 1) return;
        const newSocials = socials.filter((_, i) => i !== index);
        setSocials(newSocials);
    };

    // Cargar datos al editar
    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);

        // Resetear formulario
        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        jobRef.current.value = data?.job || "";
        descriptionRef.current.value = data?.description || "";
        imageRef.current.value = null;
        imageRef.image.src = data?.image
            ? `/api/staff/media/${data.image}`
            : "/api/cover/thumbnail/null";

        bannerRef.current.value = null;
        bannerRef.image.src = data?.banner
            ? `/api/staff/media/${data.banner}`
            : "/api/cover/thumbnail/null";

        // Cargar características existentes
        if (data?.characteristics && data.characteristics.length > 0) {
            setCharacteristics(
                data.characteristics.map((item) => ({ value: item })),
            );
        } else {
            setCharacteristics([{ value: "" }]);
        }
        // Cargar redes sociales existentes
        if (data?.socials && data.socials.length > 0) {
            setSocials(data.socials.map((item) => ({ value: item })));
        } else {
            setSocials([{ value: "" }]);
        }

        $(modalRef.current).modal("show");
    };

    // Enviar formulario
    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("job", jobRef.current.value);
        formData.append("description", descriptionRef.current.value);

        // Si estamos editando, agregar el ID
        if (isEditing) {
            formData.append("id", idRef.current.value);
        }

        // Agregar imagen principal si existe
        if (imageRef.current.files[0]) {
            formData.append("image", imageRef.current.files[0]);
        }
        if (bannerRef.current.files[0]) {
            formData.append("banner", bannerRef.current.files[0]);
        }

        // Agregar características (filtrar vacías)
        const nonEmptyCharacteristics = characteristics
            .map((c) => c.value.trim())
            .filter((c) => c.length > 0);
        formData.append(
            "characteristics",
            JSON.stringify(nonEmptyCharacteristics),
        );
        // Agregar redes sociales (filtrar vacías)
        const nonEmptySocials = socials
            .map((s) => s.value.trim())
            .filter((s) => s.length > 0);
        formData.append("socials", JSON.stringify(nonEmptySocials));

        // Enviar al backend
        const result = await staffRest.save(formData);
        if (!result) return;

        // Limpiar y cerrar
        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
        setCharacteristics([{ value: "" }]);
    };

    // Resto de métodos (delete, boolean change, etc.)
    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Staff",
            text: "¿Estás seguro de eliminar este staff?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await staffRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Staff"
                rest={staffRest}
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
                            hint: "Agregar nuevo staff",
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
                        dataField: "job",
                        caption: "Puesto",
                        width: "200px",
                    },
                    { dataField: "name", caption: "Nombre", width: "200px" },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "800px" }}
                                    >
                                        {data.description}
                                    </div>,
                                ),
                            );
                        },
                    },
                    /*  {
                        dataField: "characteristics",
                        caption: "Características",
                        cellTemplate: (container, { data }) => {
                            if (!data.characteristics) return;
                            container.html(
                                renderToString(
                                    <ul
                                        className="m-0 ps-3"
                                        style={{ listStyle: "none" }}
                                    >
                                        {data.characteristics
                                            .slice(0, 2)
                                            .map((char, i) => (
                                                <li
                                                    key={i}
                                                    className="text-truncate"
                                                    style={{
                                                        maxWidth: "250px",
                                                    }}
                                                >
                                                    <small>• {char}</small>
                                                </li>
                                            ))}
                                        {data.characteristics.length > 2 && (
                                            <li>
                                                <small className="text-muted">
                                                    +
                                                    {data.characteristics
                                                        .length - 2}{" "}
                                                    más...
                                                </small>
                                            </li>
                                        )}
                                    </ul>
                                )
                            );
                        },
                    },*/
                    /* {
                        dataField: "socials",
                        caption: "Redes sociales",
                        cellTemplate: (container, { data }) => {
                            if (!data.socials) return;
                            container.html(
                                renderToString(
                                    <ul
                                        className="m-0 ps-3"
                                        style={{ listStyle: "none" }}
                                    >
                                        {data.socials
                                            .slice(0, 2)
                                            .map((char, i) => (
                                                <li
                                                    key={i}
                                                    className="text-truncate"
                                                    style={{
                                                        maxWidth: "250px",
                                                    }}
                                                >
                                                    <small>• {char}</small>
                                                </li>
                                            ))}
                                        {data.socials.length > 2 && (
                                            <li>
                                                <small className="text-muted">
                                                    +{data.socials.length - 2}{" "}
                                                    más...
                                                </small>
                                            </li>
                                        )}
                                    </ul>,
                                ),
                            );
                        },
                    },*/
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/staff/media/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "45px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/images/default-thumbnail.jpg")
                                    }
                                />,
                            );
                        },
                    },
                    {
                        dataField: "banner",
                        caption: "Universidad",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/staff/media/${data.banner}`}
                                    style={{
                                        width: "80px",
                                        height: "45px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/images/default-thumbnail.jpg")
                                    }
                                />,
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
                title={isEditing ? "Editar Staff" : "Nuevo Staff"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />

                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombres del staff"
                            required
                        />
                        <InputFormGroup
                            eRef={jobRef}
                            label="Puesto laboral"
                            required
                        />

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                ref={descriptionRef}
                                className="form-control"
                                rows={8}
                                required
                            />
                        </div>

                        <div className="mb-3" hidden>
                            <label className="form-label">
                                Características
                            </label>
                            {characteristics.map((char, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Egresada de la Universidad Nacional Federico Villarreal."
                                        value={char.value}
                                        onChange={(e) =>
                                            updateCharacteristic(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() =>
                                            removeCharacteristic(index)
                                        }
                                        disabled={characteristics.length <= 1}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addCharacteristic}
                            >
                                <i className="fas fa-plus me-1"></i> Agregar
                                característica
                            </button>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <ImageFormGroup
                            eRef={imageRef}
                            label="Imagen principal"
                            aspect={1}
                        />
                        <ImageFormGroup
                            eRef={bannerRef}
                            label="Universidad"
                            aspect={1}
                        />
                        <div className="mb-3" hidden>
                            <label className="form-label">Redes sociales</label>
                            {socials.map((social, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: https://web.facebook.com/nopainperu"
                                        value={social.value}
                                        onChange={(e) =>
                                            updateSocial(index, e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeSocial(index)}
                                        disabled={socials.length <= 1}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addSocial}
                            >
                                <i className="fas fa-plus me-1"></i> Agregar red
                                social
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Staffs">
            <Staff {...properties} />
        </BaseAdminto>,
    );
});
