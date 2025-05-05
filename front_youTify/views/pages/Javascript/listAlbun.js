document.addEventListener("DOMContentLoaded", () => {
    fetchAlbunes();
});

function fetchAlbunes() {
    fetch("http://localhost:3001/albun/obtenerAlbunes")
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error("Error al obtener los álbumes:", error));
}

function populateTable(albunes) {
    const tableBody = document.getElementById("albunesTableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    albunes.forEach(albun => {
        const row = document.createElement("tr");

        // Columna de imagen
        const imgCell = document.createElement("td");
        imgCell.classList.add("text-center");
        const img = document.createElement("img");
        img.src = `http://localhost:3001/${albun.path}`;
        img.alt = `Imagen de ${albun.nombre}`;
        img.classList.add("img-thumbnail");
        img.style.width = "100px";
        img.style.height = "auto";
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        // Columna de nombre
        const nameCell = document.createElement("td");
        nameCell.textContent = albun.nombre;
        row.appendChild(nameCell);

        // Columna de acciones
        const actionsCell = document.createElement("td");
        actionsCell.classList.add("d-flex", "justify-content-center", "gap-2");

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.textContent = "Editar";
        editButton.onclick = () => editAlbun(albun.id_albun);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteAlbun(albun.id_albun);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function createAlbum() {
    alert("Crear nuevo álbum");
    // Aquí puedes implementar la lógica para crear un nuevo álbum
}

function editAlbun(id) {
    window.location.href = `formAlbun.html?id=${id}`;
    // Aquí puedes implementar la lógica para editar un álbum
}

function deleteAlbun(id) {
    if (confirm("¿Estás seguro de eliminar este álbum?")) {
        fetch(`http://localhost:3001/albun/eliminarAlbun/${id}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                alert(`Álbum con ID: ${id} eliminado exitosamente.`);
                fetchAlbunes(); // Recargar la tabla después de eliminar
            } else {
                alert("Error al eliminar el álbum.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar el álbum:", error);
            alert("Ocurrió un error al intentar eliminar el álbum.");
        });
    }
}