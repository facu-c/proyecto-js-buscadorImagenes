const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');


let paginaActual = 1;
let totalPaginas;
let iterador;

const registrosPorPagina = 40;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda');
    }

    buscarImagenes();
}


function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto','mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong><br>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }    
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;
    const key = '41668498-bac2415569ab0f7ff1210f985';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultados => {
            totalPaginas = calcularPaginas(resultados.totalHits);
            mostrarImagenes(resultados.hits);
        } );
}

function mostrarImagenes(imagenes){
    //limpiamos el html
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //iteramos sobre el arreglo de imagenes y construimos el html

    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/ p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}"/>

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Vistas</span></p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank">Ver Imagen</a>
                    </div>

                </div>
            </div>
        `;
    });
    
    //limpiar paginador previo
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }

    imprimirPaginador();
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function *crearPaginador(total){
    for(let i=1; i<=total; i++){
        yield i;
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    while(true){
        const {done , value} = iterador.next();
        if(done) return;
        //caso contrario que genere un boton por cada elemento del generador
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1', 'mb-1','mr-2', 'font-bold' ,'uppercase', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacion.appendChild(boton);
    }
}