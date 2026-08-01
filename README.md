# Erland Watches

Erland Watches es una aplicación web interactiva que simula el proceso comercial de un ecommerce de relojes.

El proyecto fue desarrollado con HTML, CSS y JavaScript como trabajo final del curso de JavaScript.

## Contexto del proyecto

La aplicación permite que un usuario explore un catálogo de relojes, busque productos, filtre por categorías, agregue artículos al carrito y complete una compra simulada.

Al confirmar la compra, la aplicación valida los datos del comprador, ejecuta un temporizador de procesamiento y genera un ticket de venta mediante la librería Toastify.

## Funcionalidades

* Carga dinámica de productos desde un archivo JSON mediante Fetch.
* Creación de tarjetas de productos utilizando manipulación del DOM.
* Buscador de relojes por nombre y descripción.
* Filtros por categoría.
* Carrito lateral de compras.
* Aumento y disminución de cantidades.
* Eliminación de productos del carrito.
* Control del stock disponible.
* Cálculo automático de subtotales y total de la compra.
* Conservación del carrito mediante Local Storage.
* Formulario con los datos del comprador.
* Validación personalizada de nombre, correo, documento y dirección.
* Simulación del procesamiento de la compra mediante un temporizador.
* Generación de un número de operación.
* Ticket final de venta mediante la librería Toastify.
* Diseño adaptable para computadoras, tablets y celulares.
* Mensajes visuales sin utilizar `alert`, `prompt` ni `confirm`.


## Tecnologías utilizadas

* **HTML5:** estructura semántica de la aplicación.
* **CSS3:** diseño visual, animaciones, Flexbox, Grid y adaptación responsive.
* **JavaScript:** lógica principal, eventos, validaciones y manipulación del DOM.
* **JSON:** almacenamiento de la información de los relojes.
* **Fetch API:** lectura asíncrona del archivo de productos.
* **Local Storage:** conservación del carrito al recargar la página.
* **Toastify:** notificaciones y presentación del ticket de venta.
* **Live Server:** ejecución del proyecto mediante un servidor local.


## Estructura del proyecto

```text
erland-watches/
│
├── css/
│   └── style.css
│
├── data/
│   └── products.json
│
├── img/
│   ├── classic-gold.png
│   ├── urban-black.png
│   ├── silver-executive.png
│   ├── sport-chrono.png
│   ├── brown-heritage.png
│   └── midnight-steel.png
│
├── js/
│   └── app.js
│
├── index.html
└── README.md
```


## Demo

La aplicación se encuentra publicada en Vercel:

**Demo:** [Ver Erland Watches en línea](https://erland-watches.vercel.app/)


## Ejecución local

También es posible ejecutar el proyecto localmente:

1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Ejecutar `index.html` mediante la extensión Live Server.
4. Abrir en el navegador la dirección proporcionada por Live Server.

El proyecto debe ejecutarse mediante un servidor local para que la solicitud `Fetch` pueda leer correctamente el archivo `data/products.json`.


### Descripción de los archivos

* `index.html`: contiene la estructura principal de la aplicación, el catálogo, el carrito y el formulario de compra.
* `css/style.css`: contiene los estilos generales, el diseño responsive, las tarjetas, el carrito, el formulario y el ticket.
* `js/app.js`: contiene la lógica de productos, filtros, carrito, validaciones, temporizador, almacenamiento local y generación del ticket.
* `data/products.json`: almacena la información de los relojes que se obtiene mediante Fetch.
* `img/`: contiene las imágenes utilizadas en las tarjetas de los productos.
* `README.md`: contiene la documentación general del proyecto.

## Repositorio

El código fuente del proyecto se encuentra disponible en GitHub:

**Repositorio:** [Ver código de Erland Watches](https://github.com/erlandruiz/erland-watches)


## Proceso comercial simulado

La aplicación representa el siguiente circuito de compra:

1. El usuario explora el catálogo de relojes.
2. Busca productos por nombre o descripción.
3. Filtra los relojes por categoría.
4. Agrega uno o varios productos al carrito.
5. Modifica las cantidades respetando el stock disponible.
6. Revisa los subtotales y el total de la compra.
7. Completa sus datos personales y la dirección de entrega.
8. La aplicación valida la información ingresada.
9. Se inicia un temporizador que simula el procesamiento del pago.
10. Toastify muestra un ticket con los datos de la operación.
11. El carrito se vacía después de completar la compra.


## Reflexión final

El desarrollo de Erland Watches me permitió aplicar de forma práctica los principales conceptos aprendidos durante el curso de JavaScript.

Durante el proyecto trabajé con arrays de objetos obtenidos desde un archivo JSON mediante Fetch, manipulación del DOM, eventos, funciones, validaciones, almacenamiento local y una librería externa.

Uno de los principales desafíos fue mantener sincronizados el catálogo, el carrito, el stock, los subtotales y el total de la compra. También fue importante controlar los diferentes estados de la aplicación, como el carrito vacío, los errores del formulario y el procesamiento de la venta.

Como resultado, desarrollé una aplicación interactiva que simula un proceso comercial completo, desde la selección de los productos hasta la generación del ticket final. Este proyecto me permitió comprender mejor cómo JavaScript conecta los datos, la interfaz y las acciones del usuario dentro de una aplicación web.
