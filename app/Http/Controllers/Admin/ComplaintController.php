<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Validator;

class ComplaintController extends BasicController
{
    public $model = Complaint::class;
    public $reactView = 'Admin/Complaints';
    public function attachments($id)
    {
        // Verificar primero que el reclamo existe
        $complaint = Complaint::with('attachments')->find($id);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamo no encontrado'
            ], 404);
        }

        // Procesar adjuntos
        $attachments = $complaint->attachments->map(function ($attachment) {
            try {
                $filePath = str_replace('storage/', '', $attachment->ruta_archivo);
                $fileExists = Storage::disk('public')->exists($filePath);

                return [
                    'id' => $attachment->id,
                    'nombre_archivo' => $attachment->nombre_archivo,
                    'ruta_archivo' => $fileExists ?
                        asset('storage/' . $filePath) :
                        null,
                    'mime_type' => $attachment->mime_type,
                    'tamanio' => $attachment->tamanio,
                    'fileIcon' => $attachment->fileIcon,
                    'fileSizeFormatted' => $attachment->fileSizeFormatted,
                    'exists' => $fileExists
                ];
            } catch (\Exception $e) {
                // Registrar error pero continuar con otros archivos
                Log::error("Error procesando adjunto {$attachment->id}: " . $e->getMessage());
                return null;
            }
        })->filter(); // Eliminar elementos null

        return response()->json($attachments->values()); // Reindexar array
    }

    public function updateEstado(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:pendiente,en_proceso,resuelto,rechazado'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $complaint = Complaint::findOrFail($id);
        $complaint->estado = $request->estado;

        if (in_array($request->estado, ['resuelto', 'rechazado'])) {
            $complaint->fecha_respuesta = now();
        }

        $complaint->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
            'data' => $complaint->fresh()
        ]);
    }
}
