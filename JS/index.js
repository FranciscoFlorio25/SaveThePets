const map = L.map('mapa').setView([-34.542997465759115, -58.71187207895473], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);


var marker = L.marker([-34.542997465759115, -58.71187207895473]).addTo(map);

marker.bindPopup("Plaza de SM").openPopup();