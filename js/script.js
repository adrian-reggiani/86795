
const contenedor = document.getElementById("contenedor-juegos");
const sidebar = document.getElementById("sidebar");
const btnFavorito = document.getElementById("btnFavoritos")
const btnCarrito = document.getElementById("btnCarrito")
const btnCerrar = document.getElementById("cerrarAside");
const tituloAside = document.getElementById("tituloAside")

// Botonera para abrir el aside

btnFavorito.addEventListener("click", () => {

    sidebar.classList.add("abierto")
    tituloAside.innerHTML = "Favorito"

})
btnCarrito.addEventListener("click", () => {

    sidebar.classList.add("abierto")
    tituloAside.innerHTML = "Carrito"

})

btnCerrar.addEventListener("click", () => {
    sidebar.classList.remove("abierto")
})


// Cargar catalogo a traves de un json de manera dinamica
async function cargarCatalogo() {
    const respuesta = await fetch("../items.json");
    const juego = await respuesta.json();

    juego.forEach(e => {
        contenedor.innerHTML += `
        
        <div class="tarjeta">
                        <a href="./pages/detalle.html">
                            <img  src="${e.imagen}">
                        </a>
                        <div class="tarjeta_detalle">
                            <p>${e.nombre}</p>
                            <p>Precio: ${e.precio}$</p>    
                        </div>

                        <div class="botones">
                            <ul>Favoritos</ul>
                            <ul>Comprar</ul>
                        </div>
                    </div>
        
        `    
    });
    
}


cargarCatalogo()