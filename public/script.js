// script.js
//Ahora no leo el json directamente, lo lee el servidor
    var datos=[];
    async function perfumeria(){
        const response = await fetch ('/api/perfumes');
        const perfumes = await response.json();
        console.log(perfumes);
        visualizar_perfumes(perfumes);
    }
    perfumeria();
           
    //►►►CONTENIDO
    // Llama a esta función después de cargar los perfumes
    function visualizar_perfumes(list) {
   
        // Obtener la sección de productos
        const productosSection = document.querySelector(".productos");
    
        // Limpiar la sección antes de volver a renderizar la vista completa
        productosSection.innerHTML = "";
    
        // Crear los contenedores con encabezados
        productosSection.innerHTML = `
            <div class="seccion"><h2>Perfumes detacados</h2>  <button class="ver-mas-btn">Ver Más</button></div>
            <div id="container-novedades" class="productos-grid"></div>
    
            <div class="seccion"><h2> Perfumes para ella</h2>  <button class="ver-mas-btn">Ver Más</button></div>
            <div id="container-bestsellers" class="productos-grid"></div>
    
            <div class="seccion"><h2> Perfumes para él</h2>  <button class="ver-mas-btn">Ver Más</button></div>
            <div id="container-recomendaciones" class="productos-grid"></div>
    
            <div class="seccion"><h2>Cosmética para tu piel</h2>  <button class="ver-mas-btn">Ver Más</button></div>
            <div id="container-regalos-bestsellers" class="productos-grid"></div>
        `;
        //DOM ELEMENTS correspondencia entre javascript y html
        // Obtener referencias a los nuevos contenedores creados
        const novedadesContainer = document.getElementById("container-novedades");
        const bestSellersContainer = document.getElementById("container-bestsellers");
        const recomendacionesContainer = document.getElementById("container-recomendaciones");
        const regalosMasVendidosContainer = document.getElementById("container-regalos-bestsellers");
             
        // Recorrer la lista de productos y agregarlos a las secciones correspondientes
        list.forEach(perfume => {
            const perfumeElemento = document.createElement("div");
            perfumeElemento.classList.add("producto");
            perfumeElemento.innerHTML = `
                <img class="imagen" src="${perfume.imagen}" alt="${perfume.title}">
                <br><br>
                <div>
                    <h3><strong>${perfume.title}</strong></h3>
                    <button class="favorites" onclick="agregarAFavorito(event, '${perfume.title}')">
                        <img class="marker-icon" src="images/icon/icons8-favorites-96.png" alt="favorite_border">
                    </button>
                </div>
                <div>
                    <p style="font-size: 15px; opacity: 30%; text-align: left;">${perfume.autor}</p>
                </div>
                <div>
                    <p style="font-size: 20px;">${perfume.precio} €</p>
                    <h3 style="display: none;"><strong>${perfume.title}</strong></h3>
                    <button class="paperbag" onclick="agregarAlaBolsa(event, '${perfume.title}','${perfume.precio}')">
                        <img class="marker-icon" src="images/icon/icons8-paper-bag-96.png" alt="favorite_border">
                    </button>
                </div> 
                <br>   
                <a href="detalles.html?id=${perfume.id}" class="view-details">
                    <svg xmlns="http://www.w3.org/2000/svg">
                        <rect class="border" pathLength="100"></rect>
                        <rect class="loading" pathLength="100"></rect>
                    <div class="txt-upload">Ver detalles</div>
                    </svg>
                </a>
            `;
            
            if (perfume.novedad) {
                novedadesContainer.appendChild(perfumeElemento.cloneNode(true));
            }
            if (perfume.bestSeller) {
                bestSellersContainer.appendChild(perfumeElemento.cloneNode(true));
            }
            if (perfume.recomendado) {
                recomendacionesContainer.appendChild(perfumeElemento.cloneNode(true));
            }
            if (perfume.tipo === "regalo" && perfume.bestSeller) {
                regalosMasVendidosContainer.appendChild(perfumeElemento.cloneNode(true));
            }
        });
        actualizarFavoritos();
        actualizarPaperbag ();
    }
      





