window.mascotasData = window.mascotasData || { perros: [], gatos: [] };

function renderGatos(datos) {
    const contenedor = document.getElementById('contenedor-gatos');
    const seccion = document.getElementById('seccion-gatos');
    if (!contenedor) return;

    if (!datos.length) {
        contenedor.innerHTML = '';
        if (seccion) seccion.style.display = 'none';
        return;
    }

    if (seccion) seccion.style.display = 'block';
    contenedor.innerHTML = '';
    datos.forEach(mascota => {
        const imagenUrl = mascota.image?.url || `https://cdn2.thecatapi.com/images/${mascota.reference_image_id}.jpg`;
        const mascotaCodificada = encodeURIComponent(JSON.stringify(mascota));
        contenedor.innerHTML += `
    <div class="col">
        <div class="card shadow h-100 tarjeta-mascota" 
             data-mascota="${mascotaCodificada}"
             data-tipo-animal="Gato"
             data-imagen="${imagenUrl}"
             style="cursor: pointer; transition: all 0.3s ease;">
            
            <img src="${imagenUrl}" class="card-img-top" alt="${mascota.name}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=${mascota.name?.slice(0,10)}'">
            <div class="card-body p-3">
                <h5 class="card-title fw-bold text-primary mb-0">${mascota.name}</h5>
            </div>

            <div class="card-body border-top p-3 bg-light">
                <div class="d-grid">
                    <button class="btn btn-success btn-lg shadow-lg adoptar-btn fw-bold fs-6 py-2" 
                    data-name="${mascota.name}" 
                    data-tipo="Gato"
                    data-img="${imagenUrl}"
                    data-raza="${mascota.name}">
                ¡Quiero Adoptar a ${mascota.name}!
                </button>
                </div>
            </div>
        </div>
    </div>
`});
}

async function cargarGatos() {
    const contenedor = document.getElementById('contenedor-gatos');
    try {
        const respuesta = await fetch("https://api.thecatapi.com/v1/breeds?api_key=live_JPuUpunkl44mrgywnkG74R0O0Kk7zPUUVsOrXL6gaVQe6hrAsqUfqp8tyFeX7wRq");
        const datos = await respuesta.json();
        window.mascotasData.gatos = datos;
        window.dispatchEvent(new CustomEvent('mascotas:gatos-cargados', { detail: datos }));
        if (typeof window.aplicarFiltrosMascotas === 'function') {
            window.aplicarFiltrosMascotas();
        } else {
            renderGatos(datos);
        }
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p class="text-danger text-center w-100">Error al conectar con la API.</p>';
    }
}

// Iniciar carga
document.addEventListener('DOMContentLoaded', cargarGatos);

window.renderGatos = renderGatos;

