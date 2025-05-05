document.addEventListener("DOMContentLoaded", () => {
    const generosContainer = document.createElement("div");
    generosContainer.classList.add("row", "mt-4", "g-4");
    generosContainer.id = "generos-container";
    document.querySelector(".container").appendChild(generosContainer);

    fetch("http://localhost:3001/genero/obtenerGeneros")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los géneros");
            }
            return response.json();
        })
        .then(data => {
            data.forEach(genero => {
                const card = document.createElement("div");
                card.classList.add("col-md-3");

                card.innerHTML = `
                    <div class="card shadow-sm" style="cursor: pointer;">
                        <img src="http://localhost:3001/${genero.path}" class="card-img-top" alt="${genero.nombre}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${genero.nombre}</h5>
                        </div>
                    </div>
                `;

    // Agregar evento click para redirigir a otra página
    card.addEventListener("click", () => {
        window.location.href = `cantantes.html?generoId=${genero.id_genero}`;
    });

    generosContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error(error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Error al cargar los géneros.";
            errorMessage.classList.add("text-danger", "text-center");
            generosContainer.appendChild(errorMessage);
        });
});