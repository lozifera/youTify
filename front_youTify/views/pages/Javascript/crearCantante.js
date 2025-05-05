document.addEventListener("DOMContentLoaded", async () => {
    const generoSelect = document.getElementById("generoCantante");
    const form = document.getElementById("formCancion");
    const urlParams = new URLSearchParams(window.location.search);
    const cantanteId = urlParams.get("id");

    // Fetch genres and populate the select dropdown
    fetch("http://localhost:3001/genero/obtenerGeneros")
        .then(response => response.json())
        .then(data => {
            data.forEach(genero => {
                const option = document.createElement("option");
                option.value = genero.id_genero;
                option.textContent = genero.nombre;
                generoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching genres:", error));

    // If an ID is provided, fetch the cantante data and populate the form
    if (cantanteId) {
        try {
            const response = await fetch(`http://localhost:3001/artista/obtenerArtistas/${cantanteId}`);
            if (response.ok) {
                const cantante = await response.json();
                document.getElementById("nombreCantante").value = cantante.nombre;
                generoSelect.value = cantante.id_genero;

                // Set preview image
                const preview = document.getElementById("preview");
                preview.src = `http://localhost:3001/${cantante.path}`;
                preview.classList.remove("d-none");
            } else {
                alert("Error al obtener los datos del cantante.");
            }
        } catch (error) {
            console.error("Error fetching cantante data:", error);
        }
    }

    // Handle form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombreCantante = document.getElementById("nombreCantante").value;
        const generoId = generoSelect.value;
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        if (!nombreCantante || !generoId || (!file && !cantanteId)) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombreCantante);
        formData.append("id_genero", generoId);
        if (file) {
            formData.append("file", file);
        }

        try {
            const url = cantanteId
                ? `http://localhost:3001/artista/editarArtista/${cantanteId}` // Use PATCH for updates
                : "http://localhost:3001/artista/crearArtista"; // Use POST for creation
            const method = cantanteId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Show success message
                form.reset();
                document.getElementById("preview").classList.add("d-none");
            } else {
                const errorData = await response.json();
                console.error("Error saving artist:", errorData);
                alert("Error al guardar el cantante.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error al enviar el formulario.");
        }
    });
});

// Preview image function
function previewImage(event) {
    const preview = document.getElementById("preview");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.classList.remove("d-none");
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.add("d-none");
    }
}