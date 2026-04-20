async function cargarPerros() {
    const contenedor = document.getElementById('contenedor-perros');
    try {
        const respuesta = await fetch("https://api.thedogapi.com/v1/breeds?api_key=live_7TOIOLtbYx8V4wpnp7THwNoLunZzMJ2S7rQ8jRsSrA3qGat8YkRrFAj9nzCRZL1h");
        const datos = await respuesta.json();
        contenedor.innerHTML = ''; // Limpiar el spinner
        datos.forEach(perro => {
            // Manejo de imagen de la API
            const imagenUrl = perro.image?.url || `https://cdn2.thedogapi.com/images/${perro.reference_image_id}.jpg`;
            contenedor.innerHTML += `
                        <div class="col">
                            <div class="card shadow-sm border-0">
                                <img src="${imagenUrl}" 
                                     class="card-img-top" 
                                     alt="${perro.name}" 
                                     onerror="this.src='https://via.placeholder.com/300x200?text=Perrito'">
                                <div class="card-body">
                                    <h6 class="card-title fw-bold mb-1">${perro.name}</h6>
                                    <p class="card-text text-muted temperamento-text mb-3">
                                        ${perro.temperament || 'Amigable y leal'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;});
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p class="text-danger text-center w-100">Error al conectar con la API.</p>';
    }
}

// Iniciar carga
document.addEventListener('DOMContentLoaded', cargarPerros);