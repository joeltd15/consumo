let peajesData = [];

        document.addEventListener('DOMContentLoaded', function () {
            axios.get('https://www.datos.gov.co/resource/7gj8-j6i3.json')
                .then(function (response) {
                    peajesData = response.data;
                    let selectPeajes = document.getElementById('nombrePeaje');

                    let peajesUnicos = new Set();

                    peajesData.forEach(function (peaje) {
                        if (peaje.peaje) {
                            peajesUnicos.add(peaje.peaje);
                        }
                    });

                    peajesUnicos.forEach(function (peaje) {
                        var option = document.createElement('option');
                        option.value = peaje;
                        option.textContent = peaje;
                        selectPeajes.appendChild(option);
                    });
                })
                .catch(function (error) {
                    console.error('Error al obtener la lista de peajes:', error);
                });
        });


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
  

// Evento al enviar el formulario (para insertar o actualizar)
document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const nombrePeaje = document.getElementById('nombrePeaje').value;
    const idCategoriaTarifa = document.getElementById('idCategoriaTarifa').value;
    const fecha = document.getElementById('fecha').value;
    const valorPeaje = document.getElementById('valor').value;
  
    const data = {
        placa: placa,
        nombrePeaje: nombrePeaje,
        idCategoriaTarifa: idCategoriaTarifa,
        fecha: fecha,
        valor: Number(valorPeaje)
    };
  
    try {
        const response = await fetch('http://localhost:5172/api/peaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
  
        if (!response.ok) {
            throw new Error(`Error ${response.status} - ${response.statusText}`);
        }
  
        alert('Guardado correctamente');
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        alert('Error al guardar el registro');
    }
});

  