/******************************************************************************//////////////////////////////////////////////
//►►► FAVORITOS Y PAPER BAG*************************************************************************************************
//local Storage
const list_favorites=JSON.parse(localStorage.getItem('favorites')) || [];
// Función para agregar o quitar un producto de favoritos
function agregarAFavorito(event, nombre) {
    event.preventDefault();
    const index = list_favorites.findIndex(item => item.nombre === nombre); // Verificar si el perfume ya está en la lista de favoritos
    const botonFavorito = event.target.closest("button"); // Obtenemos el botón que fue presionado
    const iconoFavorito = botonFavorito.querySelector("img"); // Seleccionar el icono dentro del botón

    if (index === -1) {                           // Si no está en la lista, agregarlo
        list_favorites.push({nombre: nombre});
        iconoFavorito.src = "images/icon/icons8-favorites-96-yellow-relleno.png"; // Reemplaza por el icono coloreado
        //botonFavorito.classList.add("favorito"); // Agregar la clase 'favorito' al botón
        alert(`${nombre} ha sido agregado a tus favoritos.`);
   } else {
        list_favorites.splice(index, 1);         // Si ya está en la lista, eliminarlo
        alert(`${nombre} ha sido eliminado de tus favoritos.`);
        //botonFavorito.classList.remove("favorito"); // Quitar la clase 'favorito' del botón
        iconoFavorito.src = "images/icon/icons8-favorites-96.png"; // Reemplaza por el icono original
    }
    localStorage.setItem("favorites", JSON.stringify(list_favorites)); // Guardar la lista actualizada en localStorage
    console.log(list_favorites);                // Ver los favoritos en la consola
    actualizarFavoritos();
    actualizarFavorito2()
}


// Función para actualizar el estado de los botones de favoritos al cargar la página
function actualizarFavoritos() {
    // Obtener todos los botones con la clase 'favorites' (que son los botones de favoritos)
    const botonesFavoritos = document.querySelectorAll("button.favorites");
    console.log(list_favorites);
    // Recorrer todos los botones
    botonesFavoritos.forEach(boton => {
        // Obtener el nombre del perfume que está en el botón
        const nombreperfume = boton.closest('div').querySelector('h3').innerText.trim(); // Obtener el título del perfume (de <h3>)
        const iconoFavorito = boton.querySelector("img"); // Obtener el icono dentro del botón
        // Verificar si el nombre del perfume está en la lista de favoritos
        const perfumeEnFavoritos = list_favorites.some(item => item.nombre === nombreperfume);
         if (perfumeEnFavoritos) {
            // Si está en favoritos, cambia el icono a uno amarillo
            iconoFavorito.src = "images/icon/icons8-favorites-96-yellow-relleno.png";
        } else {
            // Si no está en favoritos, pone el icono gris
            iconoFavorito.src = "images/icon/icons8-favorites-96.png";
        }
    });
}

function actualizarFavorito2() {
    const headFavorito = document.getElementById("favorito"); // Obtener el elemento del ícono en el header
    const icono = headFavorito.querySelector("img"); // Obtener el icono dentro de ese elemento

    // Verificar si la lista de favoritos está vacía
    if (list_favorites.length === 0) {
        icono.src = "images/icon/icons8-favorites-96-yellow.png"; // Icono gris si no hay favoritos
    } else {
        icono.src = "images/icon/icons8-favorites-96-yellow-relleno.png"; // Icono amarillo si hay favoritos
    }
}

