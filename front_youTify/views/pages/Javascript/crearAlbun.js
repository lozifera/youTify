document.addEventListener('DOMContentLoaded', async () => {
    const selectArtista = document.createElement('select');
    selectArtista.id = 'artistaAlbun';
    selectArtista.classList.add('form-select', 'mb-3');
    selectArtista.required = true;

    const form = document.getElementById('formAlbun');
    form.insertBefore(selectArtista, form.querySelector('button'));

    // Cargar artistas en el combo box
    try {
        const response = await fetch('http://localhost:3001/artista/obtenerArtistas');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de artistas');
        }

        const artistas = await response.json();

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = 'Seleccione un artista';
        selectArtista.appendChild(defaultOption);

        artistas.forEach(artista => {
            const option = document.createElement('option');
            option.value = artista.id_artista; // Usar el ID del artista como valor
            option.textContent = artista.nombre; // Mostrar el nombre del artista
            selectArtista.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los artistas:', error);
        alert('No se pudo cargar la lista de artistas');
    }

    // Obtener el ID del álbum desde la URL (si existe)
    const urlParams = new URLSearchParams(window.location.search);
    const albunId = urlParams.get('id');

    if (albunId) {
        // Si hay un ID, cargar los datos del álbum para editar
        try {
            const response = await fetch(`http://localhost:3001/albun/obtenerAlbunes/${albunId}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos del álbum');
            }

            const albun = await response.json();

            // Rellenar el formulario con los datos del álbum
            document.getElementById('nombreAlbun').value = albun.nombre;
            selectArtista.value = albun.id_artista;

            // Mostrar la imagen de previsualización
            const preview = document.getElementById('preview');
            preview.src = `http://localhost:3001/${albun.path}`;
            preview.classList.remove('d-none');
        } catch (error) {
            console.error('Error al cargar los datos del álbum:', error);
            alert('No se pudo cargar los datos del álbum');
        }
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreAlbun').value;
        const id_artista = selectArtista.value;
        const fileInput = document.querySelector('input[type="file"]');
        const formData = new FormData();

        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        formData.append('nombre', nombre);
        formData.append('id_artista', id_artista);

        try {
            const url = albunId
                ? `http://localhost:3001/albun/editarAlbun/${albunId}` // Usar PATCH para editar
                : 'http://localhost:3001/albun/crearAlbun'; // Usar POST para crear
            const method = albunId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(albunId ? 'Error al editar el álbum' : 'Error al crear el álbum');
            }

            const result = await response.json();
            alert(result.message);
            if (!albunId) {
                form.reset();
                document.getElementById('preview').classList.add('d-none');
            }
        } catch (error) {
            console.error(albunId ? 'Error al editar el álbum:' : 'Error al crear el álbum:', error);
            alert(albunId ? 'No se pudo editar el álbum' : 'No se pudo crear el álbum');
        }
    });
});