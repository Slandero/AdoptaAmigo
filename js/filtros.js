function promedioDesdeRango(valor) {
    if (!valor) return null;
    const partes = String(valor)
        .split('-')
        .map((p) => parseFloat(p.trim()))
        .filter((p) => !isNaN(p));
    if (!partes.length) return null;
    return partes.reduce((a, b) => a + b, 0) / partes.length;
}

function categoriaPeso(mascota) {
    const promedioKg = promedioDesdeRango(mascota.weight?.metric);
    if (promedioKg === null) return 'desconocido';
    if (promedioKg <= 10) return 'chico';
    if (promedioKg <= 25) return 'mediano';
    return 'grande';
}

function categoriaEdad(mascota) {
    const promedioVida = promedioDesdeRango(mascota.life_span);
    if (promedioVida === null) return 'desconocida';
    if (promedioVida <= 10) return 'corta';
    if (promedioVida <= 14) return 'media';
    return 'larga';
}

function filtrarLista(lista, filtros) {
    return lista.filter((mascota) => {
        const pasaEdad = filtros.edad === 'todas' || categoriaEdad(mascota) === filtros.edad;
        const pasaPeso = filtros.peso === 'todos' || categoriaPeso(mascota) === filtros.peso;
        const origen = (mascota.origin || '').toLowerCase();
        const pasaOrigen = !filtros.origen || origen.includes(filtros.origen);
        return pasaEdad && pasaPeso && pasaOrigen;
    });
}

function mostrarSecciones(tipo) {
    const seccionPerros = document.getElementById('seccion-perros');
    const seccionGatos = document.getElementById('seccion-gatos');
    if (!seccionPerros || !seccionGatos) return;

    seccionPerros.style.display = tipo === 'gato' ? 'none' : 'block';
    seccionGatos.style.display = tipo === 'perro' ? 'none' : 'block';
}

function leerFiltros() {
    return {
        tipo: document.getElementById('filtro-tipo')?.value || 'todos',
        edad: document.getElementById('filtro-edad')?.value || 'todas',
        peso: document.getElementById('filtro-peso')?.value || 'todos',
        origen: (document.getElementById('filtro-origen')?.value || '').trim().toLowerCase()
    };
}

const ANIMALES_POR_PAGINA = 24;
let paginaActual = 1;
let firmaFiltrosAnterior = '';

function crearFirmaFiltros(filtros) {
    return `${filtros.tipo}|${filtros.edad}|${filtros.peso}|${filtros.origen}`;
}

