/* Documento declaracion */
var d = document

async function fetchPublicaciones(url) {
    const response = await fetch(url)
    const res = await response.json()
    return res.Publicaciones
}

/* Recupero data desde el json */

async function cargarPublicaciones() {
    
    /* Div principal donde van todas las publicaciones */
    let $divContenedor = d.getElementById("publicaciones")


    fetchPublicaciones('/JSON/publicaciones.json').then(data => {
    
        for (let i = 0; i < 6; i++) {

            /* Elementos para crear el esqueleto para al publicacion */
            const $div = d.createElement('div')
            const $h3 = d.createElement('h3')
            const $img = d.createElement('img')
            const $ul = d.createElement('ul')
            const $nombre = d.createElement('li')
            const $raza = d.createElement('li')
            const $edad = d.createElement('li')
            const $button = d.createElement('button')

            /* Aplico la clase para los estilos correspondientes */
            $div.classList.add('tarjeta-mascota')

            /* Agregando data-id a cada div: con esto despues recupero la info para mostrarlo */
            $button.setAttribute("data-id", data[i].idMascota)

            /* Control para el color del estado de la mascota arriba en tarjeta */
            if(data[i].Tipo === "Adopcion"){
                $h3.classList.add('adopcion')
            }else if(data[i].Tipo === "Perdido"){
                $h3.classList.add('perdido')
            }

            $button.addEventListener('click', rellenarConInformacionCorrespondiente);

            /* Insertando la informacion de cada publicacion */
                $h3.innerHTML += `${data[i].Tipo}`
                $img.src += `${data[i].imagen}`
                $nombre.innerHTML += `Nombre: ${data[i].nombre}`
                $raza.innerHTML += `Raza: ${data[i].raza}`
                $edad.innerHTML += `Edad: ${data[i].edad} años`
                $button.innerHTML += `Ver más información`

                $ul.appendChild($nombre)
                $ul.appendChild($raza)
                $ul.appendChild($edad)

            /* Colocando elementos con informacion dentro de la tarjeta */
                $div.appendChild($h3)
                $div.appendChild($img)
                $div.appendChild($ul)
                $div.appendChild($button)
            
            /* Colocando la tarjeta dentro del contenedor de publicaciones */
            $divContenedor.appendChild($div)
        }
    })
}

function rellenarConInformacionCorrespondiente(e){

    const $contenedor = d.getElementById('contendor-info')
    $contenedor.innerHTML = '';
    const identificador = e.target.getAttribute('data-id')
    const $div = d.createElement('div')
    const id = identificador - 1


    fetchPublicaciones('/JSON/publicaciones.json').then(data => {
       
        
        const $h2 = d.createElement('h2')
        const $img = d.createElement('img')
        const $direccion = d.createElement('p')
        const $telefono = d.createElement('p')
        const $detalle = d.createElement('p')
        const $Vacunas = d.createElement('p')
        const $a = d.createElement('a')


        const emailCorrespondiente = `mailto:${data[id].Contacto}`
        $a.setAttribute('href', emailCorrespondiente)

        if(data[id].Tipo === "Adopcion"){
            $h2.classList.add('adopcion')
        }else if(data[id].Tipo === "Perdido"){
            $h2.classList.add('perdido')
        }

        $h2.innerHTML += `${data[id].nombre}`
        $img.src += `${data[id].imagen}`
        $direccion.innerHTML += `Dirección: ${data[id].Direccion}.`
        
        $telefono.innerHTML +=  `Teléfono: ${data[id].Telefono}`
        $a.innerHTML += `${data[id].Contacto}`

        $div.appendChild($h2)
        $div.appendChild($img)
        $div.appendChild($telefono)
        $div.appendChild($direccion)
        $div.appendChild($a)

        if(data[id].Tipo === "Adopcion"){

            $Vacunas.innerHTML += ` Vacunas: ${data[id].Cuidados.Vacunas}.`
            $detalle.innerHTML += `Cuidados: ${data[id].Cuidados.DetalleCuidado}`

            $div.appendChild($detalle)
            $div.appendChild($Vacunas)
        }

        $contenedor.appendChild($div)
    })
    
   
}

cargarPublicaciones()