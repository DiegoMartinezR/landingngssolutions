# Reporte de Optimizaciones Técnicas y SEO (Baleine)

Este documento detalla todas las mejoras de rendimiento (Core Web Vitals), SEO técnico y correcciones de código realizadas en la plataforma de Baleine, abarcando desde el frontend público hasta el panel de administrador.

## 1. Optimización de Rendimiento en Frontend (`public.blade.php`)
El archivo principal de la vista pública fue reestructurado para eliminar bloqueos de renderizado y descargar la ruta crítica:
- **Eliminación de CSS Redundante**: Se eliminó la importación del CDN de Tailwind CSS (`tailwind.min.css` - 250 KB) ya que el proyecto ya procesaba Tailwind a través de Vite (`app.css`). Esto ahorró instantáneamente un cuarto de megabyte de código CSS sin usar.
- **Eliminación de Dependencias Administrativas**: Se eliminó completamente la librería Quill (tanto su script JS como sus hojas de estilo) del layout público, ya que solo es necesaria en el panel de administrador.
- **Carga Diferida de JavaScript (`defer`)**: Se aplicó el atributo `defer` a scripts de terceros pesados (`vendor.min.js`, `flowbite.min.js`, `moment.js`, `tippy.js`). Esto permite que el navegador continúe dibujando la página (FCP/LCP) en móviles sin detenerse a descargar y ejecutar JavaScript de inmediato, ahorrando más de 2 segundos de bloqueo.
- **Estandarización de Estilos y Fuentes**: Se reemplazó el obsoleto hack de CSS asíncrono (`media="print" onload="this.media='all'"`) por etiquetas `<link>` limpias y estándar, aprovechando parámetros modernos como `&display=swap` en Google Fonts para evitar bloqueos de renderización (Render-blocking) de forma oficial y aceptada por la W3C.
- **Corrección de Google Fonts**: Se limpió la sintaxis de la URL de Google Fonts, la cual contenía parámetros inválidos que provocaban un error 404 (MIME `text/html`) en la consola.
- **Conexiones Precoces (`preconnect`)**: Se añadieron etiquetas `preconnect` limitadas a los orígenes más críticos para acelerar la resolución DNS.

## 2. Animaciones y Bloqueo de Hilo Principal (`Home.jsx` y `Header.jsx`)
Para solucionar las advertencias de Lighthouse sobre "Trabajo del hilo principal" y "Reprocesamiento forzado", se redujo drásticamente la dependencia de JavaScript para animaciones UI:
- **Framer Motion y ScrollReveal**: Se eliminaron las pesadas animaciones basadas en JavaScript (`framer-motion`) en el `Hero` y `Header`. Estas librerías provocaban recálculos de estilo costosos que retrasaban el LCP y afectaban métricas en dispositivos móviles.
- **Transiciones CSS Nativas**: Se reemplazó la lógica de animación del Header por transiciones CSS puras, logrando el mismo efecto visual pero delegado a la GPU del navegador, mejorando la fluidez sin penalizar el JS.

## 3. Caché del Navegador (`public/.htaccess`)
Se resolvió la advertencia *"Usa tiempos de almacenamiento en caché eficientes"* que afectaba la puntuación de rendimiento repetitivo:
- Se implementó el módulo `mod_expires` en Apache.
- El tiempo de vida (TTL) de los activos estáticos (imágenes en todos sus formatos modernos, CSS, JavaScript y Fuentes) se incrementó de 7 días a **1 año** (`access plus 1 year`). Esto garantiza que los visitantes recurrentes carguen la web de forma instantánea.

## 4. IA SEO y Lecturabilidad (`llms.txt` y Contenidos)
- **Implementación de `llms.txt`**: Se actualizó el archivo público `llms.txt` con el estándar de STF Water. Este archivo actúa como un punto de entrada optimizado (Markdown estructurado) para que bots de IA (ChatGPT, Claude, Perplexity) entiendan el contexto corporativo y de negocio de STF Water fácilmente y puedan citarlo como fuente en respuestas web.
- **Lecturabilidad**: Se reestructuraron oraciones excesivamente largas en `Home.jsx` para mejorar la puntuación de legibilidad Flesch-Kincaid, factor que Google premia para la retención del usuario.

