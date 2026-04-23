function mezclarAleatorio(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function tomarAleatorios(lista, cantidad) {
    return mezclarAleatorio(lista).slice(0, cantidad);
}

function obtenerImagenPerro(mascota) {
    return mascota.image?.url || (mascota.reference_image_id
        ? `https://cdn2.thedogapi.com/images/${mascota.reference_image_id}.jpg`
        : "");
}

function obtenerImagenGato(mascota) {
    return mascota.image?.url || (mascota.reference_image_id
        ? `https://cdn2.thecatapi.com/images/${mascota.reference_image_id}.jpg`
        : "");
}

function normalizarMascotaEnSlide(mascota, tipo) {
    return {
        tipo,
        name: (mascota.name || "Amigo peludo").trim(),
        imagenUrl: tipo === "Perro" ? obtenerImagenPerro(mascota) : obtenerImagenGato(mascota)
    };
}

function seleccionarSinRepetir(claveStorage, lista, cantidad) {
    const anterior = JSON.parse(sessionStorage.getItem(claveStorage) || "[]");
    const sinRepetidos = lista.filter(item => !anterior.includes(item.name));
    const base = sinRepetidos.length >= cantidad ? sinRepetidos : lista;
    const seleccion = tomarAleatorios(base, Math.min(cantidad, base.length));
    sessionStorage.setItem(claveStorage, JSON.stringify(seleccion.map(item => item.name)));
    return seleccion;
}

function obtenerSlidesDesdeApartado() {
    const perros = window.mascotasData?.perros || [];
    const gatos = window.mascotasData?.gatos || [];

    const perrosConImagen = perros
        .map(mascota => normalizarMascotaEnSlide(mascota, "Perro"))
        .filter(mascota => mascota.imagenUrl);

    const gatosConImagen = gatos
        .map(mascota => normalizarMascotaEnSlide(mascota, "Gato"))
        .filter(mascota => mascota.imagenUrl);

    return {
        perrosConImagen,
        gatosConImagen
    };
}

function renderizarCarousel(seleccion, contenedor) {
    const html = seleccion.map((mascota, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${mascota.imagenUrl}"
                    class="d-block w-100 carousel-img"
                    alt="${mascota.name || "Mascota"}"
                    onerror="this.src='https://via.placeholder.com/800x400?text=Mascota'">
            <div class="carousel-overlay"></div>
            <div class="carousel-caption d-flex flex-column justify-content-center h-100">
                <h2 class="fw-bold">${mascota.name || "Amigo peludo"} 🐾</h2>
                <p>${mascota.tipo} en adopcion</p>
            </div>
        </div>
    `).join("");

    contenedor.innerHTML = html || `
        <div class="carousel-item active">
            <img src="https://via.placeholder.com/800x400?text=Sin+imagenes"
                    class="d-block w-100 carousel-img"
                    alt="Sin imagenes">
            <div class="carousel-overlay"></div>
            <div class="carousel-caption d-flex flex-column justify-content-center h-100">
                <h2 class="fw-bold">Adopta una mascota 🐾</h2>
                <p>Pronto tendremos imagenes disponibles.</p>
            </div>
        </div>
    `;
}

// carrusel de 10 perros + 10 gatos aleatorios usando tarjetas del apartado existente
function cargarCarousel() {
    const contenedor = document.getElementById("carousel-inner");
    if (!contenedor) return;

    const intentarConstruir = () => {
        const { perrosConImagen, gatosConImagen } = obtenerSlidesDesdeApartado();
        const haySuficientes = perrosConImagen.length >= 10 && gatosConImagen.length >= 10;
        if (!haySuficientes) return false;

        const seleccionPerros = seleccionarSinRepetir("carousel_perros_previos", perrosConImagen, 10);
        const seleccionGatos = seleccionarSinRepetir("carousel_gatos_previos", gatosConImagen, 10);
        const seleccion = mezclarAleatorio([...seleccionPerros, ...seleccionGatos]);

        renderizarCarousel(seleccion, contenedor);
        return true;
    };

    if (intentarConstruir()) return;

    const observer = new MutationObserver(() => {
        if (intentarConstruir()) {
            observer.disconnect();
        }
    });

    const contenedorPerros = document.getElementById("contenedor-perros");
    const contenedorGatos = document.getElementById("contenedor-gatos");
    if (contenedorPerros) observer.observe(contenedorPerros, { childList: true, subtree: true });
    if (contenedorGatos) observer.observe(contenedorGatos, { childList: true, subtree: true });

    setTimeout(() => {
        observer.disconnect();
        const { perrosConImagen, gatosConImagen } = obtenerSlidesDesdeApartado();
        const seleccionFallback = mezclarAleatorio([
            ...tomarAleatorios(perrosConImagen, Math.min(10, perrosConImagen.length)),
            ...tomarAleatorios(gatosConImagen, Math.min(10, gatosConImagen.length))
        ]);
        if (seleccionFallback.length > 0) {
            renderizarCarousel(seleccionFallback, contenedor);
        }
    }, 20000);
}
// Navegacion por bloques de 4 cards, maximo 8 animales por seccion
function habilitarNavegacionCards(idContenedor, limite = 4, maximo = 8) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    const crearControles = () => {
        let controles = document.getElementById(`${idContenedor}-controles`);
        if (controles) return controles;

        controles = document.createElement("div");
        controles.id = `${idContenedor}-controles`;
        controles.className = "d-flex justify-content-between align-items-center";
        controles.style.position = "absolute";
        controles.style.top = "35%";
        controles.style.left = "0";
        controles.style.right = "0";
        controles.style.transform = "translateY(-50%)";
        controles.style.padding = "0 8px";
        controles.style.pointerEvents = "none";
        controles.style.zIndex = "20";
        controles.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm rounded-circle shadow" style="width:36px;height:36px;pointer-events:auto;position:relative;z-index:21;" data-accion="prev" aria-label="Anterior">←</button>
            <button type="button" class="btn btn-primary btn-sm rounded-circle shadow" style="width:36px;height:36px;pointer-events:auto;position:relative;z-index:21;" data-accion="next" aria-label="Siguiente">→</button>
        `;

        contenedor.style.position = "relative";
        contenedor.style.zIndex = "1";
        contenedor.appendChild(controles);
        return controles;
    };

    const aplicarPaginacionAleatoria = () => {
        const cards = Array.from(contenedor.querySelectorAll(".col"));
        if (!cards.length) return false;

        const controles = crearControles();
        const btnPrev = controles.querySelector("[data-accion='prev']");
        const btnNext = controles.querySelector("[data-accion='next']");

        const ordenAleatorio = mezclarAleatorio(cards).slice(0, Math.min(maximo, cards.length));
        cards.forEach(card => card.classList.add("hidden-card"));
        ordenAleatorio.forEach(card => contenedor.appendChild(card));

        const totalPaginas = Math.max(1, Math.ceil(ordenAleatorio.length / limite));
        let paginaActual = 0;

        const renderPagina = () => {
            const inicio = paginaActual * limite;
            const fin = inicio + limite;
            ordenAleatorio.forEach((card, index) => {
                card.classList.toggle("hidden-card", !(index >= inicio && index < fin));
            });

            btnPrev.disabled = paginaActual === 0;
            btnNext.disabled = paginaActual === totalPaginas - 1;
            controles.style.display = totalPaginas > 1 ? "flex" : "none";
        };

        btnPrev.onclick = () => {
            if (paginaActual > 0) {
                paginaActual -= 1;
                renderPagina();
            }
        };

        btnNext.onclick = () => {
            if (paginaActual < totalPaginas - 1) {
                paginaActual += 1;
                renderPagina();
            }
        };

        renderPagina();
        return true;
    };

    const observer = new MutationObserver(() => {
        if (aplicarPaginacionAleatoria()) {
            observer.disconnect();
        }
    });

    observer.observe(contenedor, { childList: true });

    if (aplicarPaginacionAleatoria()) {
        observer.disconnect();
    } else {
        setTimeout(() => {
            aplicarPaginacionAleatoria();
            observer.disconnect();
        }, 2000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCarousel();
    window.addEventListener("mascotas:perros-cargados", cargarCarousel);
    window.addEventListener("mascotas:gatos-cargados", cargarCarousel);

    habilitarNavegacionCards("contenedor-perros", 4, 8);
    habilitarNavegacionCards("contenedor-gatos", 4, 8);
});