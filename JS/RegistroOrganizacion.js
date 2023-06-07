//Seleccionar el input de direccion
var direccion = document.getElementById("direccion");


// Obtener los valores de los campos del formulario
var nombre = document.getElementById("nombre").value;
var descripcion = document.getElementById("descripcion").value;
var actividades = document.getElementById("actividades").value;
var horarios = document.getElementById("horarios").value;
var telefono = document.getElementById("telefono").value;

//Validar la direccion con normalizador dado
async function validarDireccion(url){
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.direccionesNormalizadas.length > 0;
  } catch (error) {
    console.error('Error en la validación de la dirección:', error);
    return false;
  }
}

//Validar la dirrecion ingresada en formulario
direccion.addEventListener('input', async () => {
    var apiUrl = "http://servicios.usig.buenosaires.gob.ar/normalizar/"

    var url = `${apiUrl}?direccion=${direccion.value}`

    try {
      let resultadoValidacion = await validarDireccion(url);
  
      if (resultadoValidacion) {
        direccion.classList.add("siVerificated")
        direccion.classList.remove("noVerificated")
      } else {
        direccion.classList.add("noVerificated");
        direccion.classList.remove("siVerificated")

      }
    } catch (error) {
      console.error('Error en la validación de la dirección:', error);
    }
    
})


document.getElementById("registroForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Realizar las acciones de registro (puedes hacer una solicitud AJAX al servidor, almacenar en una base de datos, etc.)
  // Aquí se muestra una alerta de registro exitoso
  alert("¡Registro exitoso!");
  volverInicio();

  // Limpiar los campos del formulario
  document.getElementById("registroForm").reset();
});