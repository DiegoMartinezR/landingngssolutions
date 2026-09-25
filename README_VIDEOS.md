# Sistema de Gestión e Integración de Videos en Azamora

Este documento detalla a nivel técnico el funcionamiento del módulo de **Gestión de Videos** en la plataforma Azamora, explicando el flujo de datos desde la subida del archivo en el panel administrativo hasta su reproducción en la página de inicio (`Home.jsx`).

---

## 📋 Índice
1. [Flujo General de Datos (Arquitectura)](#-flujo-general-de-datos-arquitectura)
2. [Componentes del Backend (Laravel)](#-componentes-del-backend-laravel)
   - [Rutas del Sistema](#rutas-del-sistema)
   - [Modelo Eloquent (Video.php)](#modelo-eloquent-videophp)
   - [Controlador de Videos (VideoController.php)](#controlador-de-videos-videocontrollerphp)
   - [Controlador Base (BasicController.php)](#controlador-base-basiccontrollerphp)
3. [Componentes del Admin Panel (React)](#-componentes-del-admin-panel-react)
   - [Vista Administrativa (Videos.jsx)](#vista-administrativa-videosjsx)
   - [Servicio API (VideosRest.js)](#servicio-api-videosrestjs)
   - [Componente Formulario (VideoFormGroup.jsx)](#componente-formulario-videoformgroupjsx)
4. [Componentes del Frontend Público (React)](#-componentes-del-frontend-público-react)
   - [Renderizado del Video en Home (Home.jsx)](#renderizado-del-video-en-home-homejsx)
5. [Guía de Uso Paso a Paso](#-guía-de-uso-paso-a-paso)

---

## 🔄 Flujo General de Datos (Arquitectura)

El ciclo de vida de un video en la aplicación sigue estos pasos:

```mermaid
graph TD
    A[Videos.jsx: Subir Video MP4] -->|POST/FormData a admin/videos| B[VideoController & BasicController]
    B -->|Genera UUID y almacena en disco| C[public/videos/video/{UUID}.mp4]
    B -->|Guarda registro en base de datos| D[Tabla 'videos': id, name, video]
    E[Videos.jsx: Copiar Enlace] -->|Obtiene URL pública| F[URL: /videos/video/{UUID}.mp4]
    G[LandingHome.jsx: Editor de Secciones] -->|Habilita Video y Pega Enlace| H[Guarda en landing_homes]
    I[HomeController.php] -->|Consulta registros con page_home%| J[Home.jsx]
    J -->|Comprueba si is_video y renderiza| K[HTML5 <video> o iframe]
```

1. **Subida y Procesamiento:** El administrador selecciona un archivo de video en la sección "Mis videos" del panel de control. El backend procesa el archivo, genera un nombre único basado en UUID y lo mueve al directorio público.
2. **Obtención del Enlace:** En la tabla de administración, se genera un enlace público directo a ese video para que pueda ser copiado con un clic.
3. **Asignación en la Landing:** En el editor de secciones (ej. Hero de Inicio), el administrador activa la opción de video y pega la URL en el campo correspondiente.
4. **Renderizado en la Web:** Al cargar el Home, el frontend público lee la propiedad configurada del Hero. Si es un video local de la biblioteca, utiliza una etiqueta de reproducción nativa (`<video>`). Si es un video de YouTube, genera un reproductor dinámico adaptado (`<iframe>`).

---

## 🖥️ Componentes del Backend (Laravel)

El backend de Laravel actúa como API REST para manejar la carga de archivos, paginación, edición de metadatos y eliminación física de los videos.

### Rutas del Sistema

Las rutas están registradas tanto en la sección de la API pública/autenticada como en el servidor web.

**Rutas en `routes/web.php`:**
```php
// Carga del componente React para administrar videos
Route::middleware(['can:Admin', 'auth'])->prefix('admin')->group(function () {
    Route::get('/videos', [AdminVideoController::class, 'reactView'])->name('Admin/Videos.jsx');
});
```

**Rutas en `routes/api.php`:**
```php
Route::middleware('auth')->group(function () {
    Route::middleware('can:Admin')->prefix('admin')->group(function () {
        // Operaciones CRUD del recurso Videos
        Route::post('/videos', [AdminVideoController::class, 'save']);
        Route::post('/videos/paginate', [AdminVideoController::class, 'paginate']);
        Route::patch('/videos/status', [AdminVideoController::class, 'status']);
        Route::patch('/videos/{field}', [AdminVideoController::class, 'boolean']);
        Route::delete('/videos/{id}', [AdminVideoController::class, 'delete']);
    });
});
```
*(Nota: `AdminVideoController` está aliasado en la cabecera de las rutas como `use App\Http\Controllers\Admin\VideoController as AdminVideoController;`)*

---

### Modelo Eloquent (Video.php)
[Video.php](file:///c:/xampp/htdocs/projects/azamora_backend/app/Models/Video.php)

El modelo utiliza UUIDs de manera nativa para identificar de manera única cada recurso.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'video',
        'status',
        'visible'
    ];
}
```

---

### Controlador de Videos (VideoController.php)
[VideoController.php](file:///c:/xampp/htdocs/projects/azamora_backend/app/Http/Controllers/Admin/VideoController.php)

Extiende de `BasicController` para reutilizar operaciones comunes. Define qué columnas almacenan archivos multimedia y sobrescribe el método `delete` para asegurar la remoción física del archivo en el servidor.

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Video;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class VideoController extends BasicController
{
    public $model = Video::class;
    public $reactView = 'Admin/Videos';
    public $videoFields = ['video']; // Indica que el campo 'video' almacena archivos de video
    public $softDeletion = false;    // Desactiva la eliminación suave para borrar por completo el registro de la BD

    public function delete(Request $request, string $id)
    {
        $response = new Response();
        try {
            $video = Video::findOrFail($id);
            
            // Elimina físicamente el video guardado en la carpeta pública
            if ($video->video) {
                $filePath = public_path("videos/video/{$video->video}");
                if (file_exists($filePath)) {
                    unlink($filePath);
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
```

---

### Controlador Base (BasicController.php)
[BasicController.php](file:///c:/xampp/htdocs/projects/azamora_backend/app/Http/Controllers/BasicController.php)

Controla la subida masiva de archivos. A continuación se presentan los fragmentos clave que se encargan del procesamiento del video durante el método `save()`:

```php
// En BasicController.php (Líneas 39-40)
public $imageFields = [];
public $videoFields = []; // Campos que contienen archivos de video

// En el método save() (Líneas 795-809)
// Procesar videos
foreach ($this->videoFields as $field) {
  if (!$request->hasFile($field)) continue;
  $full = $request->file($field);
  $uuid = Crypto::randomUUID();
  $ext = $full->getClientOriginalExtension();
  
  // Genera la ruta en la carpeta pública. Ej: public/videos/video
  $dir = public_path("videos/{$snake_case}");
  if (!file_exists($dir)) {
    mkdir($dir, 0755, true);
  }
  
  $fileName = "{$uuid}.{$ext}";
  $full->move($dir, $fileName);
  $body[$field] = $fileName; // Guarda solo el nombre generado en la BD
}
```
*Explicación:* El controlador lee `$this->videoFields`. Si se detecta un archivo de video, lo guarda físicamente bajo la ruta `public/videos/{modelo_snake_case}/{uuid}.{extension}`. Para el modelo `Video`, el path resultante es `/public/videos/video/{uuid}.mp4`.

---

## 🎨 Componentes del Admin Panel (React)

### Vista Administrativa (Videos.jsx)
[Videos.jsx](file:///c:/xampp/htdocs/projects/azamora_backend/resources/js/Admin/Videos.jsx)

Este componente renderiza un CRUD interactivo para la gestión de los videos almacenados. Muestra una grilla interactiva, permite previsualizar el contenido en vivo, copiar el enlace y subir nuevos videos a través de un modal.

```jsx
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import InputFormGroup from "../components/Adminto/form/InputFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import VideosRest from "../actions/Admin/VideosRest";
import VideoFormGroup from "../components/Adminto/form/VideoFormGroup";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";

const videosRest = new VideosRest();

const Videos = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Referencias para los campos del formulario
    const idRef = useRef();
    const nameRef = useRef();
    const videoFileRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        
        // Limpiar previsualización del video al abrir modal
        if (videoFileRef.current) {
            videoFileRef.current.setVideoSrc("");
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (idRef.current.value) {
            formData.append("id", idRef.current.value);
        }
        formData.append("name", nameRef.current.value);

        // Adjuntar archivo de video
        if (videoFileRef.current) {
            const videoFile = videoFileRef.current.getFile();
            if (videoFile) {
                formData.append("video", videoFile);
            } else if (!isEditing) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: "Por favor, selecciona un video para subir",
                    type: "danger",
                });
                return;
            }
        }

        const result = await videosRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar video",
            text: "¿Estás seguro de eliminar este video? Se borrará físicamente del servidor.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await videosRest.delete(id);
        if (!result) return;
        
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Copiar la URL pública del video al portapapeles
    const copyToClipboard = (filename) => {
        const url = window.location.origin + `/videos/video/${filename}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Correcto",
                    body: "¡Enlace copiado al portapapeles!",
                    type: "success",
                });
            })
            .catch((err) => {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: "Error al copiar enlace: " + err,
                    type: "danger",
                });
            });
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Mis videos"
                rest={videosRest}
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
                            text: "Subir video",
                            hint: "Subir un nuevo video",
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
                        dataField: "name",
                        caption: "Nombre identificador",
                        width: "40%",
                    },
                    {
                        dataField: "video",
                        caption: "Previsualización y Enlace",
                        width: "45%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center gap-3">
                                    <video
                                        src={`/videos/video/${data.video}`}
                                        style={{
                                            width: "120px",
                                            height: "70px",
                                            objectFit: "cover",
                                            background: "#000",
                                            borderRadius: "4px",
                                        }}
                                        preload="metadata"
                                        controls
                                    />
                                    <div className="flex-grow-1">
                                        <code className="d-block mb-1 text-muted" style={{ fontSize: "11px", wordBreak: "break-all" }}>
                                            {window.location.origin + `/videos/video/${data.video}`}
                                        </code>
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-outline-primary"
                                            onClick={() => copyToClipboard(data.video)}
                                        >
                                            <i className="mdi mdi-content-copy me-1"></i>
                                            Copiar Enlace
                                        </button>
                                    </div>
                                </div>
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar nombre",
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
                title={isEditing ? "Editar nombre del video" : "Subir nuevo video"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row">
                    <input ref={idRef} type="hidden" />
                    
                    <InputFormGroup
                        eRef={nameRef}
                        label="Nombre Identificador"
                        col="col-12"
                        placeholder="Ej. Video Hero Principal"
                        required
                    />

                    {!isEditing && (
                        <>
                            <VideoFormGroup
                                eRef={videoFileRef}
                                label="Selecciona el archivo de video (MP4)"
                                col="col-12"
                                required
                            />
                            <div className="col-12 mt-2">
                                <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: "12px" }}>
                                    <i className="mdi mdi-information-outline me-1"></i>
                                    <strong>Tip de Optimización:</strong> Para que el video cargue e inicie de forma instantánea en la web (streaming continuo), asegúrate de que el archivo esté optimizado para web con <strong>FastStart</strong> (moov atom al inicio). Puedes usar herramientas gratuitas como Handbrake.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mis videos">
            <Videos {...properties} />
        </BaseAdminto>
    );
});
```

---

### Servicio API (VideosRest.js)
[VideosRest.js](file:///c:/xampp/htdocs/projects/azamora_backend/resources/js/actions/Admin/VideosRest.js)

Un servicio REST sencillo que extiende `BasicRest` para centralizar la comunicación de peticiones hacia la ruta del controlador `/admin/videos`.

```javascript
import BasicRest from "../BasicRest";

class VideosRest extends BasicRest {
    path = "admin/videos";
    hasFiles = true; // Activa las cabeceras multipart/form-data necesarias para el envío de archivos
}

export default VideosRest;
```

---

### Componente Formulario (VideoFormGroup.jsx)
[VideoFormGroup.jsx](file:///c:/xampp/htdocs/projects/azamora_backend/resources/js/components/Adminto/form/VideoFormGroup.jsx)

Wrapper personalizado para un input de archivo con previsualización HTML5 integrada, el cual genera un blob temporal en memoria para previsualizar de forma inmediata el video seleccionado por el usuario antes de enviarlo.

```jsx
import React, { useEffect, useRef, useState } from "react";

const VideoFormGroup = ({
    id,
    col = "col-12",
    label,
    eRef,
    required = false,
    onChange = () => {},
    onError = "/api/cover/thumbnail/null",
}) => {
    const [videoSrc, setVideoSrc] = useState("");
    const fileInputRef = useRef();
    const videoRef = useRef();

    // Expone funciones útiles al elemento padre usando una referencia
    useEffect(() => {
        if (eRef) {
            eRef.current = {
                getFile: () => fileInputRef.current.files[0],
                setVideoSrc: (src) => {
                    setVideoSrc(src);
                    videoRef.current.src = src;
                },
            };
        }
    }, [eRef]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file); // Genera una URL temporal del blob
            setVideoSrc(url);
            onChange(e);
        }
    };

    return (
        <div className={`form-group ${col} mb-1`}>
            <label htmlFor={id} className="mb-1">
                {label} {required && <b className="text-danger">*</b>}
            </label>

            {/* Elemento de previsualización */}
            <video
                ref={videoRef}
                controls
                src={videoSrc}
                style={{
                    width: "100%",
                    borderRadius: "4px",
                    background: "#000",
                    display: videoSrc ? "block" : "none",
                }}
                onError={(e) => {
                    e.target.src = onError;
                }}
            />

            <input
                id={id}
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileChange}
                className="form-control mt-2"
            />
        </div>
    );
};

export default VideoFormGroup;
```

---

## 🖥️ Componentes del Frontend Público (React)

### Renderizado del Video en Home (Home.jsx)
[Home.jsx](file:///c:/xampp/htdocs/projects/azamora_backend/resources/js/Home.jsx)

El frontend carga las propiedades desde `HomeController.php` y renderiza el fondo interactivo del Hero.

```jsx
// Obtener el recurso Hero de la colección landing
const hero = landing?.find((i) => i.correlative === "page_home_hero") || {};

// ...
// Renderizado responsivo del Hero
{isMobile ? (
    // SECCIÓN MOBILE
    (hero.is_video_mobile === 1 || hero.is_video_mobile === "1") &&
        (hero.video_mobile && (hero.video_mobile.includes("youtube.com") || hero.video_mobile.includes("youtu.be"))) ? (
        loadVideo ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <iframe
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] max-w-none"
                    src={`https://www.youtube.com/embed/${hero.video_mobile?.split("v=")[1]?.split("&")[0] || hero.video_mobile?.split("/").pop()}?autoplay=1&mute=1&loop=1&playlist=${hero.video_mobile?.split("v=")[1]?.split("&")[0] || hero.video_mobile?.split("/").pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&bg=1`}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                ></iframe>
            </div>
        ) : (
            <div className="w-full h-full bg-primary"></div>
        )
    ) : (hero.is_video_mobile === 1 || hero.is_video_mobile === "1") ? (
        loadVideo ? (
            <video
                key={hero.video_mobile || "default_mobile"}
                src={
                    hero.video_mobile
                        ? hero.video_mobile
                        : hero.video
                }
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover opacity-70"
            />
        ) : (
            <div className="w-full h-full bg-primary"></div>
        )
    ) : (
        <img
            src={
                hero.image_mobile
                    ? `/api/landing_home/media/${hero.image_mobile}`
                    : hero.image
                        ? `/api/landing_home/media/${hero.image}`
                        : "/assets/img/home/bg-des.png"
            }
            alt="Hero Mobile"
            className="w-full h-full object-cover opacity-70"
        />
    )
) : (
    // SECCIÓN DESKTOP
    (hero.is_video === 1 || hero.is_video === "1") &&
        (hero.video && (hero.video.includes("youtube.com") || hero.video.includes("youtu.be"))) ? (
        loadVideo ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70"
                    src={`https://www.youtube.com/embed/${hero.video?.split("v=")[1]?.split("&")[0] || hero.video?.split("/").pop()}?autoplay=1&mute=1&loop=1&playlist=${hero.video?.split("v=")[1]?.split("&")[0] || hero.video?.split("/").pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&bg=1`}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                ></iframe>
            </div>
        ) : (
            <div className="w-full h-full bg-primary"></div>
        )
    ) : (hero.is_video === 1 || hero.is_video === "1") ? (
        loadVideo ? (
            <video
                key={hero.video || "default_desktop"}
                src={
                    // Si el video viene configurado, se reproduce
                    hero.video
                        ? hero.video
                        : "https://videos.pexels.com/video-files/6195526/6195526-hd_1920_1080_25fps.mp4"
                }
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover opacity-70"
            />
        ) : (
            <div className="w-full h-full bg-primary"></div>
        )
    ) : (
        <img
            src={
                hero.image
                    ? `/api/landing_home/media/${hero.image}`
                    : "/assets/img/home/bg-des.png"
            }
            alt="Hero Image"
            className="w-full h-full object-cover opacity-70"
        />
    )
)}
```

---

## 📖 Guía de Uso Paso a Paso

Para cambiar el video de fondo del banner principal (Hero) de la página web, sigue estos pasos:

1. **Ingresa a la sección "Mis videos":** 
   - Dirígete a la ruta `/admin/videos` en el panel de control.
2. **Sube el archivo:**
   - Haz clic en **Subir video**, asígnale un nombre para identificarlo y selecciona tu archivo MP4. 
   - *Tip:* Optimiza el video para que empiece de forma instantánea agregándole la opción **FastStart** (Moov Atom al inicio) mediante codificadores como Handbrake.
3. **Copia el enlace del video:**
   - Una vez subido, localízalo en la tabla y haz clic en **Copiar Enlace**. La URL tendrá una estructura similar a: `https://tuservidor.com/videos/video/de6be4e3-bc12-4eb2-a6f9-715bd7f5fe91.mp4`.
4. **Asigna el video a la sección Landing:**
   - Ve a la sección **Landing Home** (`/admin/landing_home`) en la pestaña **Inicio**.
   - Identifica la sección **Hero** y haz clic en **Editar**.
   - Activa el interruptor **Video** y pega el enlace copiado en el campo **Video URL**.
   - Haz clic en **Guardar**. ¡Listo! El nuevo video se reproducirá como fondo de manera automática en la página de inicio.
