import React from "react";

const FileViewer = ({ file, onClose }) => {
    console.log(file);
    const renderFileContent = () => {
        // Verificar si es PDF
        if (file.mime_type === "application/pdf") {
            return (
                <div style={{ height: "70vh" }}>
                    <iframe
                        src={file.ruta_archivo}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title={`Vista previa de ${file.nombre_archivo}`}
                    />
                </div>
            );
        }

        // Verificar si es imagen
        if (file.mime_type.startsWith("image/")) {
            return (
                <div className="text-center">
                    <img
                        src={file.ruta_archivo}
                        alt={file.nombre_archivo}
                        className="img-fluid"
                        style={{ maxHeight: "70vh" }}
                    />
                </div>
            );
        }

        // Para otros tipos de archivo
        return (
            <div className="text-center py-5">
                <i className={`fas ${file.fileIcon} fa-5x mb-3`}></i>
                <p className="mb-3">
                    No hay vista previa disponible para este tipo de archivo
                </p>
                <a
                    href={file.ruta_archivo}
                    className="btn btn-primary"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fas fa-download mr-2"></i> Descargar Archivo
                </a>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-4">
                <p className="mb-1">
                    <strong>Nombre:</strong> {file.nombre_archivo}
                </p>
                <p className="mb-1">
                    <strong>Tipo:</strong> {file.mime_type}
                </p>
                <p className="mb-1">
                    <strong>Tamaño:</strong> {file.fileSizeFormatted}
                </p>
            </div>

            <div className="mb-4" style={{ minHeight: "300px" }}>
                {renderFileContent()}
            </div>

            <div className="text-right">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default FileViewer;