## 5. Corrección Crítica en Panel de Administración (`LandingHome.jsx`)
Se identificó y solucionó un fallo de usabilidad/integridad de datos para usuarios con el rol "Cliente" (no editores):
- **Problema Anterior**: Cuando un cliente sin permisos de edición guardaba cambios, los campos como el switch de video o los enlaces de texto que estaban ocultos para él, se sobrescribían y se guardaban como vacíos o `false`, destruyendo la configuración previa del Administrador.
- **Solución**: 
  1. Se modificó el constructor de `FormData` para leer directamente el estado React (`isVideo`) en lugar de intentar leer el DOM oculto (`is_videoRef.current`).
  2. Se añadió validación dinámica (`required={app_developer !== "Editor"}`) en los campos de *Subtítulo, Descripción, Enlace y Videos*, haciendo obligatorio que el cliente mantenga el texto existente y no pueda vaciar/romper la maqueta por accidente al presionar "Guardar".

## 6. Open Graph y Twitter Cards (`public.blade.php` y `AppServiceProvider.php`)
Se hizo el marcado social más robusto para que Facebook, WhatsApp, LinkedIn y Twitter rendericen correctamente las tarjetas enriquecidas:
- **URLs Absolutas Seguras**: Se añadió lógica para forzar la función `url()` si la ruta subida por el usuario es relativa (ej. `/assets/img/logo.png`). Los analizadores de redes sociales exigen URLs absolutas.
- **Manejo Estricto de Vacíos**: Se reemplazó el operador nulo `??` de Laravel por una validación estricta `!empty()`. De este modo, si en base de datos existe el registro de SEO pero está guardado como texto en blanco (`""`), el sistema sí utilizará los datos por defecto (como el nombre general de la app o el logo base) en lugar de renderizar atributos vacíos.

## 7. Media Responsiva en Primer Pantallazo (`Home.jsx`)
- **Gestión Avanzada de LCP Móvil**: Se introdujo el hook `useIsMobile()` acoplado a un manejador de estado en ventana (resize), el cual permite servir condicionalmente recursos multimedia distintos en el **Hero** (sección `page_home_hero`) para móviles (`hero.video_mobile` / `hero.image_mobile`) y escritorio. Esto optimiza dramáticamente el peso de la página descargada en dispositivos celulares sin sacrificar el impacto visual de alta definición en computadoras.

## 8. Optimizaciones SEO Técnicas, Accesibilidad y Consola (`Home.jsx` y `Footer.jsx`)
- **Jerarquía Semántica de Encabezados (SEO)**: Se corrigió la estructura de encabezados en el formulario de la página principal (`Home.jsx`). Se cambió un salto incorrecto de `H1` a `H3` por un `H2` para mantener el orden jerárquico lógico exigido por buscadores. Además, el formulario secundario que existía solo para la vista móvil se modificó para usar un `div` con estilos de encabezado en lugar de un tag `H3/H2`, evitando que los rastreadores (crawlers) marquen penalizaciones por contenido y títulos duplicados.
- **Advertencias de Swiper (Loop Warning)**: Se solucionaron las advertencias constantes en consola provocadas por carruseles Swiper que intentaban activar la opción de bucle infinito (`loop={true}`) sin tener el número mínimo de elementos (`slides`) que la librería requiere. Se ajustó el código para que el `loop` sea dinámico y solo se active cuando el array de datos supere la cantidad de diapositivas visibles.
- **Limpieza de Consola**: Se removieron sentencias de depuración olvidadas (`console.log`) en producción.
- **Accesibilidad y Controles (WCAG)**: 
  - Se agregó el atributo `aria-label` descriptivo ("Servicio anterior" y "Siguiente servicio") a los botones de navegación (`ChevronLeft` y `ChevronRight`) del carrusel de servicios en `Home.jsx`. Esto permite que los lectores de pantalla anuncien correctamente su función en lugar de leer un botón vacío.
  - Se mejoró el soporte para lectores de pantalla y tecnología de asistencia agregando atributos `aria-label` en todos los botones de redes sociales del pie de página.
  - Se solucionó el problema de *"vínculos que dependen del color para distinguirse"* agregando la decoración CSS `underline` al enlace de autoría ("MundoWeb"), además de su respectivo `aria-label` para asegurar que todo usuario identifique correctamente el elemento de anclaje interactivo sin depender solo del nivel de contraste visual.
