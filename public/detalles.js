// Alternar menú de navegación en móviles
function toggleMenu() {
    document.querySelector('.nav').classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", async () => {
    // Recupera el carrito desde localStorage
    let list_paperbag = JSON.parse(localStorage.getItem('paperbag')) || [];
    const totalProductos = list_paperbag.reduce((total, item) => total + item.cantidad, 0);

    // Actualiza el contador del carrito
    document.getElementById("cart-count").textContent = totalProductos;

    // Cargar el producto desde el servidor según el ID pasado en la URL
    const productoId = new URLSearchParams(window.location.search).get('id');

    if (productoId) {
        try {
            const response = await fetch('/api/perfumes');
            const datos = await response.json();
            console.log(datos);

            const producto = datos.find(item => item.id == productoId); // Buscar el producto por ID
            if (producto) {
                mostrarDetallesProducto(producto);
                cargarReseñas(productoId);
            } else {
                document.getElementById('producto-detalle').innerHTML = `<p>Producto no encontrado.</p>`;
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    }

    // Configurar las estrellas de valoración
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("review-rating");

    stars.forEach(star => {
        star.addEventListener("click", function () {
            const value = this.getAttribute("data-value");
            ratingInput.value = value;

            // Marcar las estrellas seleccionadas
            stars.forEach(s => {
                s.innerHTML = "&#9734;"; // Vacia todas
                if (s.getAttribute("data-value") <= value) {
                    s.innerHTML = "&#9733;"; // Llena hasta la seleccionada
                }
            });
        });
    });

    // Manejo de envío de reseñas
    document.getElementById("form-review").addEventListener("submit", function (event) {
        event.preventDefault();

        const rating = ratingInput.value;
        const titulo = document.getElementById("review-title").value;
        const comentario = document.getElementById("review-comment").value;
        const nombre = document.getElementById("review-name").value;
        const email = document.getElementById("review-email").value;

        let imagenURL = "";
        const imagenInput = document.getElementById("review-image");
        if (imagenInput.files.length > 0) {
            imagenURL = URL.createObjectURL(imagenInput.files[0]);
        }

        let reseñas = JSON.parse(localStorage.getItem(`reseñas-${productoId}`)) || [];
        reseñas.push({ rating, titulo, comentario, nombre, email, imagen: imagenURL });

        localStorage.setItem(`reseñas-${productoId}`, JSON.stringify(reseñas));
        cargarReseñas(productoId);

        document.getElementById("form-review").reset();
    });

    // Cancelar reseña
    document.getElementById("cancel-review").addEventListener("click", () => {
        document.getElementById("form-review").reset();
    });
});

// Función para mostrar los detalles del producto
function mostrarDetallesProducto(producto) {
    let autorOMarca = producto.tipo === "libro" 
        ? `<a href="autor.html?nombre=${encodeURIComponent(producto.autor)}" class="autor-link">${producto.autor || "Desconocido"}</a>`
        : `<span class="autor-link">${producto.autor || "Genérico"}</span>`;

    document.getElementById('producto-detalle').innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.title}">
        <div class="descripcion">
            <h2>${producto.title}</h2>
            <p>${producto.tipo === "libro" ? "" : ""} ${autorOMarca}</p>
            <p class="precio-libro">${producto.precio} €</p>
            
            <div class="acciones">
                <button class="button-common" class="paperbag">
                    <div>30 ML</div>
                    <div><span class="price">95,97&nbsp;€</span> / 100 ML</div>
                </button>
                <button class="button-common" class="paperbag">
                    <div>60 ML</div>
                    <div><span class="price">74,92&nbsp;€</span> / 100 ML</div>
                </button>
                <button class="button-common" class="paperbag">
                    <div>100 ML</div>
                    <div><span class="price">58,89&nbsp;€</span> / 100 ML</div>
                </button>
            </div>

            <div class="acciones">
                <!-- Botón de agregar a la bolsa con icono -->
                <button class="button-common" class="paperbag" onclick="agregarAlaBolsa(event, '${producto.title}', '${producto.precio}')">
                    <span><img class="icon" src="images/icon/icons8-paper-bag-96.png" alt="Agregar a la Bolsa">
                    Agregar a la Bolsa</span>
                </button>

                <!-- Botón de agregar a favoritos con icono -->
                <button class="button-common" class="favorites" onclick="agregarAFavorito(event, '${producto.title}')">
                    <span><img class="icon" src="images/icon/icons8-favorites-96.png" alt="Agregar a Favoritos">
                    Agregar a la Favoritos</span>
                </button>
            </div>



            <!-- 📌 Descripción del libro -->
            <div class="book-description">
                <h3><u>Descripción</u></h3>
                <p>${producto.descripcion}</p>
            </div>
        </div>
    `;

    // Asegurar que los iconos reflejen si el producto ya está en la bolsa o en favoritos
    actualizarIconos(producto.title);
}


// 📌 Función para actualizar iconos de favoritos y bolsa al cargar la página
function actualizarIconos(nombreProducto) {
    const favoritos = JSON.parse(localStorage.getItem('favorites')) || [];
    const bolsa = JSON.parse(localStorage.getItem('paperbag')) || [];

    // Actualizar icono de favoritos
    const botonFavorito = document.querySelector(".favorites img");
    if (favoritos.includes(nombreProducto)) {
        botonFavorito.src = "images/icon/icons8-favorites-96-yellow-relleno.png";
    } else {
        botonFavorito.src = "images/icon/icons8-favorites-96.png";
    }

    // Actualizar icono de bolsa
    const botonBolsa = document.querySelector(".paperbag img");
    const enBolsa = bolsa.some(item => item.nombre === nombreProducto);
    if (enBolsa) {
        botonBolsa.src = "images/icon/icons8-paper-bag-96-yellow-relleno.png";
    } else {
        botonBolsa.src = "images/icon/icons8-paper-bag-96.png";
    }
}


// Función para cargar reseñas desde `localStorage`
function cargarReseñas(productoId) {
    let reseñas = JSON.parse(localStorage.getItem(`reseñas-${productoId}`)) || [];
    const listaReviews = document.getElementById('lista-reviews');
    listaReviews.innerHTML = "";

    reseñas.forEach(review => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${review.nombre}</strong> - ${review.rating} ⭐
            <p><strong>${review.titulo}</strong></p>
            <p>${review.comentario}</p>
            ${review.imagen ? `<img src="${review.imagen}" class="review-img">` : ""}
        `;
        listaReviews.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let currentReviewIndex = 0;
    const reviewsContainer = document.querySelector(".review-items");
    const reviews = document.querySelectorAll(".review-item");
    const totalReviews = reviews.length;

    function showReview(index) {
        reviewsContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    document.getElementById("next-review").addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex + 1) % totalReviews;
        showReview(currentReviewIndex);
    });

    document.getElementById("prev-review").addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex - 1 + totalReviews) % totalReviews;
        showReview(currentReviewIndex);
    });

    showReview(currentReviewIndex);

    // Estrellas de valoración
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("review-rating");

    function highlightStars(value) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= value);
        });
    }

    stars.forEach(star => {
        star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
        star.addEventListener("click", () => {
            ratingInput.value = star.dataset.value;
            highlightStars(star.dataset.value);
        });
    });
});


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
