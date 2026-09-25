import axios from "axios";
import BasicRest from "../BasicRest";

class ComplaintsRest extends BasicRest {
    path = "admin/complaints";

    async getAttachments(complaintId) {
        // Corregido el nombre del parámetro
        // console.log("Fetching attachments for complaint ID:", complaintId);
        try {
            const response = await axios.get(
                `/api/${this.path}/${complaintId}/attachments`
            );

            if (response.data && Array.isArray(response.data)) {
                return response.data.map((file) => ({
                    ...file,
                    fileIcon: this.getFileIcon(
                        file.mime_type,
                        file.nombre_archivo
                    ),
                    fileSizeFormatted: this.formatFileSize(file.tamanio),
                }));
            }
            return [];
        } catch (error) {
            console.error("Error fetching attachments:", error);
            throw this.handleError(error);
        }
    }

    async updateEstado(id, estado) {
        try {
            const response = await axios.patch(
                `/api/${this.path}/${id}/update-estado`,
                { estado }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating estado:", error);
            throw this.handleError(error);
        }
    }

    getFileIcon(mimeType, fileName) {
        const extension = fileName.split(".").pop().toLowerCase();

        if (mimeType.includes("pdf")) return "fa-file-pdf text-danger";
        if (mimeType.includes("image")) return "fa-file-image text-primary";
        if (mimeType.includes("word")) return "fa-file-word text-info";
        if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
            return "fa-file-excel text-success";

        switch (extension) {
            case "doc":
            case "docx":
                return "fa-file-word text-info";
            case "xls":
            case "xlsx":
                return "fa-file-excel text-success";
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return "fa-file-image text-primary";
            case "pdf":
                return "fa-file-pdf text-danger";
            default:
                return "fa-file text-secondary";
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
    }

    handleError(error) {
        if (error.response) {
            // Error de servidor con respuesta
            return new Error(
                error.response.data.message ||
                    `Error del servidor: ${error.response.status}`
            );
        } else if (error.request) {
            // La solicitud fue hecha pero no hubo respuesta
            return new Error("No se recibió respuesta del servidor");
        } else {
            // Error al configurar la solicitud
            return new Error("Error al configurar la solicitud");
        }
    }
}

export default ComplaintsRest;
