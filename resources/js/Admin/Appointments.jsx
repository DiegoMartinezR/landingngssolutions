import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "@Utils/CreateReactScript";
import Table from "../Components/Table";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "@Utils/ReactAppend";

import Modal from "@Adminto/Modal";
import Swal from "sweetalert2";
import AppointmentsRest from "../actions/Admin/AppointmentsRest";

const appointmentsRest = new AppointmentsRest();

const Appointments = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    const [dataLoaded, setDataLoaded] = useState(null);

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar cita",
            text: "¿Estas seguro de eliminar este cita?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await appointmentsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onModalOpen = (data) => {
        if (!data.seen) {
            appointmentsRest.boolean({
                id: data,
                field: "seen",
                value: true,
            });
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
        setDataLoaded(data);
        $(modalRef.current).modal("show");
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Appointments"
                rest={appointmentsRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refresh table",
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
                        dataField: "name",
                        caption: "Name",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span
                                    style={{
                                        width: "100%",
                                        fontWeight: data.seen
                                            ? "lighter"
                                            : "bold",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onModalOpen(data)}
                                >
                                    {data.name}
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "email",
                        caption: "Email",
                    },
                    {
                        dataField: "service.title",
                        caption: "Service",
                        cellTemplate: (container, { data }) => {
                            container.text(data.service?.title || '-');
                        }
                    },
                    {
                        dataField: "date",
                        caption: "Appt. Date",
                        dataType: "date",
                    },
                    {
                        dataField: "time",
                        caption: "Time",
                    },
                    {
                        dataField: "property_type",
                        caption: "Property",
                    },
                    {
                        dataField: "created_at",
                        caption: "Created At",
                        dataType: "datetime",
                        format: "yyyy-MM-dd HH:mm:ss",
                        sortOrder: "desc",
                    },
                    {
                        dataField: "status",
                        caption: "Status",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            if (data.seen) {
                                ReactAppend(
                                    container,
                                    <span className="badge bg-success rounded-pill">
                                        Read
                                    </span>
                                );
                            } else {
                                ReactAppend(
                                    container,
                                    <span className="badge bg-danger rounded-pill">
                                        Unread
                                    </span>
                                );
                            }
                        },
                    },
                    {
                        caption: "Actions",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-dark",
                                    title: "View details",
                                    icon: "fa fa-eye",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Delete",
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
            <Modal modalRef={modalRef} title="Appointment Details" hideFooter size="xl">
                <div className="p-2">
                    {/* Header Section */}
                    <div className="bg-light p-4 rounded-4 mb-4 border d-flex justify-content-between align-items-center shadow-sm">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="mdi mdi-calendar-check fs-2 text-primary"></i>
                            </div>
                            <div>
                                <h4 className="mb-1 fw-bold text-dark">
                                    {dataLoaded?.name} {dataLoaded?.lastname_father} {dataLoaded?.lastname_mother}
                                </h4>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-soft-info text-info border border-info px-3 py-1 fs-13">
                                        <i className="mdi mdi-broom me-1"></i>
                                        {dataLoaded?.service?.title || 'General Cleaning'}
                                    </span>
                                    <span className="text-muted small">
                                        <i className="mdi mdi-clock-outline me-1"></i>
                                        {new Date(dataLoaded?.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {dataLoaded?.seen ? (
                                <div className="text-center">
                                    <span className="badge bg-success rounded-pill px-3 py-2 fs-12 mb-1 d-block shadow-sm">
                                        <i className="mdi mdi-check-all me-1"></i> REVIEWED
                                    </span>
                                    <small className="text-muted fw-semibold uppercase tracking-wider">Status: Processed</small>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <span className="badge bg-danger rounded-pill px-3 py-2 fs-12 mb-1 d-block shadow-sm animate-pulse">
                                        <i className="mdi mdi-alert-circle-outline me-1"></i> NEW REQUEST
                                    </span>
                                    <small className="text-muted fw-semibold uppercase tracking-wider">Status: Pending</small>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Column 1: Client Profile */}
                        <div className="col-lg-4">
                            <div className="card border shadow-none rounded-4 h-100 mb-0 overflow-hidden">
                                <div className="card-header bg-white border-bottom py-3">
                                    <h5 className="card-title mb-0 fs-16 fw-bold">
                                        <i className="mdi mdi-account-card-details-outline text-primary me-2"></i>
                                        Client Profile
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    {dataLoaded?.company && (
                                        <div className="mb-4">
                                            <label className="text-muted text-uppercase fw-bold fs-11 tracking-wider mb-1 d-block">Company Name</label>
                                            <div className="fs-5 fw-bold text-dark">{dataLoaded?.company}</div>
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="text-muted text-uppercase fw-bold fs-11 tracking-wider mb-1 d-block">Contact Name</label>
                                        <div className="fs-5 fw-semibold text-dark">{dataLoaded?.name} {dataLoaded?.lastname_father}</div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-muted text-uppercase fw-bold fs-11 tracking-wider mb-1 d-block">Communication</label>
                                        <div className="d-flex flex-column gap-2 mt-2">
                                            <a href={`mailto:${dataLoaded?.email}`} className="btn btn-sm btn-soft-primary text-start px-3 py-2 rounded-3 border-0">
                                                <i className="mdi mdi-email-outline me-2"></i>
                                                {dataLoaded?.email || 'N/A'}
                                            </a>
                                            <a href={`tel:${dataLoaded?.number}`} className="btn btn-sm btn-soft-success text-start px-3 py-2 rounded-3 border-0">
                                                <i className="mdi mdi-whatsapp me-2"></i>
                                                {dataLoaded?.number || 'N/A'}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-top mt-auto">
                                        <label className="text-muted text-uppercase fw-bold fs-11 tracking-wider mb-1 d-block">Official Identification</label>
                                        <span className="fw-medium text-dark fs-14">
                                            <i className="mdi mdi-card-account-details-outline me-2 text-primary"></i>
                                            {dataLoaded?.document || 'Not Provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Appointment Space */}
                        <div className="col-lg-8">
                            <div className="row g-4 h-100">
                                {/* Top: Schedule & Location */}
                                <div className="col-12">
                                    <div className="card border shadow-none rounded-4 mb-0 overflow-hidden">
                                        <div className="card-header bg-white border-bottom py-3">
                                            <h5 className="card-title mb-0 fs-16 fw-bold">
                                                <i className="mdi mdi-progress-clock text-info me-2"></i>
                                                Service Schedule & Location
                                            </h5>
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="row align-items-center">
                                                <div className="col-md-5">
                                                    <div className="p-3 bg-light rounded-4 text-center border">
                                                        <div className="text-muted text-uppercase fw-bold fs-10 tracking-wider mb-1">Appointment Date</div>
                                                        <div className="fs-3 fw-bold text-primary mb-0">{dataLoaded?.date}</div>
                                                        <div className="badge bg-primary px-3 rounded-pill mt-1">{dataLoaded?.time}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-1 d-none d-md-flex justify-content-center">
                                                    <i className="mdi mdi-arrow-right fs-4 text-muted"></i>
                                                </div>
                                                <div className="col-md-6 mt-3 mt-md-0">
                                                    <label className="text-muted text-uppercase fw-bold fs-11 tracking-wider mb-2 d-block">Service Address</label>
                                                    <div className="d-flex">
                                                        <div className="bg-soft-danger p-2 rounded-3 me-3 h-100">
                                                            <i className="mdi mdi-map-marker-radius fs-4 text-danger"></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold fs-15 text-dark mb-1">{dataLoaded?.address || 'N/A'}</div>
                                                            <div className="text-muted fs-14">
                                                                {dataLoaded?.city} {dataLoaded?.zip ? `- Zip: ${dataLoaded?.zip}` : ''}
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="badge bg-soft-primary text-primary px-2 fs-12 border border-primary border-opacity-25">
                                                                    <i className="mdi mdi-home-modern me-1"></i>
                                                                    {dataLoaded?.property_type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Details Grid */}
                                <div className="col-12">
                                    <div className="card border shadow-none rounded-4 mb-0 bg-light-subtle">
                                        <div className="card-body p-4">
                                                <div className="row g-4 text-center">
                                                    <div className="col-6 col-md-3">
                                                        <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
                                                            <i className="mdi mdi-ruler-square fs-4 text-primary mb-2 d-block"></i>
                                                            <label className="text-muted fs-11 text-uppercase fw-bold d-block mb-1">Service Area</label>
                                                            <span className="fs-15 fw-bold text-dark">{dataLoaded?.sqft || '-'}<small className="ms-1 text-muted">sq.ft</small></span>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
                                                            <i className="mdi mdi-layers-outline fs-4 text-success mb-2 d-block"></i>
                                                            <label className="text-muted fs-11 text-uppercase fw-bold d-block mb-1">Total Floors</label>
                                                            <span className="fs-15 fw-bold text-dark">{dataLoaded?.floors || '1'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
                                                            <i className="mdi mdi-refresh fs-4 text-info mb-2 d-block"></i>
                                                            <label className="text-muted fs-11 text-uppercase fw-bold d-block mb-1">Frequency</label>
                                                            <span className="fs-15 fw-bold text-dark text-capitalize">{dataLoaded?.frequency || 'One Time'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
                                                            <i className="mdi mdi-paw fs-4 text-warning mb-2 d-block"></i>
                                                            <label className="text-muted fs-11 text-uppercase fw-bold d-block mb-1">Has Pets</label>
                                                            <span className="fs-15 fw-bold text-dark">{dataLoaded?.has_pets || dataLoaded?.pets || 'No'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            {/* Extended Details Grid */}
                                            {(dataLoaded?.cleaning_type || dataLoaded?.service_mode || dataLoaded?.project_category || dataLoaded?.extra_services || dataLoaded?.rooms) && (
                                                <div className="row g-3 mt-2">
                                                    {dataLoaded?.rooms && (
                                                        <div className="col-md-6">
                                                            <div className="p-2 border-start border-primary border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Rooms & Bathrooms</small>
                                                                <span className="fs-13 fw-bold">{dataLoaded.rooms} Rooms / {dataLoaded.bathrooms} Baths</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.cleaning_type && (
                                                        <div className="col-md-6">
                                                            <div className="p-2 border-start border-info border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Cleaning / Move Type</small>
                                                                <span className="fs-13 fw-bold">{dataLoaded.cleaning_type} {dataLoaded.move_type ? `- ${dataLoaded.move_type}` : ''}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.service_mode && (
                                                        <div className="col-md-6">
                                                            <div className="p-2 border-start border-success border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Service Mode & Freq</small>
                                                                <span className="fs-13 fw-bold">{dataLoaded.service_mode} {dataLoaded.rental_frequency ? `(${dataLoaded.rental_frequency})` : ''} {dataLoaded.frequency ? `(${dataLoaded.frequency})` : ''}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.is_empty && (
                                                        <div className="col-md-6">
                                                            <div className="p-2 border-start border-warning border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Property Status</small>
                                                                <span className="fs-13 fw-bold">{dataLoaded.is_empty}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.project_category && (
                                                        <div className="col-md-12">
                                                            <div className="p-2 border-start border-danger border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Post-Construction Details</small>
                                                                <span className="fs-13 fw-bold">{dataLoaded.project_category} - {dataLoaded.current_stage} stage ({dataLoaded.residue_level} residue)</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.extra_services && (
                                                        <div className="col-md-12">
                                                            <div className="p-2 border-start border-dark border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Extra Services</small>
                                                                <span className="fs-12 fw-semibold text-wrap">{dataLoaded.extra_services}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.access_method && (
                                                        <div className="col-md-12">
                                                            <div className="p-2 border-start border-secondary border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Access method</small>
                                                                <span className="fs-12 fw-semibold">{dataLoaded.access_method}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataLoaded?.pet_type && (
                                                        <div className="col-md-12">
                                                            <div className="p-2 border-start border-secondary border-3 bg-white rounded shadow-sm">
                                                                <small className="text-muted d-block fs-10 fw-bold uppercase">Pet Details</small>
                                                                <span className="fs-12 fw-semibold">{dataLoaded.pet_type} ({dataLoaded.pet_count}) {dataLoaded.pet_details ? `- ${dataLoaded.pet_details}` : ''}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="col-12 mt-auto">
                                    <div className="card border shadow-none rounded-4 mb-0 overflow-hidden">
                                        <div className="card-header bg-white border-bottom py-2">
                                            <h6 className="mb-0 fs-14 fw-bold"><i className="mdi mdi-comment-text-outline me-2 text-muted"></i>Additional Notes from Client</h6>
                                        </div>
                                        <div className="card-body p-4 bg-light bg-opacity-50">
                                            {dataLoaded?.description ? (
                                                <div className="fs-15 text-dark leading-relaxed font-italic" style={{ whiteSpace: 'pre-wrap' }}>
                                                    "{dataLoaded.description}"
                                                </div>
                                            ) : (
                                                <span className="text-muted fs-14">No additional notes provided for this appointment.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Appointments">
            <Appointments {...properties} />
        </BaseAdminto>
    );
});
