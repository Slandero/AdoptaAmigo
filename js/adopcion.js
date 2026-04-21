// Mensaje Modal
document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <div class="modal fade" id="modalAdopcion" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <div class="d-flex align-items-center gap-3 w-100">
                        <img id="modal-img" src="" alt="" 
                             style="width:60px; height:60px; object-fit:cover; border-radius:8px; border:1px solid #ddd;">
                        <div>
                            <p class="text-muted mb-0" style="font-size:13px;">Adoptando a</p>
                            <h5 class="fw-bold mb-0 text-primary" id="modal-nombre-mascota"></h5>
                        </div>
                    </div>
                    <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size:13px;">Nombre completo</label>
                        <input type="text" class="form-control" id="adopcion-nombre" placeholder="Ej. Pedro Espinoza">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size:13px;">Correo electrónico</label>
                        <input type="email" class="form-control" id="adopcion-correo" placeholder="Ej. pedro@gmail.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size:13px;">Domicilio</label>
                        <input type="text" class="form-control" id="adopcion-domicilio" placeholder="Ej. Av. Politecnico num:3305">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size:13px;">Edad</label>
                        <input type="number" class="form-control" id="adopcion-edad" placeholder="Ej. 20" min="18" max="99">
                    </div>
                    <div id="adopcion-error" class="text-danger d-none" style="font-size:13px;">
                        Por favor llena todos los campos.
                    </div>
                </div>

                <div class="modal-footer border-0 pt-0">
                    <button class="btn btn-danger fw-bold" data-bs-dismiss="modal">Cancelar</button>
                    <button class="btn btn-success fw-bold px-4" id="btn-confirmar-adopcion">
                        Confirmar adopción
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML); //Pone el modal al final del body para evitar problemas

    // Guardar referencia a los datos de la mascota actual
    window._mascotaActual = null;

    // Escuchar clic en botones adoptar
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('adoptar-btn')) {
            e.stopPropagation();

            const nombre = e.target.dataset.name;
            const tipo   = e.target.dataset.tipo;
            const img    = e.target.dataset.img;
            const raza   = e.target.dataset.raza || nombre;

            window._mascotaActual = { nombre, tipo, img, raza };

            document.getElementById('modal-nombre-mascota').textContent = nombre;
            document.getElementById('modal-img').src = img || '';

            // Limpiar campos
            ['adopcion-nombre','adopcion-correo','adopcion-domicilio','adopcion-edad']
                .forEach(id => document.getElementById(id).value = '');
            document.getElementById('adopcion-error').classList.add('d-none');

            new bootstrap.Modal(document.getElementById('modalAdopcion')).show();
        }
    });

    // Confirmar adopción
    document.getElementById('btn-confirmar-adopcion')?.addEventListener('click', () => {
        const nombre    = document.getElementById('adopcion-nombre').value.trim();
        const correo    = document.getElementById('adopcion-correo').value.trim();
        const domicilio = document.getElementById('adopcion-domicilio').value.trim();
        const edad      = document.getElementById('adopcion-edad').value.trim();

        if (!nombre || !correo || !domicilio || !edad) {
            document.getElementById('adopcion-error').classList.remove('d-none');
            return;
        }

        const mascota = window._mascotaActual;

        // Crear registro
        const registro = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' }),
            adoptante: { nombre, correo, domicilio, edad },
            mascota: { nombre: mascota.nombre, tipo: mascota.tipo, img: mascota.img, raza: mascota.raza }
        };

        // Guardar en localStorage
        const adopciones = JSON.parse(localStorage.getItem('adopciones') || '[]');
        adopciones.push(registro);
        localStorage.setItem('adopciones', JSON.stringify(adopciones));

        bootstrap.Modal.getInstance(document.getElementById('modalAdopcion')).hide();

        setTimeout(() => {
            alert(`🎉 ¡Felicidades, ${nombre}!\nHas adoptado a ${mascota.nombre}. ¡Bienvenido a la familia! 🏠`);
        }, 300);
    });
});