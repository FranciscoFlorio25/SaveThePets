function initMap() {
  // Coordenadas de CABA y AMBA
  var cabaAmba = [-34.6037, -58.3816];

  // Crear mapa centrado en CABA y AMBA
  var map = L.map('map').setView(cabaAmba, 10);
  // Limitar mapa a la provincia de Buenos Aires
  var bounds = L.latLngBounds(
    L.latLng(-41, -64),
    L.latLng(-33, -56) 
  );
  map.setMaxBounds(bounds);
  map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
  });

  // Capa de mapa base de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Cargar archivo JSON de Organizaciones
  fetch('/JSON/Organizaciones.json')
    .then(response => response.json())
    .then(data => {
      const organizaciones = data['Organizaciones'][0];
      for (let key in organizaciones) {
        if (organizaciones.hasOwnProperty(key)) {
          let organizacion = organizaciones[key];

          // Normalizar la dirección y obtener las coordenadas
          normalizeAddress(organizacion.Direccion)
            .then(direccionNormalizada => {
              // Crear una carta para mostrar la información de la organización
              let card = document.createElement('div');
              card.classList.add('card');

              let descripcionElement = document.createElement('p');
              descripcionElement.textContent = 'Descripción: ' + organizacion.Descripción;
              card.appendChild(descripcionElement);

              let actividadesElement = document.createElement('p');
              actividadesElement.textContent = 'Actividades: ' + organizacion.Acividades;
              card.appendChild(actividadesElement);

              let direccionElement = document.createElement('p');
              direccionElement.textContent = 'Dirección: ' + organizacion.Direccion;
              card.appendChild(direccionElement);

              // Agregar la carta al contenedor correspondiente
              let cardContainer = document.getElementById('card-container');
              cardContainer.appendChild(card);

              // Utilizar las coordenadas para agregar un marcador al mapa
              var marker = L.marker(direccionNormalizada.coordenadas).addTo(map);
              marker.bindPopup(organizacion.Descripción);

              // Hacer zoom en el marcador al hacer clic en él
              marker.on('click', function() {
                map.flyTo(direccionNormalizada.coordenadas, 15);
              });

              // Hacer zoom en el marcador al hacer clic en la tarjeta
              card.addEventListener('click', function() {
                map.flyTo(direccionNormalizada.coordenadas, 15);
              });
            })
            .catch(error => {
              console.error('Error al normalizar la dirección:', error);
            });
        }
      }
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON:', error);
    });
}

// Función para normalizar una dirección y obtener las coordenadas
function normalizeAddress(direccion) {
  var apiUrl = "http://servicios.usig.buenosaires.gob.ar/normalizar/";
  var url = apiUrl + "?direccion=" + direccion;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if(data.direccionesNormalizadas.length > 0) {
        var latitud = data.direccionesNormalizadas[0].coordenadas.y;
        var longitud = data.direccionesNormalizadas[0].coordenadas.x;
        return {
          coordenadas: [latitud, longitud]
        };
      }
    });
}


// Inicializar el mapa cuando se cargue la página
initMap();