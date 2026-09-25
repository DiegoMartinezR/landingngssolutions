# Guía de Implementación: Visibilidad Dinámica de Campos en el Administrador

Este documento explica cómo se implementó la lógica de visibilidad dinámica en el componente `LandingHome.jsx`. Esta técnica permite que un mismo formulario y tabla se adapten a diferentes tipos de contenido, ocultando automáticamente los campos que no se utilizan para una sección específica.

## Problema

En tablas polivalentes como `landing_home`, diferentes secciones (Inicio, Servicios, Nosotros) requieren distintos conjuntos de datos. Por ejemplo:
- Una sección de "Imagen Principal" solo necesita **Título** e **Imagen**.
- Una sección de "Beneficios" puede necesitar **Título**, **Subtítulo**, **Descripción** y **Link**.

Mostrar todos los campos (aunque estén vacíos) crea una interfaz desordenada y confusa para el usuario.

## Solución: Visibilidad Condicionada

La solución se divide en dos partes: el **Modo Lectura** (la lista de secciones) y el **Modo Edición** (el modal de edición).

### 1. En la Lista de Secciones (Modo Lectura)

Para evitar que se vean etiquetas vacías o campos "nulos", se utiliza el operador lógico `&&` de React.

```jsx
{item.title && (
    <div className="mb-2">
        <strong>Título:</strong>
        <EditableCell data={item} field="title" ... />
    </div>
)}
```

**Resultado:** Si el campo `title` es `null`, `undefined` o una cadena vacía, todo el bloque `div` simplemente no se renderiza en el DOM.

### 2. En el Modal de Edición (Modo Escritura)

Para los inputs del formulario, utilizamos el atributo nativo `hidden` de HTML combinado con una lógica que detecta si estamos editando un registro existente y si ese registro tiene datos en dicho campo.

```jsx
<div hidden={!selectedItem?.subtitle && isEditing}>
    <InputFormGroup
        eRef={subtitleRef}
        label="Subtítulo"
        placeholder="Subtítulo opcional"
    />
</div>
```

#### Lógica Explicada:
- **`isEditing`**: Es un flag que indica si abrimos el modal para editar un registro existente o para crear uno nuevo.
- **`!selectedItem?.subtitle`**: Verifica si el campo está vacío en el registro actual.
- **La condición `!value && isEditing`**: 
    - Si estamos **creando** (`isEditing` es falso), la condición es falsa y el campo **se muestra** siempre.
    - Si estamos **editando** (`isEditing` es verdadero) y el campo **está vacío**, la condición es verdadera y el campo **se oculta**.
    - Si estamos **editando** y el campo **tiene valor**, la condición es falsa y el campo **se muestra**.

## Beneficios de esta Implementación

1.  **Limpieza Visual**: El administrador solo ve lo que realmente importa para cada sección.
2.  **Reutilización de Código**: Se utiliza un solo modal y una sola estructura de datos para múltiples tipos de secciones.
3.  **Prevención de Errores**: Evita que el usuario intente llenar campos que no se mostrarán en la página final (frontend).
4.  **Escalabilidad**: Si una sección nueva necesita un campo que antes no usaba, basta con activarlo en la base de datos y aparecerá automáticamente en el administrador.

---
*Nota: Esta lógica se encuentra implementada principalmente en [LandingHome.jsx](file:///c:/xampp/htdocs/projects/quiroinnova_backend/resources/js/Admin/LandingHome.jsx) entre las líneas 579-697 (Vista) y 749-800 (Modal).*
