<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ComplaintAttachment extends Model
{
    protected $fillable = [
        'complaint_id',
        'nombre_archivo',
        'ruta_archivo',
        'mime_type',
        'tamanio'
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function getFileIconAttribute()
    {
        $extension = pathinfo($this->nombre_archivo, PATHINFO_EXTENSION);

        switch (strtolower($extension)) {
            case 'pdf':
                return 'fa-file-pdf text-danger';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'fa-file-image text-primary';
            case 'doc':
            case 'docx':
                return 'fa-file-word text-info';
            case 'xls':
            case 'xlsx':
                return 'fa-file-excel text-success';
            default:
                return 'fa-file text-secondary';
        }
    }

    public function getFileSizeFormattedAttribute()
    {
        $bytes = $this->tamanio;
        if ($bytes >= 1073741824) return number_format($bytes / 1073741824, 2) . ' GB';
        elseif ($bytes >= 1048576) return number_format($bytes / 1048576, 2) . ' MB';
        elseif ($bytes >= 1024) return number_format($bytes / 1024, 2) . ' KB';
        elseif ($bytes > 1) return $bytes . ' bytes';
        elseif ($bytes == 1) return $bytes . ' byte';
        else return '0 bytes';
    }

    public function getPublicUrlAttribute()
    {
        // Verificar si el archivo existe
        if (!Storage::exists($this->ruta_archivo)) {
            return null;
        }

        // Generar URL basada en tu configuración actual
        return url('storage/' . $this->ruta_archivo);
    }
}
