window.mascotasData = window.mascotasData || { perros: [], gatos: [] };

function renderPerros(datos) {
    const contenedor = document.getElementById('contenedor-perros');
    if (!contenedor) return;

    if (!datos.length) {
        contenedor.innerHTML = '<p class="text-muted text-center w-100">No hay perros que coincidan con los filtros.</p>';
        return;
    }

    contenedor.innerHTML = '';
    datos.forEach(mascota => {
        const imagenUrl = mascota.image?.url || `https://cdn2.thedogapi.com/images/${mascota.reference_image_id}.jpg`;
        const mascotaCodificada = encodeURIComponent(JSON.stringify(mascota));
        contenedor.innerHTML += `
    <div class="col">
        <div class="card shadow h-100 tarjeta-mascota"
             data-mascota="${mascotaCodificada}"
             data-tipo-animal="Perro"
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
                    data-tipo="Perro"
                    data-img="${imagenUrl}"
                    data-raza="${mascota.name}">
                    ¡Quiero Adoptar a ${mascota.name}!
                     </button>
                </div>
            </div>
        </div>
    </div>
`;});
}

async function cargarPerros() {
    const contenedor = document.getElementById('contenedor-perros');
    try {
        const respuesta = await fetch("https://api.thedogapi.com/v1/breeds?api_key=live_7TOIOLtbYx8V4wpnp7THwNoLunZzMJ2S7rQ8jRsSrA3qGat8YkRrFAj9nzCRZL1h");
        const datos = await respuesta.json();
        window.mascotasData.perros = datos;
        window.dispatchEvent(new CustomEvent('mascotas:perros-cargados', { detail: datos }));
        if (typeof window.aplicarFiltrosMascotas === 'function') {
            window.aplicarFiltrosMascotas();
        } else {
            renderPerros(datos);
        }
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p class="text-danger text-center w-100">Error al conectar con la API.</p>';
    }
}

// Iniciar carga
document.addEventListener('DOMContentLoaded', cargarPerros);

window.renderPerros = renderPerros;


