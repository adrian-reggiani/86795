
const contenedor = document.getElementById("contenedor-juegos");
const sidebar = document.getElementById("sidebar");
const btnFavoritos = document.getElementById("btnFavoritos")
const btnCarrito = document.getElementById("btnCarrito")
const btnCerrar = document.getElementById("cerrarAside");
const tituloAside = document.getElementById("tituloAside")
const contenidoAside = document.getElementById("contenidoAside");
let favoritos = [];
let juego = [];

// Cargar catalogo a traves de un json de manera dinamica
async function cargarCatalogo() {
    const respuesta = await fetch("../items.json");
    juego = await respuesta.json();

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

    mostrarContenidoFavorito()
    botonFavorito()


    
    const botonesCompras = document.querySelectorAll(".btnComprar")
        botonesCompras.forEach(e => {
            e.addEventListener("click", () => {
            console.log(e.dataset.id);
        })
    })
}

// Funciones


// Botonera para abrir el aside
function botoneraAside(){
    btnFavoritos.addEventListener("click", () => {
    
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
}

// Boton para agregar/quitar de favorito
function botonFavorito(){
    const botonesFavorito = document.querySelectorAll(".btnFavorito")

        botonesFavorito.forEach(e => {
            e.addEventListener("click", () => {
                const id = Number(e.dataset.id);
                if (!favoritos.includes(id)){
                    favoritos.push(id)

                }else{
                    favoritos = favoritos.filter(
                        e => e !== id 
                    )
                }
                localStorage.setItem(
                    "favoritos", JSON.stringify(favoritos)
                )
                mostrarContenidoFavorito()
        })
    })
}

// Función para los botones "-" del aside
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

    


function obtenerInformacion () {
    favoritos = JSON.parse(
        localStorage.getItem("favoritos")
    ) || [];
}

//Mostrar los juegos a favoritos
function mostrarContenidoFavorito(){
    contenidoAside.innerHTML = ""
    const juegosFavoritos = juego.filter(e => favoritos.includes(e.id))
    juegosFavoritos.forEach(e => {
        contenidoAside.innerHTML += `
            <div class="itemFavorito"> 
                <p>${e.nombre}</p>
                <button class="btnEliminarFavorito" data-id="${e.id}">-</button>
            </div>
            <br>
            <hr>
        `
    });
    btnEliminarFavorito()
}

// Main
botoneraAside()
obtenerInformacion()
cargarCatalogo()