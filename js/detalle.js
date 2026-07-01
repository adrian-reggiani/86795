const imgJuego =
    document.getElementById("imgJuego");

const nombreJuego =
    document.getElementById("nombreJuego");

const descripcionJuego =
    document.getElementById("descripcionJuego");

const precioJuego =
    document.getElementById("precioJuego");

async function cargarDetalle() {
    const parametros = new URLSearchParams(
        window.location.search
    )
    
    const id = Number(
        parametros.get("id")
    )
    
    const respuesta = await fetch("../items.json")
    const juegos = await respuesta.json()
    
    
    const juegoSeleccionado = juegos.find(
        e => e.id === id
    )
    
    imgJuego.src = juegoSeleccionado.imagen;

    nombreJuego.textContent = juegoSeleccionado.nombre;

descripcionJuego.textContent = juegoSeleccionado.descripcion;

precioJuego.textContent = `Precio: ${juegoSeleccionado.precio}$`;

}


cargarDetalle()
