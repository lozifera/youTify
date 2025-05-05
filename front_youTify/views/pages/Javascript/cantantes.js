document.addEventListener("DOMContentLoaded", () => {
    const cantantesContainer = document.createElement("div");
    cantantesContainer.classList.add("row", "mt-4", "g-4");
    cantantesContainer.id = "cantantes-container";
    document.querySelector(".container").appendChild(cantantesContainer);

    // Obtener el parámetro generoId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const generoId = urlParams.get("generoId");

    // Determinar la URL de la API según si hay o no un generoId
    const apiUrl = generoId 
        ? `http://localhost:3001/artista/genero/${generoId}` 
        : `http://localhost:3001/artista/obtenerArtistas`;

    // Hacer la solicitud a la API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los cantantes");
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No se encontraron cantantes.";
                noDataMessage.classList.add("text-center", "text-muted");
                cantantesContainer.appendChild(noDataMessage);
                return;
            }

            data.forEach(cantante => {
                const card = document.createElement("div");
                card.classList.add("col-md-3");

                card.innerHTML = `
                    <div class="card shadow-sm" style="cursor: pointer;">
                        <img src="http://localhost:3001/${cantante.path}" class="card-img-top" alt="${cantante.nombre}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${cantante.nombre}</h5>
                        </div>
                    </div>
                `;

                // Redirigir a albunes.html con el id_artista
                card.addEventListener("click", () => {
                    window.location.href = `albunes.html?id_artista=${cantante.id_artista}`;
                });

                cantantesContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar los cantantes:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Error al cargar los cantantes.";
            errorMessage.classList.add("text-danger", "text-center");
            cantantesContainer.appendChild(errorMessage);
        });
});