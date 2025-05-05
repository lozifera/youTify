document.addEventListener("DOMContentLoaded", () => {
    fetchCanciones();
});

async function fetchCanciones() {
    try {
        const cancionesResponse = await fetch("http://localhost:3001/cancion/obtenerCanciones");
        const canciones = await cancionesResponse.json();

        // Crear un mapa para almacenar los nombres de los álbumes
        const albumMap = {};

        // Obtener los nombres de los álbumes para cada id_albun
        for (const cancion of canciones) {
            if (!albumMap[cancion.id_albun]) {
                const albumResponse = await fetch(`http://localhost:3001/albun/obtenerAlbunes/${cancion.id_albun}`);
                const album = await albumResponse.json();
                albumMap[cancion.id_albun] = album.nombre; // Guardar el nombre del álbum en el mapa
            }
        }

        populateTable(canciones, albumMap);
    } catch (error) {
        console.error("Error al obtener las canciones o álbumes:", error);
    }
}

function populateTable(canciones, albumMap) {
    const tableBody = document.getElementById("cancionesTableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    canciones.forEach(cancion => {
        const row = document.createElement("tr");

        // Columna de imagen
        const imgCell = document.createElement("td");
        imgCell.classList.add("text-center");
        const img = document.createElement("img");
        img.src = `http://localhost:3001/${cancion.path}`;
        img.alt = `Imagen de ${cancion.nombre}`;
        img.classList.add("img-thumbnail");
        img.style.width = "100px";
        img.style.height = "auto";
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        // Columna de nombre
        const nameCell = document.createElement("td");
        nameCell.textContent = cancion.nombre;
        row.appendChild(nameCell);

        // Columna de archivo de audio
        const audioCell = document.createElement("td");
        const audioLink = document.createElement("a");
        audioLink.href = `http://localhost:3001/${cancion.audioPath}`;
        audioLink.textContent = "Reproducir";
        audioLink.target = "_blank";
        audioCell.appendChild(audioLink);
        row.appendChild(audioCell);

        // Columna de álbum
        const albumCell = document.createElement("td");
        albumCell.textContent = albumMap[cancion.id_albun] || "Desconocido";
        row.appendChild(albumCell);

        // Columna de acciones
        const actionsCell = document.createElement("td");
        actionsCell.classList.add("d-flex", "justify-content-center", "gap-2");

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.textContent = "Editar";
        editButton.onclick = () => editCancion(cancion.id_cancion);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteCancion(cancion.id_cancion);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function createSong() {
    alert("Crear nueva canción");
    // Aquí puedes implementar la lógica para crear una nueva canción
}

function editCancion(id) {
    window.location.href = `formCancion.html?id=${id}`;
    // Aquí puedes implementar la lógica para editar una canción
}

function deleteCancion(id) {
    if (confirm("¿Estás seguro de eliminar esta canción?")) {
        fetch(`http://localhost:3001/cancion/eliminarCancion/${id}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                alert(`Canción con ID: ${id} eliminada exitosamente.`);
                fetchCanciones(); // Recargar la tabla después de eliminar
            } else {
                alert("Error al eliminar la canción.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar la canción:", error);
            alert("Ocurrió un error al intentar eliminar la canción.");
        });
    }
}