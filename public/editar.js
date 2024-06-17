let peajesData = [];

document.addEventListener('DOMContentLoaded', async function () {
    await cargarNombresPeajes(); // Cargar nombres de peajes desde la API

    // Obtener el ID del registro a editar desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        await cargarDatosRegistro(id); // Cargar los datos del registro para editar
    }
});

// Función para cargar los nombres de los peajes desde la API externa
async function cargarNombresPeajes() {
    try {
        const response = await fetch('https://www.datos.gov.co/resource/7gj8-j6i3.json');
        const data = await response.json();

        const selectPeajes = document.getElementById('nombrePeaje');
        selectPeajes.innerHTML = ''; // Limpiar opciones anteriores

        data.forEach(peaje => {
            const option = document.createElement('option');
            option.value = peaje.peaje;
            option.textContent = peaje.peaje;
            selectPeajes.appendChild(option);
        });

        peajesData = data; // Guardar los datos de los peajes globalmente
    } catch (error) {
        console.error('Error al cargar nombres de peajes:', error);
    }
}

// Función para buscar el valor del peaje según nombre seleccionado y categoría de tarifa
function buscarValorPeaje() {
    let nombrePeaje = document.getElementById('nombrePeaje').value;
    let categoriaTarifa = document.getElementById('idCategoriaTarifa').value;
    let valor = document.getElementById('valor');

    let valorEncontrado = null;

    for (let i = 0; i < peajesData.length; i++) {
        let peaje = peajesData[i];
        if (peaje.peaje === nombrePeaje && peaje.idcategoriatarifa === categoriaTarifa) {
            valorEncontrado = peaje.valor;
            break;
        }
    }

    if (valorEncontrado !== null) {
        valor.value = valorEncontrado;
    } else {
        valor.value = 'Valor no encontrado';
    }
}

// Función para cargar los datos de un registro para editar
async function cargarDatosRegistro(id) {
    try {
        const response = await fetch(`http://localhost:5172/api/peaje/${id}`);
        const data = await response.json();

        document.getElementById('placa').value = data.placa;
        document.getElementById('nombrePeaje').value = data.nombrePeaje;
        document.getElementById('idCategoriaTarifa').value = data.idCategoriaTarifa;

        // Formatear la fecha para asignarla al input datetime-local
        const fecha = new Date(data.fecha);
        const formattedDate = fecha.toISOString().slice(0, 16); // Formato yyyy-mm-ddThh:mm
        document.getElementById('fecha').value = formattedDate;

        document.getElementById('valor').value = data.valor;
        document.getElementById('registroId').value = id; // Asignar el ID del registro al campo oculto
    } catch (error) {
        console.error('Error al cargar datos del registro:', error);
    }
}

// Evento al enviar el formulario (para insertar o actualizar)
document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('registroId').value; // Obtener ID del registro del campo oculto
    const placa = document.getElementById('placa').value;
    const nombrePeaje = document.getElementById('nombrePeaje').value;
    const idCategoriaTarifa = document.getElementById('idCategoriaTarifa').value;
    const fecha = document.getElementById('fecha').value;
    const valorPeaje = document.getElementById('valor').value;

    // Validación de datos
    if (!id || !placa || !nombrePeaje || !idCategoriaTarifa || !fecha || !valorPeaje) {
        alert('Todos los campos son obligatorios');
        return;
    }

    // Formato de datos a enviar
    const data = {
        placa: placa,
        nombrePeaje: nombrePeaje,
        idCategoriaTarifa: idCategoriaTarifa,
        fecha: fecha,
        valor: Number(valorPeaje)
    };

    try {
        const response = await fetch(`http://localhost:5172/api/peaje/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status} - ${response.statusText}`);
        }

        alert('Actualizado correctamente');
    } catch (error) {
        console.error('Error al editar el registro:', error);
        alert('Error al editar el registro');
    }
});
