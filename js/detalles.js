function calcularPromedioPeso(pesoMetrico) {
    if (!pesoMetrico) return 'No disponible';
    const partes = pesoMetrico.split('-').map((p) => parseFloat(p.trim())).filter((p) => !isNaN(p));
    if (!partes.length) return 'No disponible';
    return `${(partes.reduce((a, b) => a + b, 0) / partes.length).toFixed(1)}kg`;
}

function formatearPesoKg(pesoMetrico) {
    if (!pesoMetrico) return 'No disponible';
    return `${pesoMetrico} kg`;
}

document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <div class="modal fade" id="modalDetalleMascota" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold text-primary">Detalle de mascota</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-12 col-md-4">
                            <img id="detalle-imagen" src="" alt="" class="img-fluid rounded border">
                        </div>
                        <div class="col-12 col-md-8">
                            <h4 id="detalle-nombre" class="fw-bold text-primary mb-2"></h4>
                            <p class="mb-1"><strong>Tipo:</strong> <span id="detalle-tipo"></span></p>
                            <p class="mb-1"><strong>Identificador:</strong> <span id="detalle-id"></span></p>
                            <p class="mb-1"><strong>Origen:</strong> <span id="detalle-origen"></span></p>
                            <p class="mb-1"><strong>Codigo de pais:</strong> <span id="detalle-codigo-pais"></span></p>
                            <p class="mb-1"><strong>Esperanza de vida:</strong> <span id="detalle-vida"></span></p>
                            <p class="mb-1"><strong>Altura / Tamano:</strong> <span id="detalle-altura"></span></p>
                            <p class="mb-1"><strong>Peso promedio:</strong> <span id="detalle-peso-promedio"></span></p>
                            <p class="mb-0"><strong>Peso:</strong> <span id="detalle-peso-completo"></span></p>
                        </div>
                    </div>
                    <hr>
                    <h6 class="fw-bold text-success">Temperamento</h6>
                    <p id="detalle-temperamento" class="text-muted mb-0"></p>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('modalDetalleMascota'));

    document.addEventListener('click', (e) => {
        if (e.target.closest('.adoptar-btn')) return;

        const tarjeta = e.target.closest('.tarjeta-mascota');
        if (!tarjeta) return;

        const dataMascota = tarjeta.dataset.mascota;
        if (!dataMascota) return;

        let mascota;
        try {
            mascota = JSON.parse(decodeURIComponent(dataMascota));
        } catch (_error) {
            return;
        }

        const imagen = tarjeta.dataset.imagen || '';
        const tipo = tarjeta.dataset.tipoAnimal || 'No disponible';

        document.getElementById('detalle-imagen').src = imagen;
        document.getElementById('detalle-imagen').alt = mascota.name || 'Mascota';
        document.getElementById('detalle-nombre').textContent = mascota.name || 'No disponible';
        document.getElementById('detalle-tipo').textContent = tipo;
        document.getElementById('detalle-id').textContent = mascota.id || 'No disponible';
        document.getElementById('detalle-origen').textContent = mascota.origin || 'No disponible';
        document.getElementById('detalle-codigo-pais').textContent = mascota.country_code || 'No disponible';
        document.getElementById('detalle-vida').textContent = mascota.life_span ? `${mascota.life_span} anios` : 'No disponible';
        document.getElementById('detalle-altura').textContent = mascota.height?.metric || mascota.weight?.metric || 'No disponible';
        document.getElementById('detalle-peso-promedio').textContent = calcularPromedioPeso(mascota.weight?.metric);
        document.getElementById('detalle-peso-completo').textContent = formatearPesoKg(mascota.weight?.metric);
        document.getElementById('detalle-temperamento').textContent = mascota.temperament || 'Amigable';

        modal.show();
    });
});
