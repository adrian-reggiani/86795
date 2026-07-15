// Referencias a elementos del DOM.
const contenedor = document.getElementById("contenedor-juegos");
const sidebar = document.getElementById("sidebar");
const btnFavoritos = document.getElementById("btnFavoritos");
const btnCarrito = document.getElementById("btnCarrito");
const btnCerrar = document.getElementById("cerrarAside");
const tituloAside = document.getElementById("tituloAside");
const contenidoAside = document.getElementById("contenidoAside");

// Variables de la aplicación.
let vistaActual = "";
let favoritos = [];
let compras = [];
let juego = [];

// Airtable
const AIRTABLE_BASE_ID = "app233GHQGT7YOGSv";
const AIRTABLE_PAT= "Agregar Token";
const AIRTABLE_TABLE = "Items";


// Obtiene los juegos desde el archivo JSON y genera dinámicamente las tarjetas del catálogo.
async function cargarCatalogo() {
    const respuesta = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`,
    {
        headers:{
            Authorization:`Bearer ${AIRTABLE_PAT}`
        }
    }
);

const data = await respuesta.json();

juego = data.records.map(registro => registro.fields);

// Recorre todos los juegos y crea una tarjeta para cada uno.
    juego.forEach(e => {

        contenedor.innerHTML += `
        
        <div class="tarjeta">
                        <a href="./pages/detalle.html?id=${e.id}">
                            <img src="${e.imagen}">
                        </a>
                        <div class="tarjeta_detalle">
                            <p>${e.nombre}</p>
                            <p>Precio: ${e.precio}$</p>    
                        </div>

                        <div class="botones">
                            <button class="btnFavorito" data-id="${e.id}">
                                Favoritos
                            </button>

                            <button class="btnComprar" data-id="${e.id}">
                                Comprar
                            </button>
                        </div>
                    </div>
        
        `    
    });

    // Asigna los eventos a los botones creados dinámicamente.
    botonFavorito()
    botonCompras()
}

// Configura los botones para abrir y cerrar el panel lateral.
function botoneraAside(){
    btnFavoritos.addEventListener("click", () => {
        vistaActual = "favoritos";
        sidebar.classList.add("abierto")
        tituloAside.innerHTML = "Favorito"
        mostrarContenidoFavorito();
    })
    btnCarrito.addEventListener("click", () => {
        vistaActual = "compras";
        sidebar.classList.add("abierto")
        tituloAside.innerHTML = "Carrito"
        mostrarContenidoCompras();
    })
    
    btnCerrar.addEventListener("click", () => {
        sidebar.classList.remove("abierto")
    })
}

// Agrega o elimina juegos de la lista de favoritos.
function botonFavorito(){
    const botonesFavorito = document.querySelectorAll(".btnFavorito")

    // foreach para los botones favorito, si el id no se encuetran en el arreglo se agrega sino se crea otro arreglo y se elimina el id
        botonesFavorito.forEach(e => {
            e.addEventListener("click", () => {
                const id = Number(e.dataset.id);

    // Si el juego no existe en favoritos lo agrega; de lo contrario lo elimina.
                if (!favoritos.includes(id)){
                    favoritos.push(id)
                    mostrarToast("❤️ Juego agregado a favoritos");
                }else{
                    favoritos = favoritos.filter(
                        e => e !== id 
                    )
                    mostrarToast("💔 Juego eliminado de favoritos");
                }
    // Guarda los favoritos en el almacenamiento local.
                localStorage.setItem(
                    "favoritos", JSON.stringify(favoritos)
                )

    // Actualiza el contenido del aside si se encuentra abierto.
                if (vistaActual === "favoritos") {
                    mostrarContenidoFavorito();
                }
        })
    })
}

// Agrega juegos al carrito o incrementa su cantidad.
function botonCompras(){
    const botonesComprar = document.querySelectorAll(".btnComprar")

        botonesComprar.forEach(e => {
            e.addEventListener("click", () => {
                const id = Number(e.dataset.id);
                const item = compras.find(c => c.id === id);

// Agrega juegos al carrito o incrementa su cantidad.
                if (item) {
                   item.cantidad++;
                } else {
                    compras.push({
                    id: id,
                    cantidad: 1
                    });
                }

                mostrarToast("🛒 Juego agregado al carrito");
                
// Agrega juegos al carrito o incrementa su cantidad.
                localStorage.setItem(
                    "compras", JSON.stringify(compras)
                )
                if (vistaActual === "compras") {
                    mostrarContenidoCompras();
                }
        })
    })
}

// Elimina un juego de la lista de favoritos desde el aside.
function btnEliminarFavorito() {
    const btnEliminarFavorito = document.querySelectorAll(".btnEliminarFavorito")
    btnEliminarFavorito.forEach(e => {
        e.addEventListener("click", e =>{
            const id = Number(e.target.dataset.id)
            favoritos = favoritos.filter(e => e !== id)
            localStorage.setItem(
                    "favoritos", JSON.stringify(favoritos)
                )
            mostrarContenidoFavorito()
        })
    })
}

    
// Recupera los datos almacenados en LocalStorage.
function obtenerInformacion () {
    favoritos = JSON.parse(
        localStorage.getItem("favoritos")
    ) || [];

    compras = JSON.parse(
        localStorage.getItem("compras")
    ) || [];
}

// Muestra los juegos marcados como favoritos.
function mostrarContenidoFavorito(){

//Se limpia el contenido
    contenidoAside.innerHTML = ""

// Obtiene únicamente los juegos cuyos ID están en favoritos.
    const juegosFavoritos = juego.filter(e => favoritos.includes(e.id))
    
// Genera el contenido del panel lateral.
    juegosFavoritos.forEach(e => {
        contenidoAside.innerHTML += `
            <div class="itemFavorito">
                <img src="${e.imagen} " alt="${e.nombre}"> 
                <p>${e.nombre}</p>
                <button class="btnEliminarFavorito" data-id="${e.id}">-</button>
            </div>
            <br>
            <hr>
        `
    });
    btnEliminarFavorito()
}

// Muestra el contenido actual del carrito.
function mostrarContenidoCompras() {

    contenidoAside.innerHTML = "";

// Obtiene los juegos que fueron agregados al carrito.
    const juegosCompras = juego.filter(
        e => compras.some(c => c.id === e.id)
    );

    let total = 0;
    
    juegosCompras.forEach(e => {
        
        const itemCompra = compras.find(c => c.id === e.id);
        total += e.precio * itemCompra.cantidad

        contenidoAside.innerHTML += `
            <div class="itemCompra">
                <img src="${e.imagen}" alt="${e.nombre}">
                <div>
                    <p>${e.nombre}</p>
                    <p>${e.precio} $ X ${itemCompra.cantidad} = ${e.precio * itemCompra.cantidad } </p>                
                </div>

                <div class="botoneraCompras">
                    <button class="btnCompraSuma" data-id="${e.id}">+</button>
                    <p>${itemCompra.cantidad}</p>
                    <button class="btnCompraMenos" data-id="${e.id}">-</button>
                </div>
            </div>
            <br>
            <hr>
        `;
    });

    if (compras.length === 0) {

    contenidoAside.innerHTML = `
        <p class="carritoVacio">
            🛒 El carrito está vacío.
        </p>
    `;

    return;
}

    contenidoAside.innerHTML += `
    <hr>
    <div class="totalCompra">
        <h3>Total: $${total}</h3>
        <button id="btnFinalizarCompra">Finalizar compra</button>
    </div>
    `;

    eventosCantidadCompra();
    eventoFinalizarCompra();
}

// Agrega los eventos para aumentar o disminuir la cantidad de productos del carrito.    
function eventosCantidadCompra(){
    const btnCompraSuma = document.querySelectorAll(".btnCompraSuma")
    const btnCompraMenos = document.querySelectorAll(".btnCompraMenos")

    btnCompraSuma.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const item = compras.find(
                 c => c.id === id
            );

// Incrementa la cantidad del producto.
            item.cantidad++;

            localStorage.setItem(
               "compras",
                JSON.stringify(compras)
            );

            mostrarContenidoCompras();
        });
    });

    btnCompraMenos.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);

        const item = compras.find(
            c => c.id === id
        );
// Disminuye la cantidad del producto
        item.cantidad--;

// Elimina el producto cuando la cantidad llega a cero.
        if (item.cantidad <= 0) {
            compras = compras.filter(
                c => c.id !== id
            );
        }

        localStorage.setItem(
            "compras",
            JSON.stringify(compras)
        );

        mostrarContenidoCompras();
    });
    });
}

// Finaliza la compra y vacía el carrito.
function eventoFinalizarCompra() {

    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

    if (!btnFinalizarCompra) return;

    btnFinalizarCompra.addEventListener("click", () => {

        mostrarToast("✅ Compra realizada con éxito");

        compras = [];

        localStorage.setItem(
            "compras",
            JSON.stringify(compras)
        );

        mostrarContenidoCompras();

    });

}

// Muestra un mensaje temporal en pantalla.
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");

    toast.textContent = mensaje;
    toast.classList.add("mostrar");

// Oculta el mensaje luego de 3 segundos.
    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 3000);
}



// Main
botoneraAside()
obtenerInformacion()
cargarCatalogo()