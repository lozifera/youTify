document.addEventListener("DOMContentLoaded", () => {
    const albunesContainer = document.createElement("div");
    albunesContainer.classList.add("row", "mt-4", "g-4");
    albunesContainer.id = "albunes-container";
    document.querySelector(".container").appendChild(albunesContainer);

    // Obtener el parámetro id_artista de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idArtista = urlParams.get("id_artista");

    // Determinar la URL de la API según si hay o no un id_artista
    const apiUrl = idArtista
        ? `http://localhost:3001/albun/artista/${idArtista}`
        : `http://localhost:3001/albun/obtenerAlbunes`;

    // Hacer la solicitud a la API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los álbumes");
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No se encontraron álbumes.";
                noDataMessage.classList.add("text-center", "text-muted");
                albunesContainer.appendChild(noDataMessage);
                return;
            }

            data.forEach(albun => {
                const card = document.createElement("div");
                card.classList.add("col-md-3");

                card.innerHTML = `
                    <div class="card shadow-sm" style="cursor: pointer;">
                        <img src="http://localhost:3001/${albun.path}" class="card-img-top" alt="${albun.nombre}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${albun.nombre}</h5>
                        </div>
                    </div>
                `;

                // Redirigir a canciones.html con el id_albun
                card.addEventListener("click", () => {
                    window.location.href = `canciones.html?id_albun=${albun.id_albun}`;
                });

                albunesContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar los álbumes:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Error al cargar los álbumes.";
            errorMessage.classList.add("text-danger", "text-center");
            albunesContainer.appendChild(errorMessage);
        });
});