function renderizarPaginacion(totalAnimales, totalPaginas) {
    const contenedor = document.getElementById('paginacion-mascotas');
    if (!contenedor) return;

    if (totalAnimales === 0) {
        contenedor.innerHTML = '<p class="text-muted mb-0">Sin resultados para los filtros seleccionados.</p>';
        return;
    }

    const inicioRango = Math.max(1, Math.min(paginaActual - 1, totalPaginas - 2));
    const finRango = Math.min(totalPaginas, inicioRango + 2);
    const paginasVisibles = [];
    for (let numero = inicioRango; numero <= finRango; numero += 1) {
        paginasVisibles.push(numero);
    }

    const botonesPaginas = paginasVisibles.map((numeroPagina) => {
        const activo = numeroPagina === paginaActual ? 'active' : '';
        return `
            <button
                type="button"
                class="btn btn-outline-primary btn-sm ${activo}"
                data-pagina="${numeroPagina}"
            >
                ${numeroPagina}
            </button>
        `;
    }).join('');

    const botonPrimeraPagina = `
        <button
            type="button"
            class="btn btn-outline-primary btn-sm ${paginaActual === 1 ? 'active' : ''}"
            data-pagina="1"
        >
            1
        </button>
    `;

    const botonUltimaPagina = `
        <button
            type="button"
            class="btn btn-outline-primary btn-sm ${paginaActual === totalPaginas ? 'active' : ''}"
            data-pagina="${totalPaginas}"
        >
            ${totalPaginas}
        </button>
    `;

    const mostrarPrimeraFija = totalPaginas > 1 && !paginasVisibles.includes(1);
    const mostrarUltimaFija = totalPaginas > 1 && !paginasVisibles.includes(totalPaginas);

    contenedor.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center gap-2 text-center">
            <div class="d-flex flex-wrap justify-content-center gap-1" aria-label="Paginacion de mascotas">
                ${mostrarPrimeraFija ? botonPrimeraPagina : ''}
                ${botonesPaginas}
                ${mostrarUltimaFija ? botonUltimaPagina : ''}
            </div>
            <p class="mb-0 text-muted small">
                Total de paginas: ${totalPaginas} (${totalAnimales} animales)
            </p>
        </div>
    `;

    const botones = contenedor.querySelectorAll('[data-pagina]');
    botones.forEach((boton) => {
        boton.addEventListener('click', () => {
            const numero = parseInt(boton.dataset.pagina || '1', 10);
            if (!isNaN(numero) && numero !== paginaActual) {
                paginaActual = numero;
                window.aplicarFiltrosMascotas({ preservarPagina: true });
            }
        });
    });
}

window.aplicarFiltrosMascotas = function aplicarFiltrosMascotas(opciones = {}) {
    const data = window.mascotasData || { perros: [], gatos: [] };
    const filtros = leerFiltros();
    const preservarPagina = Boolean(opciones.preservarPagina);
    const firmaFiltrosActual = crearFirmaFiltros(filtros);
    if (!preservarPagina && firmaFiltrosActual !== firmaFiltrosAnterior) {
        paginaActual = 1;
    }
    firmaFiltrosAnterior = firmaFiltrosActual;

    mostrarSecciones(filtros.tipo);

    const perrosBase = filtros.tipo === 'gato' ? [] : filtrarLista(data.perros, filtros);
    const gatosBase = filtros.tipo === 'perro' ? [] : filtrarLista(data.gatos, filtros);

    const combinados = [
        ...perrosBase.map((mascota) => ({ tipo: 'perro', mascota })),
        ...gatosBase.map((mascota) => ({ tipo: 'gato', mascota }))
    ];

    const totalAnimales = combinados.length;
    const totalPaginas = Math.max(1, Math.ceil(totalAnimales / ANIMALES_POR_PAGINA));
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * ANIMALES_POR_PAGINA;
    const fin = inicio + ANIMALES_POR_PAGINA;
    const pagina = combinados.slice(inicio, fin);

    const perrosFiltrados = pagina.filter((item) => item.tipo === 'perro').map((item) => item.mascota);
    const gatosFiltrados = pagina.filter((item) => item.tipo === 'gato').map((item) => item.mascota);

    if (typeof window.renderPerros === 'function') window.renderPerros(perrosFiltrados);
    if (typeof window.renderGatos === 'function') window.renderGatos(gatosFiltrados);
    renderizarPaginacion(totalAnimales, totalPaginas);
};

function limpiarFiltros() {
    const tipo = document.getElementById('filtro-tipo');
    const edad = document.getElementById('filtro-edad');
    const peso = document.getElementById('filtro-peso');
    const origen = document.getElementById('filtro-origen');
    if (tipo) tipo.value = 'todos';
    if (edad) edad.value = 'todas';
    if (peso) peso.value = 'todos';
    if (origen) origen.value = '';
    window.aplicarFiltrosMascotas();
}

document.addEventListener('DOMContentLoaded', () => {
    const ids = ['filtro-tipo', 'filtro-edad', 'filtro-peso', 'filtro-origen'];
    ids.forEach((id) => {
        const control = document.getElementById(id);
        if (!control) return;
        const evento = id === 'filtro-origen' ? 'input' : 'change';
        control.addEventListener(evento, window.aplicarFiltrosMascotas);
    });

    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);
});
