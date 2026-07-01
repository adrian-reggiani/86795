
const contenedor = document.getElementById("contenedor-juegos");
const sidebar = document.getElementById("sidebar");
const btnFavoritos = document.getElementById("btnFavoritos")
const btnCarrito = document.getElementById("btnCarrito")
const btnCerrar = document.getElementById("cerrarAside");
const tituloAside = document.getElementById("tituloAside")
const contenidoAside = document.getElementById("contenidoAside");

let vistaActual = "";
let favoritos = [];
let compras = [];
let juego = [];

// Cargar catalogo a traves de un json de manera dinamica
async function cargarCatalogo() {
    const respuesta = await fetch("./items.json");
    juego = await respuesta.json();

    

    juego.forEach(e => {

        const rutaParaIndex = e.imagen.replace("../", ""); 
        contenedor.innerHTML += `
        
        <div class="tarjeta">
                        <a href="./pages/detalle.html?id=${e.id}">
                            <img src="${rutaParaIndex}">
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

    botonFavorito()
    botonCompras()
}

// Funciones


// Botonera para abrir el aside
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

// Boton para agregar/quitar de favorito de la tarjeta
function botonFavorito(){
    const botonesFavorito = document.querySelectorAll(".btnFavorito")

        botonesFavorito.forEach(e => {
            e.addEventListener("click", () => {
                const id = Number(e.dataset.id);
                if (!favoritos.includes(id)){
                    favoritos.push(id)
                    mostrarToast("❤️ Juego agregado a favoritos");
                }else{
                    favoritos = favoritos.filter(
                        e => e !== id 
                    )
                    mostrarToast("💔 Juego eliminado de favoritos");
                }
                localStorage.setItem(
                    "favoritos", JSON.stringify(favoritos)
                )
                if (vistaActual === "favoritos") {
                    mostrarContenidoFavorito();
                }
        })
    })
}

function botonCompras(){
    const botonesComprar = document.querySelectorAll(".btnComprar")

        botonesComprar.forEach(e => {
            e.addEventListener("click", () => {
                const id = Number(e.dataset.id);
                const item = compras.find(c => c.id === id);

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
                    "compras", JSON.stringify(compras)
                )
                if (vistaActual === "compras") {
                    mostrarContenidoCompras();
                }
        })
    })
}

// Función para los botones "-" del aside para quitar elementos
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

    
// obtiene informacion del localstorage
function obtenerInformacion () {
    favoritos = JSON.parse(
        localStorage.getItem("favoritos")
    ) || [];

    compras = JSON.parse(
        localStorage.getItem("compras")
    ) || [];
}

//Mostrar los juegos en el aside favoritos
function mostrarContenidoFavorito(){
    contenidoAside.innerHTML = ""
    const juegosFavoritos = juego.filter(e => favoritos.includes(e.id))
    juegosFavoritos.forEach(e => {
        const rutaParaIndex = e.imagen.replace("../", ""); 
        contenidoAside.innerHTML += `
            <div class="itemFavorito">
                <img src="${rutaParaIndex} " alt="${e.nombre}"> 
                <p>${e.nombre}</p>
                <button class="btnEliminarFavorito" data-id="${e.id}">-</button>
            </div>
            <br>
            <hr>
        `
    });
    btnEliminarFavorito()
}

//Mostrar los juegos en el aside Compras
function mostrarContenidoCompras() {
    contenidoAside.innerHTML = "";
    
    const juegosCompras = juego.filter(
        e => compras.some(c => c.id === e.id)
    );
    
    juegosCompras.forEach(e => {
        const rutaParaIndex = e.imagen.replace("../", ""); 
        
        const itemCompra = compras.find(
            c => c.id === e.id
        );

        contenidoAside.innerHTML += `
            <div class="itemCompra">
                <img src="${rutaParaIndex}" alt="${e.nombre}">
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

    eventosCantidadCompra();
}

function eventosCantidadCompra(){
    const btnCompraSuma = document.querySelectorAll(".btnCompraSuma")
    const btnCompraMenos = document.querySelectorAll(".btnCompraMenos")

    btnCompraSuma.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const item = compras.find(
                 c => c.id === id
            );

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

        item.cantidad--;

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

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");

    toast.textContent = mensaje;
    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 3000);
}



// Main
botoneraAside()
obtenerInformacion()
cargarCatalogo()