document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');
    const selectAlbun = document.getElementById('albunCancion');

    // Obtener el ID de la canción desde la URL (si existe)
    const urlParams = new URLSearchParams(window.location.search);
    const cancionId = urlParams.get('id');

    // Cargar álbumes en el combo box
    try {
        const response = await fetch('http://localhost:3001/albun/obtenerAlbunes');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de álbumes');
        }

        const albunes = await response.json();

        albunes.forEach(albun => {
            const option = document.createElement('option');
            option.value = albun.id_albun; // Usar el ID del álbum como valor
            option.textContent = albun.nombre; // Mostrar el nombre del álbum
            selectAlbun.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los álbumes:', error);
        alert('No se pudo cargar la lista de álbumes');
    }

    // Si hay un ID, cargar los datos de la canción para editar
    if (cancionId) {
        try {
            const response = await fetch(`http://localhost:3001/cancion/obtenerCanciones/${cancionId}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la canción');
            }

            const cancion = await response.json();

            // Rellenar el formulario con los datos de la canción
            document.getElementById('nombreCancion').value = cancion.nombre;
            selectAlbun.value = cancion.id_albun;

            // Mostrar la imagen de previsualización
            const preview = document.getElementById('preview');
            preview.src = `http://localhost:3001/${cancion.path}`;
            preview.classList.remove('d-none');

            // Mostrar el archivo de audio
            const audioPreview = document.getElementById('audioPreview');
            audioPreview.src = `http://localhost:3001/${cancion.audioPath}`;
            audioPreview.classList.remove('d-none');
        } catch (error) {
            console.error('Error al cargar los datos de la canción:', error);
            alert('No se pudo cargar los datos de la canción');
        }
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreCancion').value;
        const id_albun = selectAlbun.value;
        const imagenInput = document.getElementById('imagenCancion');
        const audioInput = document.getElementById('archivoCancion');
        const formData = new FormData();

        if (imagenInput.files.length > 0) {
            formData.append('imagen', imagenInput.files[0]);
        }
        if (audioInput.files.length > 0) {
            formData.append('audio', audioInput.files[0]);
        }
        formData.append('nombre', nombre);
        formData.append('id_albun', id_albun);

        try {
            const url = cancionId
                ? `http://localhost:3001/cancion/editarCancion/${cancionId}` // Usar PATCH para editar
                : 'http://localhost:3001/cancion/crearCancion'; // Usar POST para crear
            const method = cancionId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(cancionId ? 'Error al editar la canción' : 'Error al crear la canción');
            }

            const result = await response.json();
            alert(result.message);
            if (!cancionId) {
                form.reset();
                document.getElementById('preview').classList.add('d-none');
                document.getElementById('audioPreview').classList.add('d-none');
            }
        } catch (error) {
            console.error(cancionId ? 'Error al editar la canción:' : 'Error al crear la canción:', error);
            alert(cancionId ? 'No se pudo editar la canción' : 'No se pudo crear la canción');
        }
    });
});