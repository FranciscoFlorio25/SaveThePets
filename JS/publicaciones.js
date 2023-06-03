/* Documento declaracion */
var d = document;

async function fetchPublicaciones(url) {
  const response = await fetch(url);
  const res = await response.json();
  return res.Publicaciones;
}

//#region  Carga de publicaciones
/* Recupero data desde el json */

async function cargarPublicaciones() {
  /* Div principal donde van todas las publicaciones */
  let $divContenedor = d.getElementById("publicaciones");

  fetchPublicaciones('/JSON/publicaciones.json').then((data) => {
    for (let i = 0; i < data.length; i++) {
      /* Elementos para crear el esqueleto para al publicacion */
      const $div = d.createElement("div");
      const $h3 = d.createElement("h3");
      const $img = d.createElement("img");
      const $ul = d.createElement("ul");
      const $vigente = d.createElement("li");
      const $nombre = d.createElement("li");
      const $raza = d.createElement("li");
      const $edad = d.createElement("li");
      const $button = d.createElement("button");

      /* Aplico la clase para los estilos correspondientes */
      $div.classList.add("tarjeta-mascota");

      /* Agregando data-id a cada div: con esto despues recupero la info para mostrarlo */
      $button.setAttribute("data-id", data[i].idMascota);

      /* Control para el color del estado de la mascota arriba en tarjeta */
      if (data[i].Tipo === "Adopcion") {
        $h3.classList.add("adopcion");
      } else if (data[i].Tipo === "Perdido") {
        $h3.classList.add("perdido");
      }

      $button.addEventListener("click", rellenarConInformacionCorrespondiente);

      /* Insertando la informacion de cada publicacion */
      $h3.innerHTML += `${data[i].Tipo}`;
      $img.src += `${data[i].imagen}`;
      $vigente.innerHTML += `Estado Publicación: ${data[i].EsVigente}`;
      $nombre.innerHTML += `Nombre: ${data[i].nombre}`;
      $raza.innerHTML += `Raza: ${data[i].raza}`;
      $edad.innerHTML += `Edad: ${data[i].edad} años`;
      $button.innerHTML += `Ver más información`;

      $ul.appendChild($vigente);
      $ul.appendChild($nombre);
      $ul.appendChild($raza);
      $ul.appendChild($edad);

      /* Colocando elementos con informacion dentro de la tarjeta */
      $div.appendChild($h3);
      $div.appendChild($img);
      $div.appendChild($ul);
      $div.appendChild($button);

      /* Colocando la tarjeta dentro del contenedor de publicaciones */
      $divContenedor.appendChild($div);
    }
  });
}

function rellenarConInformacionCorrespondiente(e) {
  const $contenedor = d.getElementById("contendor-info");
  $contenedor.innerHTML = "";
  const identificador = e.target.getAttribute("data-id");
  const $div = d.createElement("div");
  const id = identificador - 1;

  fetchPublicaciones("/JSON/publicaciones.json").then((data) => {
    const $h2 = d.createElement("h2");
    const $img = d.createElement("img");
    const $direccion = d.createElement("p");
    const $telefono = d.createElement("p");
    const $vigente = d.createElement("p");
    const $detalle = d.createElement("p");
    const $Vacunas = d.createElement("p");
    const $a = d.createElement("a");

    const emailCorrespondiente = `mailto:${data[id].Contacto}`;
    $a.setAttribute("href", emailCorrespondiente);

    if (data[id].Tipo === "Adopcion") {
      $h2.classList.add("adopcion");
    } else if (data[id].Tipo === "Perdido") {
      $h2.classList.add("perdido");
    }

    $h2.innerHTML += `${data[id].nombre}`;
    $img.src += `${data[id].imagen}`;
    $direccion.innerHTML += `Dirección: ${data[id].Direccion}.`;

    $telefono.innerHTML += `Teléfono: ${data[id].Telefono}`;
    $a.innerHTML += `${data[id].Contacto}`;

    $vigente.innerHTML += `Estado Publicacion: ${data[id].EsVigente}`;
    $a.innerHTML += `${data[id].Contacto}`;

    $div.appendChild($h2);
    $div.appendChild($img);
    $div.appendChild($vigente);
    $div.appendChild($telefono);
    $div.appendChild($direccion);
    $div.appendChild($a);

    if (data[id].Tipo === "Adopcion") {
      $Vacunas.innerHTML += ` Vacunas: ${data[id].Cuidados.Vacunas}.`;
      $detalle.innerHTML += `Cuidados: ${data[id].Cuidados.DetalleCuidado}`;

      $div.appendChild($detalle);
      $div.appendChild($Vacunas);
    }

    $contenedor.appendChild($div);
  });
}

// Función de búsqueda
function buscarPublicaciones() {
    const $buscador = d.getElementById("buscador");
    const filtro = $buscador.value.toLowerCase();
    const $publicaciones = d.getElementById("publicaciones");
    const $tarjetas = $publicaciones.getElementsByClassName("tarjeta-mascota");
  
    for (let i = 0; i < $tarjetas.length; i++) {
      const nombreMascota = $tarjetas[i]
        .getElementsByTagName("li")[1]
        .innerHTML.toLowerCase();
  
      const esVigente = $tarjetas[i]
        .getElementsByTagName("li")[0]
        .innerHTML.toLowerCase()
        .trim();
  
        if (
            nombreMascota.includes(filtro) ||
            (filtro === "vigente" && esVigente === "estado publicación: vigente") ||
            (filtro === "no vigente" && esVigente === "estado publicación: no vigente")
          ) {
            $tarjetas[i].style.display = "block";
          } else {
            $tarjetas[i].style.display = "none";
          }
    }
  }

// Cargar las publicaciones al cargar la página
window.addEventListener("load", cargarPublicaciones);

// Escuchar el evento de cambio en el buscador
d.getElementById("buscador").addEventListener("keyup", buscarPublicaciones);
