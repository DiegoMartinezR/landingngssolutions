import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ItemsRest from "../Actions/Admin/ItemsRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency from "../Utils/Number2Currency";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";

const itemsRest = new ItemsRest();

const Items = ({ categories, brands }) => {
    const [itemData, setItemData] = useState([]);
    const gridRef = useRef();
    const modalRef = useRef();
    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();

    const nameRef = useRef();
    const summaryRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    const imageRef = useRef();
    const bgRef = useRef();
    const descriptionRef = useRef();
    const scoreRef = useRef();
    // Nuevos campos
    const stockRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedScore, setSelectedScore] = useState(null);
    /*ADD NEW LINES GALLERY */
    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const image = gallery[index];
        if (image.id) {
            // Si la imagen tiene ID, significa que está guardada en la base de datos.
            setGallery((prev) =>
                prev.map((img, i) =>
                    i === index ? { ...img, toDelete: true } : img
                )
            );
        } else {
            // Si es una imagen nueva, simplemente la eliminamos.
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };
    useEffect(() => {
        if (itemData && itemData.images) {
            const existingImages = itemData.images.map((img) => ({
                id: img.id, // ID de la imagen en la BD
                url: `/api/items/media/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        }
    }, [itemData]);

    const onModalOpen = (data) => {
        // console.log(data);
        setItemData(data || null); // Guardamos los datos en el estado
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id || "";
        $(categoryRef.current)
            .val(data?.category_id || null)
            .trigger("change");

        nameRef.current.value = data?.name || "";
        summaryRef.current.value = data?.summary || "";
        priceRef.current.value = data?.price || 0;
        discountRef.current.value = data?.discount || 0;

        $(scoreRef.current)
            .val(data?.score || null)
            .trigger("change");
        imageRef.current.value = null;
        imageRef.image.src = `/api/items/media/${data?.image ?? "undefined"}`;
        bgRef.current.value = null;
        bgRef.image.src = `/api/items/media/${data?.bg ?? "undefined"}`;

        descriptionRef.current.value = data?.description ?? "";

        if (data?.images) {
            const existingImages = data.images.map((img) => ({
                id: img.id, // ID de la imagen en la base de datos
                url: `/api/items/media/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        } else {
            setGallery([]); // Limpiar la galería si no hay imágenes
        }

        // Nuevos campos

        stockRef.current.value = data?.stock;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        let final_price = 0.0;
        let discount_percent = 0.0;
        if (discountRef.current.value && discountRef.current.value > 0) {
            final_price = discountRef.current.value;
            discount_percent =
                100 -
                (discountRef.current.value * 100) / priceRef.current.value;
        } else {
            final_price = priceRef.current.value;
            discount_percent = 0;
        }
        const request = {
            id: idRef.current.value || undefined,
            category_id: categoryRef.current.value,
            name: nameRef.current.value,
            summary: summaryRef.current.value,
            price: priceRef.current.value,
            discount: discountRef.current.value,
            description: descriptionRef.current.value,
            sotck: stockRef.current.value,
            score: scoreRef.current.value,
            final_price: final_price,
            discount_percent: discount_percent,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }

        const bg = bgRef.current.files[0];
        if (bg) {
            formData.append("bg", bg);
        }

        gallery.forEach((img, index) => {
            if (!img.toDelete) {
                if (img.file) {
                    formData.append(`gallery[${index}]`, img.file); // Imágenes nuevas
                } else {
                    formData.append(`gallery_ids[${index}]`, img.id); // IDs de imágenes existentes
                }
            }
        });

        const deletedImages = gallery
            .filter((img) => img.toDelete)
            .map((img) => parseInt(img.id, 10)); // Asegurar que sean enteros
        if (deletedImages.length > 0) {
            formData.append("deleted_images", JSON.stringify(deletedImages)); // Imágenes eliminadas
        }

        //console.log(formData);

        const result = await itemsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await itemsRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await itemsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Item",
            text: "¿Estás seguro de eliminar este item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await itemsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const scoreOptions = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
    ];
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Items"
                rest={itemsRest}
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
                            hint: "Agregar",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Items"
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "category.name",
                        caption: "Categoría",
                     cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block">
                                            {data.category?.name}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name}
                                        </small>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "category.name",
                        caption: "Categoria",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                     width: "50%",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b>{data.name}</b>
                                        <br />
                                        <span className="truncate">
                                            {data.summary}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },
               /*     {
                        dataField: "final_price",
                        caption: "Precio",
                        dataType: "number",
                        width: "75px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        {data.discount > 0 && (
                                            <small
                                                className="d-block text-muted"
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                            >
                                                S/.{Number2Currency(data.price)}
                                            </small>
                                        )}
                                        <span>
                                            S/.
                                            {Number2Currency(
                                                data.discount > 0
                                                    ? data.discount
                                                    : data.price
                                            )}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },*/
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/items/media/${data.image}`}
                                    style={{
                                        width: "80px",
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
                            );
                        },
                    },
                    {
                        dataField: "bg",
                        caption: "Fondo",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/items/media/${data.bg}`}
                                    style={{
                                        width: "80px",
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
                            );
                        },
                    },
                 /*   {
                        dataField: "is_new",
                        caption: "Nuevo",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.is_new}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_new",
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "offering",
                        caption: "En oferta",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.offering}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "offering",
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "recommended",
                        caption: "Recomendado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.recommended}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "recommended",
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "featured",
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },*/
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "80px",
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
                        width: "100px",
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
                title={isEditing ? "Editar Item" : "Agregar Item"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <div className="row" id="principal-container">
                    <input ref={idRef} type="hidden" />
                    
                    {/* Campos Visibles */}
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre"
                            required
                        />
                        <InputFormGroup eRef={summaryRef} label="Resumen" />
                        <SelectFormGroup
                            eRef={categoryRef}
                            label="Categoría"
                            required
                            dropdownParent="#principal-container"
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            {categories.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </SelectFormGroup>
                    </div>

                    <div className="col-md-6">
                        <div className="row">
                            <ImageFormGroup
                                eRef={imageRef}
                                label="Imagen"
                                aspect={1}
                                col="col-lg-6 col-md-12 col-sm-6"
                            />

                            <ImageFormGroup
                                eRef={bgRef}
                                label="Fondo (bg)"
                                aspect={1}
                                col="col-lg-6 col-md-12 col-sm-6"
                            />
                        </div>
                    </div>

                    {/* Campos Ocultos (No Usados en NGS Solutions) */}
                    <div className="d-none">
                        <InputFormGroup
                            label="Stock"
                            eRef={stockRef}
                            type="number"
                        />

                        <InputFormGroup
                            eRef={priceRef}
                            label="Precio"
                            type="number"
                            step="0.01"
                            required
                        />
                        <InputFormGroup
                            eRef={discountRef}
                            label="Descuento"
                            type="number"
                            step="0.01"
                        />
                        <SelectFormGroup
                            eRef={scoreRef}
                            label="Calificación"
                            required
                            dropdownParent="#principal-container"
                            onChange={(e) => setSelectedScore(e.target.value)}
                        >
                            {scoreOptions.map((score, index) => (
                                <option key={index} value={score.value}>
                                    {score.label}
                                </option>
                            ))}
                        </SelectFormGroup>

                        {/* Galeria Oculta */}
                        <input
                            id="input-item-gallery"
                            ref={galleryRef}
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleGalleryChange}
                        />
                        <div className="d-flex flex-wrap gap-1 mt-2">
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
                                        src={`${image.url}`}
                                        alt="preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                    <button
                                        className="btn btn-xs btn-danger position-absolute"
                                        style={{ top: 0, right: 0 }}
                                        onClick={(e) =>
                                            removeGalleryImage(e, index)
                                        }
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Descripción Oculta */}
                        <hr className="my-1" />
                        <label className="form-label">Descripción</label>
                        <textarea
                            ref={descriptionRef}
                            className="form-control"
                            placeholder="Descripción"
                        ></textarea>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Items">
            <Items {...properties} />
        </BaseAdminto>
    );
});
