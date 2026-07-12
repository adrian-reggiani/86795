// Referencias a elementos del DOM.
const imagenJuego = document.getElementById("imgJuego");
const nombreJuego = document.getElementById("nombreJuego");
const descripcionJuego = document.getElementById("descripcionJuego");
const precioJuego = document.getElementById("precioJuego");
const btnComprarDetalle = document.getElementById("btnComprarDetalle");
const btnFavoritoDetalle = document.getElementById("btnFavoritoDetalle");

// Variable global para guardar el id del juego seleccionado
let id;

// Carga desde el JSON el juego a mostrar en la página de detalle
async function cargarDetalle() {

    // window.location.search devuelve la parte de la URL que sigue al signo '?'
    // URLSearchParams convierte esos parámetros en un objeto fácil de utilizar
    const parametros = new URLSearchParams(window.location.search);

    // Obtiene el id enviado por la URL y lo convierte a número
    id = Number(parametros.get("id"));

    // Obtiene el listado de juegos desde el archivo JSON
    const respuesta = await fetch("../items.json");
    const juegos = await respuesta.json();

    // Busca el juego cuyo id coincide con el recibido por la URL
    const juegoSeleccionado = juegos.find(e => e.id === id);

    // Carga la información del juego en la página
    imagenJuego.src = `../${juegoSeleccionado.imagen}`;
    imagenJuego.alt = juegoSeleccionado.nombre;
    nombreJuego.textContent = juegoSeleccionado.nombre;
    descripcionJuego.textContent = juegoSeleccionado.descripcion;
    precioJuego.textContent = `Precio: ${juegoSeleccionado.precio}$`;

    // Activa los eventos de los botones
    eventoFavoritoDetalle();
    eventoComprarDetalle();
}

// Agrega o elimina el juego de la lista de favoritos
function eventoFavoritoDetalle() {

    // Evento al hacer clic en el botón Favoritos
    btnFavoritoDetalle.addEventListener("click", () => {

        // Obtiene los favoritos almacenados en LocalStorage
        // Si no existen, crea un arreglo vacío
        let favoritos =
            JSON.parse(
                localStorage.getItem("favoritos")
            ) || [];

        // Si el juego no está en favoritos lo agrega
        if (!favoritos.includes(id)) {
            favoritos.push(id);
            mostrarToast("❤️ Juego agregado a favoritos");
        } else {
            // Si ya existe, lo elimina
            favoritos = favoritos.filter(
                e => e !== id
            );
            mostrarToast("💔 Juego eliminado de favoritos");
        }

        // Guarda nuevamente el arreglo actualizado
        localStorage.setItem(
            "favoritos",
            JSON.stringify(favoritos)
        );
    });
}

// Agrega el juego al carrito de compras
function eventoComprarDetalle() {

    // Evento al hacer clic en el botón Comprar
    btnComprarDetalle.addEventListener("click", () => {

        // Obtiene las compras almacenadas o crea un arreglo vacío
        let compras =
            JSON.parse(
                localStorage.getItem("compras")
            ) || [];

        // Busca si el juego ya está agregado al carrito
        const item = compras.find(
            c => c.id === id
        );

        // Si existe, aumenta la cantidad
        if (item) {
            item.cantidad++;

        } else {
            // Si no existe, lo agrega con cantidad inicial de 1
            compras.push({
                id: id,
                cantidad: 1
            });
        }

        // Muestra un mensaje de confirmación
        mostrarToast("🛒 Juego agregado al carrito");

        // Guarda el carrito actualizado
        localStorage.setItem(
            "compras",
            JSON.stringify(compras)
        );
    });
}

// Muestra un mensaje temporal en pantalla
function mostrarToast(mensaje) {

    const toast = document.getElementById("toast");

    // Inserta el mensaje y hace visible el toast
    toast.textContent = mensaje;
    toast.classList.add("mostrar");

    // Lo oculta automáticamente luego de 3 segundos
    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 3000);
}

// Ejecuta la carga inicial del detalle del juego
cargarDetalle();