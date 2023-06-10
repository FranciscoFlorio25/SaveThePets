//Seleccionar los inputs del formulario
let nombre = document.getElementById("nombre")
let horarios = document.getElementById("horarios")
let telefono = document.getElementById("telefono")
let servicios = document.getElementById("servicios")
let direccion = document.getElementById("direccion");
let actividades = document.getElementById("actividades")
let descripcion = document.getElementById("descripcion")

//Seleccionando otros cosas necesesarias del formulario
let selectElement = document.getElementById('direccionesSelect')
let botonActividades = document.getElementById('AgregarActividad')
let botonServicios = document.getElementById('AgregarServicio')

let serviciosIngresados = []
let actividadesIngresadas = []

botonActividades.addEventListener('click', () => {
  
  if(actividades.value != ''){
    alertify.set('notifier', 'position', 'top-right');
    alertify.success('¡Actividad agregada!');
    actividadesIngresadas.push(actividades.value)
    serviciosyActividades['actividades'] = true
  }

})

botonServicios.addEventListener('click', () => {
  
  if(servicios.value != ''){
    alertify.set('notifier', 'position', 'top-right');
    alertify.success('¡Servicio agregado!');
    serviciosIngresados.push(actividades.value)
    serviciosyActividades['servicios'] = true
  }

})

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
let inputs = [nombre, descripcion, horarios, telefono, direccion]

//Booleano que dice si existe algun  input incompleto
let existeInputVacio = true

//Comprobacion de campos completos
let camposCompletos = {
  nombre:false,
  descripcion:false, 
  direccion:false,
  horarios:false, 
  telefono:false,
}

//Comprobacion de servicios y actividades
let serviciosyActividades = {
  servicios:false,
  actividades:false,
}

//Función que valida que los campos esten completos.
function validarCampo(event){
  //Input a validar
  let inputCorrespondiente = event.target

  //Validación de campo no vacío
  if (inputCorrespondiente.value === ''){
    inputCorrespondiente.classList.add("noVerificated")
    inputCorrespondiente.classList.remove("siVerificated")
    camposCompletos[inputCorrespondiente.name] = false
  }else{
    inputCorrespondiente.classList.add("siVerificated")
    inputCorrespondiente.classList.remove("noVerificated")
    camposCompletos[inputCorrespondiente.name] = true
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
    "Actividades":[...actividadesIngresadas],
    "Servicios": [...serviciosIngresados],
    "Direccion": `${selectElement.value}`,
    "Horarios": `${horarios.value}`,
    "Telefono": `${telefono.value}`
  }

  const datosJSON = JSON.stringify(datosDeFormulario);

  localStorage.setItem('nuevaOrganizacion', datosJSON);
  console.log(datosDeFormulario)
  window.location.href = "Organizaciones.html"
}

agregarEventoInputs()

document.getElementById("registroForm").addEventListener("submit", function(event) {
  // Evita el evento submit por defecto del formulario
  event.preventDefault();
  
  const todosCompletos = Object.values(camposCompletos).every(valor => valor === true);
  const arraysCompletos = Object.values(serviciosyActividades).every(valor => valor === true);

  let formulario = document.getElementById("registroForm")
  let spanFormulario = formulario.querySelector('#mensajeError')
    
    spanFormulario.innerHTML = ""

  // Se valida que no hayan campos vacios para realizar el envio.
  if (todosCompletos && arraysCompletos) {
    //Alertas visuales para el usuario
    alertify.message('Enviando datos...');
    
    setTimeout(() => {
      enviarDatos();
    }, 1000);

    formulario.reset();
  } else if (!arraysCompletos && todosCompletos) {
    console.log('soy arrays',arraysCompletos)
    console.log('soy campos completos',todosCompletos)
    console.log('Soy servicios y actividadaes', serviciosyActividades)
    console.log(serviciosIngresados, actividadesIngresadas)
    spanFormulario.innerHTML += "Faltan sumar actividades o servicios. Si no cuentan con estos, <br> agregue el texto 'Vacio' en los campos correspondientes.";
  } else if (!todosCompletos && arraysCompletos) {
    spanFormulario.innerHTML += "Falta completar campos de información para poder registrar la organización.";
  } else if (!todosCompletos && !arraysCompletos) {
    spanFormulario.innerHTML += "Por favor complete la información requerida.";
  }

});