# 📖 Guía de Estudio - Proyecto NorthTravel

¡Bienvenido! Este documento explica de manera sencilla cómo está armado el proyecto para que puedas defenderlo y explicarlo sin problemas.

## 🏗️ Estructura General
El proyecto está dividido en dos partes principales para mantener el orden:
1. **Archivos HTML (Estructura y Contenido):** Son el "esqueleto" de cada página.
2. **Carpeta CSS (Diseño y Estilos):** Es la "ropa y maquillaje". Hay un archivo `global.css` con estilos que comparten todas las páginas (como el menú, botones y footer) y un archivo `.css` específico para cada página.

## 📄 ¿Qué hace cada archivo HTML?
*   **`index.html`:** La página de inicio. Da la bienvenida, muestra destinos destacados y testimonios de clientes.
*   **`destinos.html`:** El catálogo de viajes. **Punto clave:** Tiene un sistema de filtros (Cultural, Playa, etc.) que funciona puramente con CSS.
*   **`agencias.html`:** Muestra las agencias asociadas usando un efecto de tarjetas que giran en 3D (Flip Cards).
*   **`precios.html`:** Muestra los planes de viaje y una tabla comparativa.
*   **`blog.html`:** Artículos y reseñas de viajeros, organizados en una grilla estilo periódico.
*   **`contacto.html`:** Un formulario avanzado con validaciones visuales de si los datos ingresados son correctos o no.

## 🧠 Conceptos y Trucos Clave para Explicar (¡Importante!)
Si los profesores te preguntan cómo lograste hacer cosas interactivas sin usar casi nada de JavaScript, menciónales estas técnicas que estás usando:

### 1. Variables CSS (Custom Properties) - en `global.css`
En `:root` guardamos colores, fuentes y sombras.
*   **¿Para qué sirve?** Si mañana el cliente quiere cambiar el color principal de naranja a azul, solo cambiamos una línea en `:root` y se actualiza en todo el sitio web mágicamente.

### 2. Filtros y Pestañas sin JavaScript - en `destinos.css` y `blog.css`
*   **¿Cómo funciona?** Usamos `input type="radio"` ocultos. Cuando el usuario hace clic en una "pestaña" (que en realidad es un `<label>`), se selecciona el radio button invisible. Usando la pseudoclase `:checked` y el selector de hermano general `~` en CSS, le decimos al navegador: *"Si este botón está chequeado, oculta las tarjetas que no coincidan"*. ¡Es un truco de CSS muy elegante!

### 3. Tarjetas 3D (Flip Cards) - en `agencias.css`
*   **¿Cómo funciona?** Usamos las propiedades `perspective` y `transform-style: preserve-3d`. La parte trasera de la tarjeta está rotada 180 grados de antemano y tiene `backface-visibility: hidden` (para que sea invisible por detrás). Al hacer `:hover`, giramos todo el contenedor.

### 4. HTML Semántico y Accesibilidad - en todos los HTML
*   **¿Qué es?** No usamos solo `<div>` para todo. Usamos `<nav>` para menús, `<main>` para el contenido principal, `<section>` para separar temas, y `<article>` para las tarjetas.
*   **Accesibilidad:** Usamos atributos como `aria-label` para que las personas con discapacidad visual que usan lectores de pantalla puedan entender la página.

### 5. Validaciones de Formulario con CSS - en `contacto.css`
*   **¿Cómo funciona?** Los campos de texto (inputs) en HTML tienen un atributo `required`. En CSS usamos los selectores `:valid` e `:invalid` para cambiar el color del borde a verde o rojo automáticamente dependiendo de si el usuario escribió un email correcto o no, sin usar nada de código extra.
