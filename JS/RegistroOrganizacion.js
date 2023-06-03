document.getElementById("registroForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener los valores de los campos del formulario
  var nombre = document.getElementById("nombre").value;
  var descripcion = document.getElementById("descripcion").value;
  var actividades = document.getElementById("actividades").value;
  var direccion = document.getElementById("direccion").value;
  var horarios = document.getElementById("horarios").value;
  var telefono = document.getElementById("telefono").value;

  // Validar los campos (puedes agregar tus propias validaciones aquí)

  // Realizar las acciones de registro (puedes hacer una solicitud AJAX al servidor, almacenar en una base de datos, etc.)
  // Aquí se muestra una alerta de registro exitoso
  alert("¡Registro exitoso!");
  volverInicio();


  // Limpiar los campos del formulario
  document.getElementById("registroForm").reset();
});