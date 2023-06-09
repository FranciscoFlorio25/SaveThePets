//Seleccionar los inputs del formulario
let direccion = document.getElementById("direccion");
let nombre = document.getElementById("nombre")
let descripcion = document.getElementById("descripcion")
let actividades = document.getElementById("actividades")
let horarios = document.getElementById("horarios")
let telefono = document.getElementById("telefono")
let selectElement = document.getElementById('direccionesSelect')

//Validar la direccion con normalizador dado
async function validarDireccion(url){
  try {
    const response = await fetch(url);
    const data = await response.json();
    if(data.direccionesNormalizadas.length >= 1){
      const direccionesObtenidas = data.direccionesNormalizadas;
      
      const direcciones = []

      direccionesObtenidas.forEach(direccion => {
        direcciones.push(direccion);
      });

      selectElement.innerHTML = '';

      direcciones.forEach(direccion => {
        
        const optionElement = document.createElement('option');
        optionElement.value = direccion.direccion; // Asigna el valor adecuado a la opción del select
        optionElement.textContent = direccion.direccion; // Asigna el texto adecuado a la opción del select
        selectElement.appendChild(optionElement);
      });

    }
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

      //Obtiene el valor en boolean de la consulta de la direccion
      let resultadoValidacion = await validarDireccion(url);
      
      //Coloca los estilos correspondientes según resultado
      if (resultadoValidacion) {
        direccion.classList.add("siVerificated")
        direccion.classList.remove("noVerificated")
      } else {
        direccion.classList.add("noVerificated")
        direccion.classList.remove("siVerificated")
      }

    } catch (error) {
      console.error('Error en la validación de la dirección:', error);
    }
    
})

// Array con todos los inputs del formulario.
let inputs = [nombre, descripcion, actividades, horarios, telefono, direccion]
//Booleano que dice si existe algun  input incompleto
let existeInputVacio = true

//Función que valida que los campos esten completos.
function validarCampo(event){
  //Input a validar
  let inputCorrespondiente = event.target

  //Validación de campo no vacío
  if (inputCorrespondiente.value === ''){
    inputCorrespondiente.classList.add("noVerificated")
    inputCorrespondiente.classList.remove("siVerificated")
    existeInputVacio = true
  }else{
    inputCorrespondiente.classList.add("siVerificated")
    inputCorrespondiente.classList.remove("noVerificated")
    existeInputVacio = false
  }
}

//Funcion que agrega el evento a cada input.
function agregarEventoInputs(){
  //Se recorren todos los inputs del formulario y se le agrega comprobación
  inputs.forEach((input) => {
    input.addEventListener("blur", validarCampo)
  })
}

function enviarDatos(){

  const datosDeFormulario = {
    "IdOrganizacion": "6",
    "Nombre": `${nombre.value}`,
    "Descripción": `${descripcion.value}`,
    "Actividades":["Vacio"],
    "Servicios": ["Vacio"],
    "Direccion": `${selectElement.value}`,
    "Horarios": `${horarios.value}`,
    "Telefono": `${telefono.value}`
  }

  const datosJSON = JSON.stringify(datosDeFormulario);

  localStorage.setItem('nuevaOrganizacion', datosJSON);

  window.location.href = "Organizaciones.html"
}

agregarEventoInputs()

document.getElementById("registroForm").addEventListener("submit", function(event) {
  // Evita el evento submit por defecto del formulario
  event.preventDefault();
  
  // Se valida que no hayan campos vacios para realizar el envio.
  if(!existeInputVacio){
      alert("¡Registro exitoso!")
      enviarDatos()
      spanFormulario.innerHTML += ""
      document.getElementById("registroForm").reset()
  }else{
     //avisarCamposIncompletos()
     let formulario = document.getElementById("registroForm")
     let spanFormulario = formulario.querySelector('#mensajeError')
     if(spanFormulario.innerHTML.length === 0){
      spanFormulario.innerHTML += "Falta completar información para poder registrar informacion."
     }
  }

});