function initMap() {
    // Coordenadas de CABA y AMBA
    var buenosAires = L.latLng(-34.6037, -58.3816);
  
    // Crear mapa centrado en CABA y AMBA
    var map = L.map('map', {
      center: buenosAires,
      zoom: 12
    });
  
    // Establecer el límite mínimo de zoom
    var minZoom = 10;
  
    // Evento zoomend para verificar el nivel de zoom
    map.on('zoomend', function() {
      if (map.getZoom() < minZoom) {
        map.setZoom(minZoom);
      }
    });
  
    // Limitar mapa a CABA y AMBA
    var southWest = L.latLng(-34.705, -58.525);
    var northEast = L.latLng(-34.385, -58.250);
    var bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    map.on('drag', function() {
      map.panInsideBounds(bounds, { animate: false });
    });
  
    // Cargar archivo JSON de Organizaciones

    fetch('/JSON/Organizaciones.json')
    .then(response => response.json())
    .then(data => {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          let organizacion = data[key];
  
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
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
      });
  }
  // Inicializar el mapa cuando se cargue la página
  initMap();
  