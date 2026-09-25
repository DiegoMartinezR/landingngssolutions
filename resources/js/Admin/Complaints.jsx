import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import DxButton from "../Components/dx/DxButton";
import SelectFormGroup from "../Components/form/SelectFormGroup";
import FileViewer from "./FileViewer";
import Swal from "sweetalert2";
import ComplaintsRest from "../actions/Admin/ComplaintsRest ";

const complaintsRest = new ComplaintsRest();

const Complaints = () => {
    const gridRef = useRef();
    const [selectedEstado, setSelectedEstado] = useState(null);
    const modalRef = useRef();
    const fileModalRef = useRef();
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [currentAttachment, setCurrentAttachment] = useState(null);
    const estadoRef = useRef();

    // Función para abrir el modal con los detalles del reclamo
    const onModalOpen = async (data) => {
        try {
            setCurrentComplaint(data);
            setAttachments([]);

            // Mostrar loading
            const loadingSwal = Swal.fire({
                title: "Cargando...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Cargar datos en paralelo
            const [attachmentsResult] = await Promise.all([
                complaintsRest.getAttachments(data.id),
                new Promise((resolve) => setTimeout(resolve, 500)), // mínimo 500ms para evitar flash
            ]);

            if (Array.isArray(attachmentsResult)) {
                setAttachments(attachmentsResult);
            } else {
                console.error(
                    "Formato de adjuntos inválido:",
                    attachmentsResult
                );
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "No se pudieron cargar los archivos adjuntos",
                });
            }

            await loadingSwal.close();
            $(modalRef.current).modal("show");
        } catch (error) {
            console.error("Error al abrir modal:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cargar la información del reclamo",
            });
        }
    };

    // Función para visualizar un archivo específico
    const onViewAttachment = (attachment) => {
        setCurrentAttachment(attachment);
        $(fileModalRef.current).modal("show");
    };

    // Función para actualizar el estado del reclamo
    const updateEstado = async () => {
        try {
            // Obtener el valor seleccionado del Select2
            const nuevoEstado = $(estadoRef.current).val();

            if (!currentComplaint || !nuevoEstado) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Datos incompletos para actualizar el estado",
                });
                return;
            }

            const updateResult = await complaintsRest.updateEstado(
                currentComplaint.id,
                nuevoEstado
            );

            if (updateResult.success) {
                // Actualizar UI
                setCurrentComplaint((prev) => ({
                    ...prev,
                    estado: nuevoEstado,
                }));

                $(gridRef.current).dxDataGrid("instance").refresh();
            } else {
                throw new Error(updateResult.message || "Error desconocido");
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudo actualizar el estado",
            });
        }
    };

    // Funciones auxiliares para formatear datos
    const formatDate = (dateString) => {
        if (!dateString) return "No especificada";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch (e) {
            console.error("Error formateando fecha:", e);
            return "Fecha inválida";
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "No especificada";
        try {
            const date = new Date(dateString);
            return date.toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            console.error("Error formateando fecha/hora:", e);
            return "Fecha/hora inválida";
        }
    };

    const getTipoDocumentoText = (tipo) => {
        const tipos = {
            dni: "DNI",
            ce: "Carné Extranjería",
            pasaporte: "Pasaporte",
            ruc: "RUC",
        };
        return tipos[tipo] || tipo.toUpperCase();
    };

    const getTipoReclamoText = (tipo) => {
        return tipo === "queja" ? "Queja" : "Reclamo";
    };

    const getEstadoClass = (estado) => {
        switch (estado) {
            case "pendiente":
                return "badge bg-warning";
            case "en_proceso":
                return "badge bg-info";
            case "resuelto":
                return "badge bg-success";
            case "rechazado":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const getEstadoText = (estado) => {
        const estados = {
            pendiente: "Pendiente",
            en_proceso: "En Proceso",
            resuelto: "Resuelto",
            rechazado: "Rechazado",
        };
        return estados[estado] || estado;
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar reclamo",
            text: "¿Estás seguro de eliminar este reclamo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await complaintsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Libro de Reclamaciones"
                rest={complaintsRest}
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
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "numero_reclamo",
                        caption: "N° Reclamo",
                        width: "10%",
                    },
                    {
                        dataField: "nombre_completo",
                        caption: "Consumidor",
                        cellTemplate: (container, { data }) => {
                            container.text(`${data.nombre} ${data.apellido}`);
                        },
                        width: "15%",
                    },
                    {
                        dataField: "tipo_documento",
                        caption: "Doc. Identidad",
                        cellTemplate: (container, { data }) => {
                            container.text(
                                `${getTipoDocumentoText(
                                    data.tipo_documento
                                )}: ${data.numero_documento}`
                            );
                        },
                        width: "12%",
                    },
                    {
                        dataField: "sede",
                        caption: "Sede",
                        width: "12%",
                    },
                    {
                        dataField: "tipo_reclamo",
                        caption: "Tipo",
                        cellTemplate: (container, { data }) => {
                            const tipoText = getTipoReclamoText(
                                data.tipo_reclamo
                            );
                            const tipoClass =
                                data.tipo_reclamo === "queja"
                                    ? "badge bg-info"
                                    : "badge bg-primary";
                            container.append(
                                `<span class="${tipoClass}">${tipoText}</span>`
                            );
                        },
                        width: "8%",
                    },
                    {
                        dataField: "fecha_incidente",
                        caption: "Fecha Incidente",
                        cellTemplate: (container, { data }) => {
                            container.text(formatDate(data.fecha_incidente));
                        },
                        width: "10%",
                    },
                    {
                        dataField: "estado",
                        caption: "Estado",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                `<span class="${getEstadoClass(
                                    data.estado
                                )}">${getEstadoText(data.estado)}</span>`
                            );
                        },
                        width: "10%",
                    },
                    {
                        dataField: "created_at",
                        caption: "Fecha Registro",
                        cellTemplate: (container, { data }) => {
                            container.text(formatDateTime(data.created_at));
                        },
                        width: "10%",
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Ver Detalles",
                                    icon: "fa fa-eye",
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
                        width: "13%",
                    },
                ]}
            />

            {/* Modal de detalles del reclamo */}
            <Modal
                modalRef={modalRef}
                title={`Reclamo #${currentComplaint?.numero_reclamo || ""}`}
                footer={true}
                size="lg"
                onSubmit={updateEstado}
            >
                <div className="row" id="principal-container">
                    {currentComplaint && (
                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <h4 className="border-bottom pb-2">
                                    Información Básica
                                </h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Número de Reclamo:</strong>{" "}
                                            {currentComplaint.numero_reclamo}
                                        </p>
                                        <p>
                                            <strong>Fecha Registro:</strong>{" "}
                                            {formatDateTime(
                                                currentComplaint.created_at
                                            )}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Tipo de Reclamo:</strong>{" "}
                                            <span
                                                className={
                                                    currentComplaint.tipo_reclamo ===
                                                    "queja"
                                                        ? "badge bg-info"
                                                        : "badge bg-primary"
                                                }
                                            >
                                                {getTipoReclamoText(
                                                    currentComplaint.tipo_reclamo
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Fecha Incidente:</strong>{" "}
                                            {formatDate(
                                                currentComplaint.fecha_incidente
                                            )}
                                        </p>
                                    </div>

                                    <SelectFormGroup
                                        col="col-md-12"
                                        label="Cambiar Estado"
                                        eRef={estadoRef}
                                        dropdownParent="#principal-container"
                                    >
                                        <option
                                            value="pendiente"
                                            selected={
                                                currentComplaint?.estado ===
                                                "pendiente"
                                            }
                                        >
                                            Pendiente
                                        </option>
                                        <option
                                            value="en_proceso"
                                            selected={
                                                currentComplaint?.estado ===
                                                "en_proceso"
                                            }
                                        >
                                            En Proceso
                                        </option>
                                        <option
                                            value="resuelto"
                                            selected={
                                                currentComplaint?.estado ===
                                                "resuelto"
                                            }
                                        >
                                            Resuelto
                                        </option>
                                        <option
                                            value="rechazado"
                                            selected={
                                                currentComplaint?.estado ===
                                                "rechazado"
                                            }
                                        >
                                            Rechazado
                                        </option>
                                    </SelectFormGroup>
                                </div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <h4 className="border-bottom pb-2">
                                    Datos del Consumidor
                                </h4>
                                <div className="pl-3">
                                    <p>
                                        <strong>Nombre:</strong>{" "}
                                        {currentComplaint.nombre}{" "}
                                        {currentComplaint.apellido}
                                    </p>
                                    <p>
                                        <strong>Documento:</strong>{" "}
                                        {getTipoDocumentoText(
                                            currentComplaint.tipo_documento
                                        )}{" "}
                                        {currentComplaint.numero_documento}
                                    </p>
                                    <p>
                                        <strong>Contacto:</strong> Tel:{" "}
                                        {currentComplaint.telefono} | Email:{" "}
                                        {currentComplaint.email}
                                    </p>
                                    <p>
                                        <strong>Dirección:</strong>{" "}
                                        {currentComplaint.direccion}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <h4 className="border-bottom pb-2">
                                    Detalles del Servicio
                                </h4>
                                <div className="pl-3">
                                    <p>
                                        <strong>Sede:</strong>{" "}
                                        {currentComplaint.sede}
                                    </p>
                                    <p>
                                        <strong>Servicio:</strong>{" "}
                                        {currentComplaint.servicio}
                                    </p>
                                    <p>
                                        <strong>Hora Incidente:</strong>{" "}
                                        {currentComplaint.hora_incidente ||
                                            "No especificada"}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-12 mb-4">
                                <h4 className="border-bottom pb-2">
                                    Descripción del Reclamo
                                </h4>
                                <div className="border p-3 bg-light rounded">
                                    <p style={{ whiteSpace: "pre-wrap" }}>
                                        {currentComplaint.detalle_reclamo}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-12 mb-4">
                                <h4 className="border-bottom pb-2">
                                    Pedido del Consumidor
                                </h4>
                                <div className="border p-3 bg-light rounded">
                                    <p style={{ whiteSpace: "pre-wrap" }}>
                                        {currentComplaint.pedido}
                                    </p>
                                </div>
                            </div>

                            {/*   <div className="col-md-12 mb-4">
                            <h4 className="border-bottom pb-2">
                                Archivos Adjuntos ({attachments.length})
                            </h4>
                            {attachments.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="card"
                                            style={{ width: "150px" }}
                                        >
                                            <div className="card-body text-center p-2">
                                                <i
                                                    className={`fas ${file.fileIcon} fa-3x mb-2`}
                                                ></i>
                                                <h6 className="card-title small text-truncate">
                                                    {file.nombre_archivo}
                                                </h6>
                                                <p className="card-text small text-muted">
                                                    {file.fileSizeFormatted}
                                                </p>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        onViewAttachment(file)
                                                    }
                                                >
                                                    Ver
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info mb-0">
                                    No hay archivos adjuntos para este reclamo
                                </div>
                            )}
                        </div>*/}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal para visualizar archivos */}
            {/*   <Modal
                modalRef={fileModalRef}
                title={`Archivo: ${currentAttachment?.nombre_archivo || ""}`}
                footer={false}
                size="lg"
            >
                {currentAttachment && (
                    <FileViewer
                        file={currentAttachment}
                        onClose={() => $(fileModalRef.current).modal("hide")}
                    />
                )}
            </Modal>*/}
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Libro de Reclamaciones">
            <Complaints {...properties} />
        </BaseAdminto>
    );
});
