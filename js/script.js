
const contenedor = document.getElementById("contenedor-juegos");


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
        console.log(e.nombre)    
    });
    
}


cargarCatalogo()