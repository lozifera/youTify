document.addEventListener("DOMContentLoaded", () => {
    fetchGeneros();
});

function fetchGeneros() {
    fetch("http://localhost:3001/genero/obtenerGeneros")
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error("Error al obtener los géneros:", error));
}

function populateTable(generos) {
    const tableBody = document.getElementById("generosTableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    generos.forEach(genero => {
        const row = document.createElement("tr");

        // Columna de imagen
        const imgCell = document.createElement("td");
        imgCell.classList.add("text-center");
        const img = document.createElement("img");
        img.src = `http://localhost:3001/${genero.path}`;
        img.alt = `Imagen de ${genero.nombre}`;
        img.classList.add("img-thumbnail");
        img.style.width = "100px";
        img.style.height = "auto";
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        // Columna de nombre
        const nameCell = document.createElement("td");
        nameCell.textContent = genero.nombre;
        row.appendChild(nameCell);

        // Columna de acciones
        const actionsCell = document.createElement("td");
        actionsCell.classList.add("d-flex", "justify-content-center", "gap-2");

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.textContent = "Editar";
        editButton.onclick = () => editGenre(genero.id_genero);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteGenre(genero.id_genero);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function createGenre() {
    alert("Crear nuevo género");
    // Aquí puedes implementar la lógica para crear un nuevo género
}

function editGenre(id) {
    // Redirigir al formulario de edición con el ID del género en la URL
    window.location.href = `formGenero.html?id=${id}`;
}

function deleteGenre(id) {
    if (confirm("¿Estás seguro de eliminar este género?")) {
        fetch(`http://localhost:3001/genero/eliminarGenero/${id}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                alert(`Género con ID: ${id} eliminado exitosamente.`);
                fetchGeneros(); // Recargar la tabla después de eliminar
            } else {
                alert("Error al eliminar el género.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar el género:", error);
            alert("Ocurrió un error al intentar eliminar el género.");
        });
    }
}