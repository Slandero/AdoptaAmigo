async function cargarGatos() {
    const contenedor = document.getElementById('contenedor-gatos');
    try {
        const respuesta = await fetch("https://api.thecatapi.com/v1/breeds?api_key=live_JPuUpunkl44mrgywnkG74R0O0Kk7zPUUVsOrXL6gaVQe6hrAsqUfqp8tyFeX7wRq");
        const datos = await respuesta.json();
        contenedor.innerHTML = ''; // Limpiar el spinner
        datos.forEach(mascota => {
            // Manejo de imagen de la API
            const imagenUrl = mascota.image?.url || `https://cdn2.thecatapi.com/images/${mascota.reference_image_id}.jpg`;
           contenedor.innerHTML += `
    <div class="col">
        <div class="card shadow h-100 tarjeta-colapsable" 
             data-bs-toggle="collapse" 
             data-bs-target="#collapse-${mascota.id || Math.random().toString(36).substr(2, 9)}" 
             data-mascota='${JSON.stringify(mascota)}' 
             style="cursor: pointer; transition: all 0.3s ease;">
            
            <!-- IMAGEN + NOMBRE (SIEMPRE VISIBLE) -->
            <img src="${imagenUrl}" class="card-img-top" alt="${mascota.name}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=${mascota.name?.slice(0,10)}'">
            <div class="card-body p-3">
                <h5 class="card-title fw-bold text-primary mb-0">${mascota.name}</h5>
            </div>
            
            <!-- CONTENIDO EXPANDIDO (UNIVERSAL) -->
            <div class="collapse" id="collapse-${mascota.id || Math.random().toString(36).substr(2, 9)}">
                <div class="card-body border-top p-4 bg-light">
                    <!-- TEMPERAMENTO -->
                    <div class="mb-4">
                        <h6 class="fw-bold text-success mb-2">Temperamento</h6>
                        <p class="text-muted fs-6">${mascota.temperament || 'Amigable'}</p>
                    </div>
                    
                    <!-- MEDIDAS -->
                    <div class="row mb-4 g-3">
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-2">Altura / Tamaño</h6>
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <span class="h5 fw-bold text-info">${mascota.height?.metric || mascota.weight?.metric || 'No disponible'}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-2">Peso Promedio</h6>
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <span class="h5 fw-bold text-warning">${calcularPesoPromedio(mascota.weight?.metric) || 'No disponible'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BOTÓN ADOPTAR -->
                    <div class="d-grid">
                        <button class="btn btn-success btn-lg shadow-lg adoptar-btn fw-bold fs-5 py-3" 
                        data-name="${mascota.name}" 
                        data-tipo="${contenedor.id.includes('perros') ? 'Perro' : 'Gato'}"
                        data-img="${imagenUrl}"
                        data-raza="${mascota.name}">
                    ¡Quiero Adoptar a ${mascota.name}!
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`});
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p class="text-danger text-center w-100">Error al conectar con la API.</p>';
    }
}

// Iniciar carga
document.addEventListener('DOMContentLoaded', cargarGatos);


function calcularPesoPromedio(pesoStr) {
    if (!pesoStr) return 'N/D';
    const partes = pesoStr.split('-').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    return partes.length ? (partes.reduce((a,b)=>a+b)/partes.length).toFixed(1) + 'kg' : 'N/D';
}


