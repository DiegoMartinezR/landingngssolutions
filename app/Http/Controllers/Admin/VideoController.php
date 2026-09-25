<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Video;
use Illuminate\Http\Request;
use SoDe\Extend\Response;
use Illuminate\Support\Facades\Storage;

class VideoController extends BasicController
{
    public $model = Video::class;
    public $reactView = 'Admin/Videos';
    public $videoFields = ['video'];
    public $softDeletion = false;

    public function delete(Request $request, string $id)
    {
        $response = new Response();
        try {
            $video = Video::findOrFail($id);
            
            if ($video->video) {
                $filePath = "videos/video/{$video->video}";
                if (Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }

            $deleted = $video->delete();
            if (!$deleted) throw new \Exception('No se ha eliminado el registro');

            $response->status = 200;
            $response->message = 'Video eliminado correctamente';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