//Mostrar los favoritos
function mostrarFavoritos(event) {
    const favtContainer = document.getElementById("favt-container");
    const favtList = document.getElementById("favt-list");
    // Mostrar u ocultar el contenedor
    favtContainer.classList.remove("hidden");
    // Limpiar la lista de favoritos
    favtList.innerHTML = "";
    // Verificar si la bolsa de favoritos está vacía
    if (list_favorites.length === 0) {
        favtList.innerHTML = "<li>No tienes favoritos</li>";
    } else {
    // Crear la lista de productos
        list_favorites.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nombre} 
                <div class="car-button">
                    <button onclick="eliminarFavorito(${index})">🗑️ Quitar</button>
                </div>
            `;
            favtList.appendChild(li);
        });
    }
}

// Eliminar un producto
function eliminarFavorito(index) {
    list_favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(list_favorites));
    //actualizarContadorFavoritos();
    mostrarFavoritos();
    actualizarFavoritos();
    actualizarFavorito2()
}

// Vaciar la bolsa de favoritos
function vaciarBolsaFavoritos() {
    list_favorites = [];
    localStorage.setItem("favorites", JSON.stringify(list_favorites));
    //actualizarContadorFavoritos();
    mostrarFavoritos();
    actualizarFavoritos();
    actualizarFavorito2()
    // Cerrar el carrito si está vacío
    const favtContainer = document.getElementById("favt-container");
    favtContainer.classList.add("hidden");
}

// Llamar al contador al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    //actualizarContadorFavoritos();
    actualizarFavorito2()
});






// ******************************************************************************************************************
/******************************************************************************//////////////////////////////////////////////
//►►►PAPER BAG//►►►PAGINA DE COMPRAR PRODUCTOS********************************************************************************
//local Storage
let list_paperbag = JSON.parse(localStorage.getItem('paperbag')) || [];
// Función para agregar o eliminar el producto en el carrito
function agregarAlaBolsa(event, nombre, precio) {
    event.preventDefault(); // Prevenir eventos no deseados
    const productoEnBolsa = list_paperbag.find(item => item.nombre === nombre);// Verificar si el perfume ya está en la lista de compra
    const botonBolsa = event.target.closest("button"); // Obtenemos el botón que fue presionado
    const iconoBolsa = botonBolsa.querySelector("img"); // Seleccionar el icono dentro del botón

    if (productoEnBolsa) {
        // Si el producto ya está en la bolsa, lo eliminamos
        list_paperbag = list_paperbag.filter(item => item.nombre !== nombre);
        alert(`${nombre} ha sido eliminado de la bolsa.`);
        iconoBolsa.src = "images/icon/icons8-paper-bag-96.png"; // Reemplazar por el icono no rellenado
        console.log(`🗑️ ${nombre} eliminado de la bolsa.`);
    } else {
        // Si el producto no está en la bolsa, lo agregamos con cantidad 1
        list_paperbag.push({ nombre: nombre, precio: parseFloat(precio), cantidad: 1 });
        alert(`${nombre} ha sido agregado a la bolsa.`);
        iconoBolsa.src = "images/icon/icons8-paper-bag-96-yellow-relleno.png"; // Reemplazar por el icono rellenado
        console.log(`✅ ${nombre} agregado a la bolsa.`);
    }

    // Guardar en localStorage
    localStorage.setItem("paperbag", JSON.stringify(list_paperbag));
    console.log(list_paperbag);

    // Actualizar el contador y los detalles de la bolsa
    actualizarContadorBolsa();
    mostrarBolsa();
    actualizarPaperbag(); // Llamamos a la función para actualizar el estado de los botones
}

// Función para actualizar el estado de los botones de 'paperbag' al cargar la página
function actualizarPaperbag() {
    // Obtener todos los botones con la clase 'paperbag' (que son los botones de carrito)
    const botonesPaperbag = document.querySelectorAll("button.paperbag");
    console.log(list_paperbag);
    botonesPaperbag.forEach(boton => {
        // Obtener el nombre del perfume desde el contenedor superior, no desde el botón
        const nombreperfume = boton.closest('div').querySelector('h3').innerText.trim();// Obtener el título del perfume (de <h3>)
        const iconoBolsa = boton.querySelector("img"); // Obtener el icono dentro del botón

        // Verificar si el nombre del perfume está en la lista de la bolsa
        const productoEnBolsa = list_paperbag.find(item => item.nombre === nombreperfume);
        if (productoEnBolsa) {
            // Si está en la bolsa, cambia el icono a uno amarillo (indicando que está en el carrito)
            iconoBolsa.src = "images/icon/icons8-paper-bag-96-yellow-relleno.png";
        } else {
            // Si no está en la bolsa, pone el icono gris
            iconoBolsa.src = "images/icon/icons8-paper-bag-96.png";
        }
    });
}


//Incrementar un Producto
function incrementarCantidad(nombre){
    const productoEnBolsa = list_paperbag.find(item => item.nombre === nombre);
    if (productoEnBolsa) {
        // Aumentar la cantidad
        productoEnBolsa.cantidad += 1;
        //alert(`Cantidad de ${nombre}: ${productoEnBolsa.cantidad}`);
        // Guardar los cambios en localStorage
        localStorage.setItem("paperbag", JSON.stringify(list_paperbag));
        // Ver la bolsa en la consola
        console.log(list_paperbag);
        actualizarContadorBolsa();
        mostrarBolsa();
        actualizarPaperbag();
        //console.log(`🔼 Cantidad de ${nombre} incrementada a ${productoEnBolsa.cantidad}.`);
    } 
}


// Función para reducir la cantidad de un producto
function reducirCantidad(nombre) {
    const productoEnBolsa = list_paperbag.find(item => item.nombre === nombre);
    if (productoEnBolsa && productoEnBolsa.cantidad > 1) {
        // Reducir la cantidad
        productoEnBolsa.cantidad -= 1;
        //alert(`Cantidad de ${nombre} reducida. Cantidad: ${productoEnBolsa.cantidad}`);
    } else if (productoEnBolsa && productoEnBolsa.cantidad === 1) {
        // Eliminar producto si la cantidad llega a 1
        list_paperbag = list_paperbag.filter(item => item.nombre !== nombre);
        //alert(`${nombre} ha sido eliminado de la bolsa.`);
    }
    // Guardar los cambios en localStorage
    localStorage.setItem("paperbag", JSON.stringify(list_paperbag));
    // Ver la bolsa en la consola
    console.log(list_paperbag);
    actualizarContadorBolsa();
    mostrarBolsa();
    actualizarPaperbag();
}

// Actualizar el contador de la bolsa
function actualizarContadorBolsa() {
    const totalProductos = list_paperbag.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById("cart-count").textContent = totalProductos;
    //console.log(`🛒 Contador actualizado: ${totalProductos} productos en la bolsa.`);
}

// Mostrar la bolsa
function mostrarBolsa(event) {
    const cartContainer = document.getElementById("cart-container");
    const cartList = document.getElementById("cart-list");
    // Mostrar u ocultar el contenedor
    cartContainer.classList.remove("hidden");
    // Limpiar la lista
    cartList.innerHTML = "";
    // Verificar si la bolsa está vacía
    if (list_paperbag.length === 0) {
        cartList.innerHTML = "<li>Tu bolsa está vacía</li>";
    } else {
        let totalFactura = 0; // Inicializar el total
        // Crear la lista de productos
        list_paperbag.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad; // Subtotal del producto
            totalFactura += subtotal; // Sumar al total

            const li = document.createElement("li");
            li.innerHTML = `
                    ${item.nombre} 
                    - ($${item.precio.toFixed(2)})
                <div class="car-button">
                    <button onclick="reducirCantidad('${item.nombre}')">-</button>
                    <p>${item.cantidad}</p>
                    <button onclick="incrementarCantidad('${item.nombre}', ${item.precio})">+</button>
                    <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
                </div>
                $${subtotal.toFixed(2)}
            `;
            cartList.appendChild(li);
        });
        // Agregar el total de la factura al final de la lista
        const totalLi = document.createElement("li");
        totalLi.style.fontWeight = "bold";  totalLi.style.justifyContent = "flex-end";
        totalLi.textContent = `Total: $${totalFactura.toFixed(2)}`;
        cartList.appendChild(totalLi);
    }
}


// Eliminar un producto
function eliminarProducto(index) {
    list_paperbag.splice(index, 1);
    localStorage.setItem("paperbag", JSON.stringify(list_paperbag));
    actualizarContadorBolsa();
    mostrarBolsa();
    actualizarPaperbag();
}

// Vaciar la bolsa
function vaciarBolsa() {
    list_paperbag = [];
    localStorage.setItem("paperbag", JSON.stringify(list_paperbag));
    actualizarContadorBolsa();
    mostrarBolsa();
    actualizarPaperbag();
    // Cerrar el carrito si está vacío
    const cartContainer = document.getElementById("cart-container");
    cartContainer.classList.add("hidden");
}
// Llamar al contador al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorBolsa();
});


// CERRAR el carrito
// evento global para detectar clics fuera del carrito
document.addEventListener("click", (event) => {
    const cartContainer = document.getElementById("cart-container");
    const cartIcon = document.querySelector(".cart"); // Ícono de la bolsa
    // Verifica si el clic está fuera del carrito, del ícono o de los botones dentro del carrito
    if (
        !cartContainer.classList.contains("hidden") && // Si el carrito está visible
        !cartContainer.contains(event.target) && // Si el clic no está dentro del carrito
        !cartIcon.contains(event.target) && // Y no está en el ícono
        !event.target.closest("button") // Y no proviene de un botón dentro del carrito
    ) {
        cartContainer.classList.add("hidden"); // Cerrar el carrito
    }
});

// Botón "Comprar"
function realizarCompra() {
    if (list_paperbag.length === 0) {
        alert("Tu bolsa está vacía. Agrega productos para realizar la compra.");
        return;
    }
    // Simular proceso de compra
    alert("¡Compra realizada con éxito! Gracias por tu pedido.");
    // Vaciar la bolsa después de la compra
    vaciarBolsa();
}





// ********************************************************************************************************************************
//FUNCION DE BUSCADOR TEXTO////////////////////////////////////////////////////////////////////////////////////////////////////////
// Capturar elementos del DOM
const search_Bar = document.querySelector('.search input'); // Corrige la selección del input de búsqueda
const productosSection = document.querySelector(".productos");

// Variable para almacenar los productos
let productos = [];

    // Cargar productos desde el servidor
    async function cargarProductos() {
        try {
            const response = await fetch('/api/perfumes'); // Carga desde el servidor
            productos = await response.json();
            console.log("Productos cargados:", productos);

            // Mostrar todos los productos al inicio
            visualizar_perfumes(productos);

            // Activar filtros después de cargar productos
            activarFiltros();

        } catch (error) {
            console.error("Error cargando los productos:", error);
        }
    }
    // Ejecutar carga de productos al inicio
    cargarProductos();

// Escuchar evento de búsqueda
search_Bar.addEventListener("input", function() {
    const searchText = search_Bar.value.toLowerCase().trim();
    filtrarProductosSearch(searchText);
});

// Función para normalizar texto (elimina tildes)
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Función para filtrar y mostrar los resultados
function filtrarProductosSearch(searchText) {
    if (!productos.length) {
        console.log("Esperando carga de productos...");
        return;
    }

    // Dividir la búsqueda en palabras individuales
    const palabrasClave = searchText.split(/\s+/).filter(palabra => palabra.length > 0); // Eliminar espacios vacíos

    // Filtrar productos según el texto ingresado
    const perfumesFiltrados = productos.filter(producto =>
        (producto.tipo === "perfume") &&
        palabrasClave.some(palabra =>
            normalizarTexto(producto.title)?.toLowerCase().includes(palabra) ||
            normalizarTexto(producto.autor)?.toLowerCase().includes(palabra) ||
            normalizarTexto(producto.categoria)?.toLowerCase().includes(palabra) ||
            normalizarTexto(producto.descripcion)?.toLowerCase().includes(palabra)
        )

    );

    // Actualizar la vista con los resultados
    mostrarResultados(perfumesFiltrados);
}

// Función para actualizar la página con los resultados filtrados
function mostrarResultados(perfumes) {
    // ✅ Si NO hay filtros seleccionados, limpiar y volver a cargar la vista completa
    if (perfumes.length === 0 && regalos.length === 0) {
        console.log("No hay nada en el buscador, mostrando todos los perfumes con encabezados.");
        // ⚠️ Limpiar todo el contenedor antes de volver a renderizar la vista completa
        //productosSection.innerHTML = "";
        visualizar_perfumes(productos); // Restaurar la página completa con encabezados
        return;
    }

    // Limpiar la sección actual
    productosSection.innerHTML = "";
    // Sección de perfumes
    if (perfumes.length > 0) {
        // Crear el título en su propio div
        const perfumesTituloSection = document.createElement("div");
        perfumesTituloSection.classList.add("seccion");
        const perfumesTitulo = document.createElement("h2");
        perfumesTitulo.textContent = "Perfumes Relacionados";
        
        perfumesTituloSection.appendChild(perfumesTitulo); // Agregar el título dentro de .seccion
        productosSection.appendChild(perfumesTituloSection); // Agregar la sección al contenedor principal
    
        // Crear el contenedor de productos al mismo nivel
        const perfumesContainer = document.createElement("div");
        perfumesContainer.classList.add("productos-grid");
    
        perfumes.forEach(perfume => {
            perfumesContainer.innerHTML += generarHTMLProducto(perfume);
        });
    
        productosSection.appendChild(perfumesContainer); // Agregar los productos después del título
    }

}

// Función para generar HTML de cada producto
function generarHTMLProducto(producto) {
    return `
    <br>
    <div class="producto">
        <img src="${producto.imagen}" alt="${producto.title}">
        <br><br>
        <div>
            <h3><strong>${producto.title}</strong></h3>
            <button class="favorites" onclick="agregarAFavorito(event, '${producto.title}')">
                <img class="marker-icon" src="images/icon/icons8-favorites-96.png" alt="favorite_border">
            </button>
        </div>
        <div>
            <p style="font-size: 15px; opacity: 30%; text-align: left;">${producto.autor}</p>
        </div>
        <div>
            <p style="font-size: 20px;">${producto.precio} €</p>
            <h3 style="display: none;"><strong>${producto.title}</strong></h3>
            <button class="paperbag" onclick="agregarAlaBolsa(event, '${producto.title}','${producto.precio}')">
                <img class="marker-icon" src="images/icon/icons8-paper-bag-96.png" alt="favorite_border">
            </button>
        </div> 
        <br>   
        <a href="detalles.html?id=${producto.id}" class="view-details">
            <svg xmlns="http://www.w3.org/2000/svg">
                <rect class="border" pathLength="100"></rect>
                <rect class="loading" pathLength="100"></rect>
            <div class="txt-upload">Ver detalles</div>
            </svg>
        </a>
    </div>
    `;
}



// ******************************************************************************************************************
//iNICIO DE SESION DE USUARIOS***************************************************************************************
// Verificar si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/perfil');
      const userData = await response.json();
      console.log(userData);
  
      if (userData.user) {
        document.getElementById('noAuth').style.display = 'none';
        document.getElementById('auth').style.display = 'flex';
        document.getElementById('username').textContent = userData.user;
      } else {
        document.getElementById('noAuth').style.display = 'block';
        document.getElementById('auth').style.display = 'none';
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
    }
  });
  
  // Función para cerrar sesión
  async function logout() {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) window.location.href = '/';
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  }
  // Asegurarme que la funcion logout esta definida
  window.logout = logout;
