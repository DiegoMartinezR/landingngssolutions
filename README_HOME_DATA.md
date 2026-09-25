# Estructura de Datos - Home (Quiroinnova)

Este documento describe la estructura de datos que el backend envía a la vista `Home.jsx` y cómo se mapea cada objeto a las secciones de la interfaz de usuario. El objetivo es que otra IA pueda generar una nueva UI manteniendo la integridad de los datos y funcionalidades existentes.

## Controlador de Referencia
**Archivo:** `app/Http/Controllers/HomeController.php`  
El método `setReactViewProperties` prepara y retorna todos los datos necesarios.

---

## 1. Landing Sections (`landing` prop)
La mayoría de los textos e imágenes principales se manejan a través del modelo `LandingHome`. Se filtran por su campo `correlative`.

### Section: Hero
- **Marker**: `page_home_hero`
- **Campos Usados**:
    - `subtitle`: Texto pequeño sobre el título (Badge).
    - `title`: Título principal (Soporta `*texto*` para resaltar).
    - `description`: Párrafo de introducción.
    - `video`: URL de YouTube (ID o link completo) que se usa como fondo inmersivo.

### Section: Nosotros (About Us)
- **Marker**: `page_home_mensaje`
- **Campos Usados**:
    - `subtitle`: Etiqueta de la sección.
    - `title`: Título resaltado.
    - `description`: Texto descriptivo.
    - `image`: Imagen lateral de la sección (Ruta: `/api/landing_home/media/{image}`).
    - `strenghts`: Array de objetos (`{name: string}`) usado para la lista de beneficios.

### Section: Enfoque / Señales
- **Marker**: `page_home_enfoque`
- **Campos Usados**:
    - `subtitle`: Etiqueta.
    - `title`: Título de la sección.
    - `description`: Descripción del enfoque.
    - `image`: Imagen de fondo/lateral.

### Section: Staff / Profesionales
- **Marker**: `page_home_staff`
- **Campos Usados**:
    - `title`: Título de la sección de equipo.
    - `description`: Texto breve sobre los profesionales.

### Section: Promo / CTA (Ticket)
- **Marker**: `page_home_cta`
- **Campos Usados**:
    - `subtitle`: Badge de la oferta.
    - `title`: Título de la promoción.
    - `description`: Texto que contiene la lista de beneficios (se parsea buscando líneas con `-` y títulos entre `*`).

### Section: Ubicaciones
- **Marker**: `page_home_enfoque`
- **Campos Usados**:
    - `title`: Título de la sección de mapa.
    - `description`: Texto explicativo.

---

## 2. Listas de Datos Dinámicos

### Fortalezas (`strenghts`)
- **Uso**: Lista de beneficios con checkmarks en la sección "Nosotros".
- **Estructura**: `Array<{ name: string }>`

### Indicadores (`indicators`)
- **Uso**: Estadísticas o números de confianza (e.g. "10+ Años").
- **Estructura**: `Array<{ symbol: string, name: string, description: string }>`
    - `symbol`: Icono o imagen (`/api/indicator/media/{symbol}`).

### Servicios (`services`)
- **Uso**: Tarjetas detalladas de especialidades.
- **Estructura**: `Array<{ image: string, title: string, description: string, characteristics: string[] }>`
    - `image`: Icono del servicio (`/api/service/media/{image}`).
    - `characteristics`: Lista de puntos clave del servicio.

### Especialidades (`specialities`)
- **Uso**: Lista de condiciones que se tratan (e.g. Dolor de espalda).
- **Estructura**: `Array<{ name: string }>`

### Profesionales (`staffs`)
- **Uso**: Tarjetas de los doctores/especialistas.
- **Estructura**: `Array<{ image: string, banner: string, job: string, name: string, description: string }>`
    - `image`: Foto del profesional.
    - `banner`: Logo de la universidad o institución.
    - `job`: Cargo o título profesional.

### Testimonios (`testimonies`)
- **Uso**: Carrusel de reseñas de clientes.
- **Estructura**: `Array<{ name: string, description: string, date: string }>`

### Sedes / Instalaciones (`facilities`)
- **Uso**: Se procesan como `sedes` para el formulario y el mapa.
- **Estructura**: `Array<{ title, link, latitude, longitude, ubications: string[], phones: string[], business_hours: string[] }>`
    - `business_hours`: Array de strings tipo "Lunes-Viernes: 9am - 6pm".

---

## 3. Datos Globales (`generals` y `socials`)

- **`generals`**: Parámetros de configuración (e.g. `support_phone`, `support_email`, `footer_description`).
- **`socials`**: Enlaces a redes sociales (`facebook`, `instagram`, `tiktok`, etc.).

## 4. Funcionalidades Clave (Integridad)
- **Formulario de Reserva**: Debe enviar `name`, `phone`, `email`, `facility_id`, `service_id` y `description` al endpoint de `MessagesRest`.
- **WhatsApp**: Botón flotante que usa el número de `generals` (correlativo `support_phone`).
- **Mapas**: El iframe de Google Maps se genera dinámicamente usando `link` o `latitude`/`longitude` de la sede seleccionada.
