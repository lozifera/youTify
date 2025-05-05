document.addEventListener("DOMContentLoaded", () => {
    const cancionesContainer = document.createElement("div");
    cancionesContainer.classList.add("row", "mt-4", "g-4");
    cancionesContainer.id = "canciones-container";
    document.querySelector(".container").appendChild(cancionesContainer);

    // Obtener el parámetro id_albun de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idAlbun = urlParams.get("id_albun");

    if (idAlbun) {
        // Hacer la solicitud a la API para obtener las canciones
        fetch(`http://localhost:3001/cancion/album/${idAlbun}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener las canciones");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    const noDataMessage = document.createElement("p");
                    noDataMessage.textContent = "No se encontraron canciones para este álbum.";
                    noDataMessage.classList.add("text-center", "text-muted");
                    cancionesContainer.appendChild(noDataMessage);
                    return;
                }

                data.forEach(cancion => {
                    const card = document.createElement("div");
                    card.classList.add("col-md-3");

                    card.innerHTML = `
                        <div class="card shadow-sm">
                            <img src="http://localhost:3001/${cancion.path}" class="card-img-top" alt="${cancion.nombre}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${cancion.nombre}</h5>
                                <audio controls class="w-100 mt-2">
                                    <source src="http://localhost:3001/${cancion.audioPath}" type="audio/mpeg">
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                        </div>
                    `;

                    cancionesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error al cargar las canciones:", error);
                const errorMessage = document.createElement("p");
                errorMessage.textContent = "Error al cargar las canciones.";
                errorMessage.classList.add("text-danger", "text-center");
                cancionesContainer.appendChild(errorMessage);
            });
    } else {
        // Hacer la solicitud a la API para obtener todas las canciones
        fetch(`http://localhost:3001/cancion/obtenerCanciones`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener las canciones");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    const noDataMessage = document.createElement("p");
                    noDataMessage.textContent = "No se encontraron canciones.";
                    noDataMessage.classList.add("text-center", "text-muted");
                    cancionesContainer.appendChild(noDataMessage);
                    return;
                }

                data.forEach(cancion => {
                    const card = document.createElement("div");
                    card.classList.add("col-md-3");

                    card.innerHTML = `
                        <div class="card shadow-sm">
                            <img src="http://localhost:3001/${cancion.path}" class="card-img-top" alt="${cancion.nombre}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${cancion.nombre}</h5>
                                <audio controls class="w-100 mt-2">
                                    <source src="http://localhost:3001/${cancion.audioPath}" type="audio/mpeg">
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                        </div>
                    `;

                    cancionesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error al cargar las canciones:", error);
                const errorMessage = document.createElement("p");
                errorMessage.textContent = "Error al cargar las canciones.";
                errorMessage.classList.add("text-danger", "text-center");
                cancionesContainer.appendChild(errorMessage);
            });
    }
});