document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const generoId = urlParams.get("id"); // Obtener el ID del género desde la URL (si existe)

    if (generoId) {
        // Si hay un ID, estamos en modo de edición
        try {
            const response = await fetch(`http://localhost:3001/genero/obtenerGeneros/${generoId}`);
            const genero = await response.json();

            // Rellenar el formulario con los datos del género
            document.getElementById("nombreGenero").value = genero.nombre;
            const preview = document.getElementById("preview");
            preview.src = `http://localhost:3001/${genero.path}`;
            preview.classList.remove("d-none");
        } catch (error) {
            console.error("Error al obtener los datos del género:", error);
        }
    }

    // Manejar el envío del formulario
    document.getElementById("formGenero").addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        const form = event.target;
        const formData = new FormData(form); // Crear un FormData con los datos del formulario

        // Si no se selecciona una nueva imagen, no incluirla en el FormData
        const fileInput = document.getElementById("imagenGenero");
        if (!fileInput.files.length) {
            formData.delete("imagen"); // Eliminar el campo de imagen si está vacío
        }

        try {
            const url = generoId
                ? `http://localhost:3001/genero/editarGenero/${generoId}` // API para editar
                : `http://localhost:3001/genero/crear`; // API para crear
            const method = generoId ? "PATCH" : "POST"; // Usar PATCH para editar y POST para crear

            const response = await fetch(url, {
                method: method,
                body: formData, // Enviar los datos del formulario
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Mostrar mensaje de éxito
                if (!generoId) {
                    form.reset(); // Limpiar el formulario solo en modo creación
                    document.getElementById("preview").classList.add("d-none"); // Ocultar la previsualización
                } else {
                    window.location.href = "listGeneroAd.html"; // Redirigir a la lista en modo edición
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    });
});