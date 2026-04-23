class ListaAdopciones {
    constructor() {
        this.adopciones = JSON.parse(localStorage.getItem('adopciones')) || [];
    }

    // Leer siempre el localStorage
    obtenerAdopciones() {
        return JSON.parse(localStorage.getItem('adopciones')) || [];
    }

    eliminarAdopcion(id) {
        this.adopciones = this.obtenerAdopciones().filter(a => a.id !== id);
        localStorage.setItem('adopciones', JSON.stringify(this.adopciones));
        this.mostrarAdopciones();
    }

    generarIniciales(nombre) {
        return nombre
            .split(' ') //Separa por espacios los nombres
            .slice(0, 2)//Toma solo las primeras 2 partes del nombre
            .map(p => p[0]?.toUpperCase() || '')//Solo toma la primera letra de cada parte y la convierte a mayúscula
            .join('');//Une las iniciales sin espacios
    }

    coloresIniciales = ['info', 'warning', 'success', 'danger'];

    mostrarAdopciones() {
        const contenedor = document.getElementById('contenedor-adopciones');
        const contador   = document.getElementById('contador-adopciones');
        this.adopciones  = this.obtenerAdopciones();

        // Actualizar contador
        if (contador) {
            contador.textContent = `${this.adopciones.length} adopción${this.adopciones.length !== 1 ? 'es' : ''}`;
        }

        if (this.adopciones.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center text-muted py-5 w-100">
                    <p class="fs-5">Aún no hay adopciones registradas.</p>
                    <a href="animales.html" class="btn btn-primary mt-2">Ver mascotas disponibles</a>
                </div>`;
            return;
        }

        contenedor.innerHTML = '';

        this.adopciones.forEach((registro, index) => {
            const { adoptante, mascota, fecha, id } = registro;
            const iniciales = this.generarIniciales(adoptante.nombre);
            const colorClass = this.coloresIniciales[index % this.coloresIniciales.length];

            contenedor.innerHTML += `
            <div class="col" id="card-adopcion-${id}">
                <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">

                    <!-- Imagen de la mascota -->
                    <div class="position-relative" style="height: 180px; overflow: hidden;">
                        <img src="${mascota.img || 'https://via.placeholder.com/300x180?text=' + mascota.nombre}"
                             class="w-100 h-100"
                             style="object-fit: cover;"
                             alt="${mascota.nombre}"
                             onerror="this.src='https://via.placeholder.com/300x180?text=${mascota.nombre}'">

                        <!-- Gradiente + nombre de mascota -->
                        <div class="position-absolute bottom-0 start-0 end-0 px-3 py-2"
                             style="background: linear-gradient(transparent, rgba(0,0,0,0.65));">
                            <p class="text-white fw-bold mb-0">${mascota.nombre}</p>
                            <p class="text-white-50 mb-0" style="font-size: 12px;">${mascota.tipo}</p>
                        </div>

                        <!-- Fecha -->
                        <span class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-50"
                              style="font-size: 11px;">${fecha}</span>
                    </div>

                    <!-- Datos del adoptante -->
                    <div class="card-body">
                        <p class="text-muted fw-bold mb-2" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Datos del adoptante
                        </p>

                        <div class="d-flex align-items-center gap-2 mb-3">
                            <div class="rounded-circle bg-${colorClass} bg-opacity-25 d-flex align-items-center justify-content-center flex-shrink-0"
                                 style="width: 36px; height: 36px;">
                                <span class="fw-bold text-${colorClass}" style="font-size: 12px;">${iniciales}</span>
                            </div>
                            <div>
                                <p class="fw-bold mb-0" style="font-size: 14px;">${adoptante.nombre}</p>
                                <p class="text-muted mb-0" style="font-size: 12px;">${adoptante.edad} años</p>
                            </div>
                        </div>

                        <div class="border-top pt-2 d-flex flex-column gap-1">
                            <p class="mb-0" style="font-size: 12px;">
                                <span class="text-muted">Correo</span>&nbsp;&nbsp;${adoptante.correo}
                            </p>
                            <p class="mb-0" style="font-size: 12px;">
                                <span class="text-muted">Domicilio</span>&nbsp;&nbsp;${adoptante.domicilio}
                            </p>
                        </div>
                    </div>

                    <!-- Botón eliminar -->
                    <div class="card-footer bg-transparent border-0 pb-3 px-3">
                        <button class="btn btn-outline-danger btn-sm w-100"
                                onclick="listaAdopciones.eliminarAdopcion(${id})">
                            Eliminar registro
                        </button>
                    </div>
                </div>
            </div>`;
        });
    }
}

// Instancia global 
const listaAdopciones = new ListaAdopciones();
document.addEventListener('DOMContentLoaded', () => listaAdopciones.mostrarAdopciones());