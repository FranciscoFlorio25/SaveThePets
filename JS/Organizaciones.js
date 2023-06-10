//Aray con organizaciones
let filteredOrganizaciones = []

// Campo para busqueda
var searchInput = document.getElementById('search-input'); // Mover esta línea aquí

/* Variables globales relacionadas con el mapa --> */

// Coordenadas de CABA y AMBA
var cabaAmba = [-34.6037, -58.3816];

// Crear mapa centrado en CABA y AMBA
var map = L.map('map').setView(cabaAmba, 10);

// Limitar mapa a la provincia de Buenos Aires
var bounds = L.latLngBounds(
  L.latLng(-41, -64),
  L.latLng(-33, -56)
);

function initMap() {

  map.setMaxBounds(bounds);
  map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
  });

  // Capa de mapa base de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  
  //Cargar archivo JSON de Organizaciones
  fetch('/JSON/Organizaciones.json')
    .then(response => response.json())
    .then(data => {

      //Obtengo los datos
      const organizaciones = data['Organizaciones'];
      
      //Sumo al array los datos obtenidos desde el JSON
      filteredOrganizaciones = [...organizaciones];
      
      //Rendeiza si existe una nueva organizacion agregada
      renderizarNuevaOrganizacion()

      //Renderiza las cards obtenidas desde el JSON
      renderCards(map);
      
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON:', error);
    });
}

 // Función para renderizar las cartas de las organizaciones
 function renderCards(map) {
  // Limpiar el contenedor de las cartas
  let cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = '';

  filteredOrganizaciones.forEach(organizacion => {
    // Verificar si la organización tiene alguna actividad que coincida con el término de búsqueda
    let actividades = organizacion.Actividades.map(actividad => actividad.toLowerCase());
    let searchTerm = searchInput.value.toLowerCase();

    if (actividades.some(actividad => actividad.includes(searchTerm))) {
      // Crear una carta para mostrar la información de la organización
      let card = document.createElement('div');
      card.classList.add('card');

      let Nombre = document.createElement('h1');
      Nombre.textContent = 'Nombre: ' + organizacion.Nombre;
      card.appendChild(Nombre);

      let descripcionElement = document.createElement('p');
      descripcionElement.textContent = 'Descripción: ' + organizacion.Descripción;
      card.appendChild(descripcionElement);

      let actividadesElement = document.createElement('ul');
      actividadesElement.textContent = 'Actividades: ';
      actividadesElement.classList.add('actividades-list');
      organizacion.Actividades.forEach(actividad => {
        let actividadItem = document.createElement('li');
        actividadItem.textContent = actividad;
        actividadesElement.appendChild(actividadItem);
      });
      card.appendChild(actividadesElement);

      let serviciosElement = document.createElement('ul');
      serviciosElement.textContent = 'Servicios: ';
      serviciosElement.classList.add('servicios-list');
      organizacion.Servicios.forEach(servicios => {
        let serviciosItem = document.createElement('li');
        serviciosItem.textContent = servicios;
        serviciosElement.appendChild(serviciosItem);
      });
      card.appendChild(serviciosElement);

      let horariosElement = document.createElement('p');
      horariosElement.textContent = 'Horario de atencion: ' + organizacion.Horarios;
      card.appendChild(horariosElement);

      let telefonoElement = document.createElement('p');
      telefonoElement.textContent = 'Telefono: ' + organizacion.Telefono;
      card.appendChild(telefonoElement);

      let direccionElement = document.createElement('p');
      direccionElement.textContent = 'Dirección: ' + organizacion.Direccion;
      card.appendChild(direccionElement);

      // Agregar la carta al contenedor correspondiente
      cardContainer.appendChild(card);

      // Utilizar las coordenadas para agregar un marcador al mapa
      normalizeAddress(organizacion.Direccion)
        .then(direccionNormalizada => {

          var markerIcon = L.icon({
            iconUrl: "/img/marcador/pngwing.com.png",
            iconSize: [35, 35]
          });

          var marker = L.marker(direccionNormalizada.coordenadas, { icon: markerIcon }).addTo(map);
          nombreOrganizacion = organizacion.Nombre + ": "
          marker.bindPopup( nombreOrganizacion.bold() + organizacion.Descripción);

          // Hacer zoom en el marcador al hacer clic en él
          marker.on('click', function () {
            map.flyTo(direccionNormalizada.coordenadas, 15);
          });

          // Hacer zoom en el marcador al hacer clic en la tarjeta
          card.addEventListener('click', function () {
            map.flyTo(direccionNormalizada.coordenadas, 15);
          });
        })
        .catch(error => {
          console.error('Error al normalizar la dirección:', error);
        });
    }
  });
}

// Función para normalizar una dirección y obtener las coordenadas
function normalizeAddress(direccion) {
  
  var apiUrl = "http://servicios.usig.buenosaires.gob.ar/normalizar/"

  var url = `${apiUrl}?direccion=${direccion}`

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.direccionesNormalizadas.length > 0) {
        var latitud = data.direccionesNormalizadas[0].coordenadas.y;
        var longitud = data.direccionesNormalizadas[0].coordenadas.x;
        return {
          coordenadas: [latitud, longitud]
        };
      }
    });
}

//Verificar nueva organizacion
function verificarLocalStorage() {
  const datos = localStorage.getItem('nuevaOrganizacion');
  console.log(JSON.parse(datos))
  return datos !== null;
}

function renderizarNuevaOrganizacion(){
  if (verificarLocalStorage()){
    const datos = localStorage.getItem('nuevaOrganizacion');
    const nuevaOrganizacion = JSON.parse(datos)
    filteredOrganizaciones.unshift(nuevaOrganizacion)
  }
}

//Evento para el campo de busqueda
searchInput.addEventListener('input', function () {
  filteredOrganizacionesActividad = filteredOrganizaciones.filter(organizacion => {
    let actividades = organizacion.Actividades;
    let searchTerm = searchInput.value.toLowerCase();

    return actividades.some(actividad => actividad.toLowerCase().includes(searchTerm));
  });
  renderCards(map);
});

// Inicializar el mapa cuando se cargue la página
document.addEventListener('DOMContentLoaded', initMap())