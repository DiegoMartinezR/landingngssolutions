import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "../Components/Adminto/Base";
import {
    Users,
    MessageSquare,
    TrendingUp,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    MousePointerClick,
} from "lucide-react";
import {
    Chart as ChartJS,
    registerables,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(...registerables);

const Home = ({ session, metrics }) => {
    const {
        totalVisits,
        todayVisits,
        totalLeads,
        todayLeads,
        conversionRate,
        charts,
        utmSources,
        currentRange,
        startDate: initialStartDate,
        endDate: initialEndDate,
    } = metrics || {
        totalVisits: 0,
        todayVisits: 0,
        totalLeads: 0,
        todayLeads: 0,
        conversionRate: 0,
        charts: { visits: [], leads: [] },
        utmSources: [],
        currentRange: "mes_actual",
        startDate: "",
        endDate: "",
    };

    const [range, setRange] = useState(currentRange);
    const [customStart, setCustomStart] = useState(initialStartDate);
    const [customEnd, setCustomEnd] = useState(initialEndDate);

    const handleRangeChange = (e) => {
        const val = e.target.value;
        setRange(val);
        if (val !== "personalizar") {
            window.location.href = `?range=${val}`;
        }
    };

    const handleCustomFilter = () => {
        window.location.href = `?range=personalizar&start_date=${customStart}&end_date=${customEnd}`;
    };

    const visitChartData = {
        labels: charts.visits.map((d) => d.date),
        datasets: [
            {
                type: "line",
                label: "Visitas",
                data: charts.visits.map((d) => d.count),
                borderColor: "#f7b23b",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 3,
                pointBackgroundColor: "#f7b23b",
                pointRadius: 3,
                fill: true,
                tension: 0.4,
                yAxisID: "y",
            },
            {
                type: "bar",
                label: "Leads",
                data: charts.leads.map((d) => d.count),
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderRadius: 5,
                yAxisID: "y1",
            },
        ],
    };

    const utmData = {
        labels: utmSources.map((s) => s.source),
        datasets: [
            {
                label: "Visitas por Fuente",
                data: utmSources.map((s) => s.count),
                backgroundColor: [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(245, 158, 11, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                    "rgba(139, 92, 246, 0.8)",
                ],
            },
        ],
    };

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h4 className="mb-1">Bienvenido, {session.name} 👋</h4>
                    <p className="text-muted mb-0">
                        Aquí tienes un resumen del rendimiento de tu sitio web.
                    </p>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                        {range === "personalizar" && (
                            <div className="d-flex gap-2 align-items-center me-2 animate__animated animate__fadeIn">
                                <input
                                    type="date"
                                    className="form-control form-control-sm border-0 shadow-sm"
                                    value={customStart}
                                    onChange={(e) => setCustomStart(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                                <span className="text-muted small">al</span>
                                <input
                                    type="date"
                                    className="form-control form-control-sm border-0 shadow-sm"
                                    value={customEnd}
                                    onChange={(e) => setCustomEnd(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                                <button
                                    onClick={handleCustomFilter}
                                    className="btn btn-sm btn-primary shadow-sm rounded-3 px-3"
                                >
                                    Filtrar
                                </button>
                            </div>
                        )}

                        <div className="dropdown custom-dashboard-dropdown">
                            <button 
                                className="btn btn-white bg-white border-0 shadow-sm rounded-3 px-3 py-2 d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <TrendingUp size={16} className="text-primary" />
                                <span className="small fw-bold text-dark">
                                    {range === "mes_actual" && "Mes actual"}
                                    {range === "hoy" && "Hoy"}
                                    {range === "ayer" && "Ayer"}
                                    {range === "3_dias" && "Hace 3 días"}
                                    {range === "semana_pasada" && "La semana pasada"}
                                    {range === "2_semanas" && "Hace 2 semanas"}
                                    {range === "personalizar" && "Personalizar"}
                                </span>
                                <ArrowDownRight size={14} className="text-muted" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2 rounded-4 animate__animated animate__fadeIn animate__faster">
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === 'mes_actual' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: 'mes_actual'}})}>Mes actual</button></li>
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === 'hoy' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: 'hoy'}})}>Hoy</button></li>
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === 'ayer' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: 'ayer'}})}>Ayer</button></li>
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === '3_dias' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: '3_dias'}})}>Hace 3 días</button></li>
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === 'semana_pasada' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: 'semana_pasada'}})}>La semana pasada</button></li>
                                <li><button className={`dropdown-item rounded-3 mb-1 ${range === '2_semanas' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: '2_semanas'}})}>Hace 2 semanas</button></li>
                                <li><hr className="dropdown-divider opacity-50" /></li>
                                <li><button className={`dropdown-item rounded-3 ${range === 'personalizar' ? 'active' : ''}`} onClick={() => handleRangeChange({target: {value: 'personalizar'}})}>Personalizar</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                                    <Users className="text-primary" size={24} />
                                </div>
                                <span className="badge bg-soft-primary text-primary">
                                    +12.5%
                                </span>
                            </div>
                            <h6 className="text-muted text-uppercase small font-weight-bold mb-1">
                                Total Visitas
                            </h6>
                            <h2 className="mb-0">
                                {totalVisits.toLocaleString()}
                            </h2>
                            <p className="text-muted small mt-2 mb-0">
                                <span className="text-success font-weight-bold">
                                    {todayVisits}
                                </span>{" "}
                                hoy
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                                    <MessageSquare
                                        className="text-success"
                                        size={24}
                                    />
                                </div>
                                <span className="badge bg-soft-success text-success">
                                    +5.2%
                                </span>
                            </div>
                            <h6 className="text-muted text-uppercase small font-weight-bold mb-1">
                                Total Leads
                            </h6>
                            <h2 className="mb-0">
                                {totalLeads.toLocaleString()}
                            </h2>
                            <p className="text-muted small mt-2 mb-0">
                                <span className="text-success font-weight-bold">
                                    {todayLeads}
                                </span>{" "}
                                hoy
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                                    <TrendingUp
                                        className="text-warning"
                                        size={24}
                                    />
                                </div>
                                <span className="badge bg-soft-warning text-warning">
                                    Óptimo
                                </span>
                            </div>
                            <h6 className="text-muted text-uppercase small font-weight-bold mb-1">
                                Tasa de Conversión
                            </h6>
                            <h2 className="mb-0">{conversionRate}%</h2>
                            <p className="text-muted small mt-2 mb-0">
                                Visitas a Leads
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                                    <Globe className="text-info" size={24} />
                                </div>
                            </div>
                            <h6 className="text-muted text-uppercase small font-weight-bold mb-1">
                                Fuente Principal
                            </h6>
                            <h2 className="mb-0">
                                {utmSources[0]?.source || "Directo"}
                            </h2>
                            <p className="text-muted small mt-2 mb-0">
                                {utmSources[0]?.count || 0} visitas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h5 className="card-title mb-0">
                                    Rendimiento (Visitas vs Leads)
                                </h5>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm btn-light border"
                                        type="button"
                                    >
                                        Descargar Reporte
                                    </button>
                                </div>
                            </div>
                            <div style={{ height: "350px" }}>
                                <Bar
                                    data={visitChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: "top",
                                                align: "end",
                                                labels: {
                                                    boxWidth: 10,
                                                    usePointStyle: true,
                                                },
                                            },
                                            tooltip: {
                                                mode: "index",
                                                intersect: false,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                type: "linear",
                                                display: true,
                                                position: "left",
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: "Visitas",
                                                    color: "#3b82f6",
                                                    font: { weight: "bold" },
                                                },
                                                grid: {
                                                    borderDash: [5, 5],
                                                    color: "rgba(0,0,0,0.05)",
                                                },
                                            },
                                            y1: {
                                                type: "linear",
                                                display: true,
                                                position: "right",
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: "Leads",
                                                    color: "#10b981",
                                                    font: { weight: "bold" },
                                                },
                                                grid: {
                                                    drawOnChartArea: false,
                                                },
                                            },
                                            x: {
                                                grid: { display: false },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4">
                                Fuentes UTM (Top 5)
                            </h5>
                            <div style={{ height: "250px" }} className="mb-4">
                                <Doughnut
                                    data={utmData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: "bottom" },
                                        },
                                    }}
                                />
                            </div>
                            <div className="mt-2">
                                {utmSources.map((source, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center justify-content-between mb-2"
                                    >
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="bg-primary rounded-circle me-2"
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                }}
                                            ></div>
                                            <span className="small text-muted">
                                                {source.source}
                                            </span>
                                        </div>
                                        <span className="small font-weight-bold">
                                            {source.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="row mt-4">
                <div className="col-12 text-center py-4">
                    <a
                        href="/admin/messages"
                        className="btn btn-primary px-5 rounded-pill shadow-sm"
                    >
                        Ver Todos los Mensajes
                    </a>
                </div>
            </div>

            <style>{`
                .bg-soft-primary { background-color: rgba(59, 130, 246, 0.1); }
                .bg-soft-success { background-color: rgba(16, 185, 129, 0.1); }
                .bg-soft-warning { background-color: rgba(245, 158, 11, 0.1); }
                .font-weight-bold { font-weight: 700; }
                .card { border-radius: 1rem; transition: transform 0.3s ease; }
                .card:hover { transform: translateY(-5px); }
                
                .custom-dashboard-dropdown .dropdown-toggle::after { display: none; }
                .custom-dashboard-dropdown .dropdown-item { 
                    padding: 0.6rem 1rem; 
                    font-size: 0.85rem; 
                    font-weight: 500; 
                    transition: all 0.2s ease;
                    color: #4b5563;
                }
                .custom-dashboard-dropdown .dropdown-item:hover { 
                    background-color: #f3f4f6; 
                    color: #1f2937;
                    transform: translateX(3px);
                }
                .custom-dashboard-dropdown .dropdown-item.active { 
                    background-color: #3b82f6 !important; 
                    color: white !important; 
                }
                .btn-white { background: white; }
                .btn-white:hover { background: #f9fafb; }
            `}</style>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Dashboard">
            <Home {...properties} />
        </BaseAdminto>,
    );
});
