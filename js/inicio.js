//carrusel
async function cargarCarousel() {
    const contenedor = document.getElementById("carousel-inner");

    try {
        const [dogsRes, catsRes] = await Promise.all([
            fetch("https://api.thedogapi.com/v1/images/search?limit=3&size=med"),
            fetch("https://api.thecatapi.com/v1/images/search?limit=3&size=med")
        ]);

        const dogs = await dogsRes.json();
        const cats = await catsRes.json();

        const imagenes = [...dogs, ...cats];

        let html = "";

        imagenes.forEach((img, index) => {
            if (!img.url) return;

            html += `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    
                    <img src="${img.url}" 
                         class="d-block w-100 carousel-img"
                         onerror="this.src='https://via.placeholder.com/800x400?text=Mascota'">

                    <div class="carousel-overlay"></div>

                    <div class="carousel-caption d-flex flex-column justify-content-center h-100">
                        <h2 class="fw-bold">Adopta una mascota 🐾</h2>
                        <p>Encuentra a tu compañero de vida!</p>
                    </div>

                </div>
            `;
        });

        contenedor.innerHTML = html;

    } catch (error) {
        console.error("Error carrusel", error);
    }
}
//4 cards en el inicio
function limitarCards(idContenedor, limite = 4) {
    const contenedor = document.getElementById(idContenedor);

    const aplicarLimite = () => {
        const cards = contenedor.querySelectorAll(".col");

        cards.forEach((card, index) => {
            if (index >= limite) {
                card.classList.add("hidden-card");
            } else {
                card.classList.remove("hidden-card");
            }
        });
    };

    const observer = new MutationObserver(() => {
        aplicarLimite();
    });

    observer.observe(contenedor, { childList: true });

    setTimeout(aplicarLimite, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCarousel();

    limitarCards("contenedor-perros", 4);
    limitarCards("contenedor-gatos", 4);
});