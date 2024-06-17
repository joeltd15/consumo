document.addEventListener('DOMContentLoaded', async function () {
  // Cargar nombres de peajes desde la API externa
  await cargarNombresPeajes();

  // Listar registros de la API local
  await listarRegistros();
});

// Función para cargar los nombres de los peajes desde la API externa
async function cargarNombresPeajes() {
  try {
    const response = await fetch('https://www.datos.gov.co/resource/7gj8-j6i3.json');
    const data = await response.json();

    const selectNombrePeaje = document.getElementById('nombrePeaje');
    selectNombrePeaje.innerHTML = ''; // Limpiamos opciones anteriores

    data.forEach(peaje => {
      const option = document.createElement('option');
      option.value = peaje.peaje;
      option.textContent = peaje.peaje;
      selectNombrePeaje.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar nombres de peajes:', error);
  }
}

// Función para listar todos los registros desde la API local
async function listarRegistros() {
  try {
    const response = await fetch('http://localhost:5172/api/peaje');
    const data = await response.json();

    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.innerHTML = ''; 

    data.forEach(registro => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${registro.placa}</td>
          <td>${registro.nombrePeaje}</td>
          <td>${registro.idCategoriaTarifa}</td>
          <td>${registro.fecha}</td>
          <td>${registro.valor}</td>
          <td>
              <a class="editar-btn" href="/editar?id=${registro.id}">Editar</a>
              <button class="eliminar-btn" data-id="${registro.id}">Eliminar</button>
          </td>
        `;

      // Agregar eventos a los botones de editar y eliminar
      const editarBtn = tr.querySelector('.editar-btn');
      editarBtn.addEventListener('click', () => editarRegistro(registro.id));

      const eliminarBtn = tr.querySelector('.eliminar-btn');
      eliminarBtn.addEventListener('click', () => confirmarEliminar(registro.id));

      cuerpoTabla.appendChild(tr);
    });
  } catch (error) {
    console.error('Error al listar registros:', error);
  }
}

// Función para editar un registro
function editarRegistro(id) {
  // Implementar lógica para editar un registro
  console.log('Editar registro con ID:', id);
}

// Función para confirmar y eliminar un registro
function confirmarEliminar(id) {
  if (confirm('¿Está seguro de que desea eliminar este registro?')) {
    eliminarRegistro(id);
  }
}

// Función para eliminar un registro
async function eliminarRegistro(id) {
  try {
    const response = await fetch(`http://localhost:5172/api/peaje/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar registro ${id}`);
    }

    alert('Registro eliminado correctamente');
    listarRegistros(); // Actualizar la tabla después de eliminar
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    alert('Error al eliminar registro');
  }
}
