async function cargarGatos() {
    const contenedor = document.getElementById('contenedor-gatos');
    try {
        const respuesta = await fetch("https://api.thecatapi.com/v1/breeds?api_key=live_JPuUpunkl44mrgywnkG74R0O0Kk7zPUUVsOrXL6gaVQe6hrAsqUfqp8tyFeX7wRq");
        const datos = await respuesta.json();
        contenedor.innerHTML = ''; // Limpiar el spinner
        datos.forEach(gato => {
            // Manejo de imagen de la API
            const imagenUrl = gato.image?.url || `https://cdn2.thecatapi.com/images/${gato.reference_image_id}.jpg`;
            contenedor.innerHTML += `
                        <div class="col">
                            <div class="card shadow-sm border-0">
                                <img src="${imagenUrl}" 
                                     class="card-img-top" 
                                     alt    ="${gato.name}" 
                                     onerror="this.src='https://via.placeholder.com/300x200?text=Gato'">
                                <div class="card-body">
                                    <h6 class="card-title fw-bold mb-1">${gato.name}</h6>
                                    <p class="card-text text-muted temperamento-text mb-3">
                                        ${gato.temperament || 'Amigable y leal'}
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
document.addEventListener('DOMContentLoaded', cargarGatos);