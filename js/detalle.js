// Funciones
const imagenJuego = document.getElementById("imgJuego");
const nombreJuego = document.getElementById("nombreJuego");
const descripcionJuego = document.getElementById("descripcionJuego");
const precioJuego = document.getElementById("precioJuego");
const btnComprarDejuegosimgJuegotalle = document.getElementById("btnComprarDetalle");
const btnFavoritoDetalle = document.getElementById("btnFavoritoDetalle");

let id;

// Carga del JSON el juego a mostrar en el apartado detalle
async function cargarDetalle() {

    // windows.location.search devuelve la parte que sigue del ? de la url
    // URLSearchParams tranforma en un objeto la parte que sigue del ?
    const parametros = new URLSearchParams(window.location.search)
    
    //.get sirve para obtener el id 
    id = Number(parametros.get("id"))
    
    const respuesta = await fetch("../items.json")
    const juegos = await respuesta.json()
    
    // Se busca el juego seleccionado
    const juegoSeleccionado = juegos.find(e => e.id === id)
    
    // Se carga el contenido en la pagina detalle
    imagenJuego.src = `../${juegoSeleccionado.imagen}`;
    imagenJuego.alt = juegoSeleccionado.nombre;
    nombreJuego.textContent = juegoSeleccionado.nombre;
    descripcionJuego.textContent = juegoSeleccionado.descripcion;
    precioJuego.textContent = `Precio: ${juegoSeleccionado.precio}$`;

    eventoFavoritoDetalle()
    eventoComprarDetalle()
}

function eventoFavoritoDetalle(){
    btnFavoritoDetalle.addEventListener("click", () => {

    let favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    if (!favoritos.includes(id)) {
        favoritos.push(id);
        mostrarToast("❤️ Juego agregado a favoritos");
    } else {
        favoritos = favoritos.filter(
            e => e !== id
        );
        mostrarToast("💔 Juego eliminado de favoritos");
    }

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );
});
}

function eventoComprarDetalle(){

    btnComprarDetalle.addEventListener("click", () => {

    let compras =
        JSON.parse(
            localStorage.getItem("compras")
        ) || [];

    const item = compras.find(
        c => c.id === id
    );

    if (item) {
        item.cantidad++;
        
    } else {
        compras.push({
            id: id,
            cantidad: 1
        });
    }

    mostrarToast("🛒 Juego agregado al carrito");

    localStorage.setItem(
        "compras",
        JSON.stringify(compras)
    );
});
}

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");

    toast.textContent = mensaje;
    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 3000);
}



cargarDetalle()
