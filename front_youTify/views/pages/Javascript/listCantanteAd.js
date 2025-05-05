// Función para obtener los cantantes desde la API y mostrarlos en la tabla
async function fetchCantantes() {
    try {
        const response = await fetch("http://localhost:3001/artista/obtenerArtistas");
        const cantantes = await response.json();

        const tableBody = document.getElementById("cantantesTableBody");
        tableBody.innerHTML = ""; // Limpiar el contenido previo

        cantantes.forEach(cantante => {
            const row = document.createElement("tr");

            // Columna de Imagen
            const imgCell = document.createElement("td");
            const img = document.createElement("img");
            img.src = `http://localhost:3001/${cantante.path}`;;
            img.alt = cantante.nombre;
            img.style.width = "50px";
            img.style.height = "50px";
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            // Columna de Nombre
            const nameCell = document.createElement("td");
            nameCell.textContent = cantante.nombre;
            row.appendChild(nameCell);

            // Columna de Acciones
            const actionsCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.className = "btn btn-primary btn-sm me-2";
            editButton.onclick = () => editCantante(cantante.id_artista);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.onclick = () => deleteCantante(cantante.id_artista);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener los cantantes:", error);
    }
}

// Función para crear un nuevo cantante
function createSinger() {
    // Aquí puedes redirigir a un formulario o abrir un modal para crear un nuevo cantante
    alert("Función para agregar un nuevo cantante.");
}

// Función para editar un cantante
function editCantante(id) {
    window.location.href = `formCantante.html?id=${id}`; 
}

// Función para eliminar un cantante
function deleteCantante(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este cantante?")) {
        fetch(`http://localhost:3001/artista/eliminarArtista/${id}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                alert(`Cantante con ID: ${id} eliminado exitosamente.`);
                fetchCantantes(); // Recargar la tabla después de eliminar
            } else {
                alert("Error al eliminar el cantante.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar el cantante:", error);
            alert("Ocurrió un error al intentar eliminar el cantante.");
        });
    }
}
// Llamar a la función para cargar los cantantes al cargar la página
document.addEventListener("DOMContentLoaded", fetchCantantes);