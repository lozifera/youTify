// Cargar la barra de navegación
fetch('../../components/navbarAdmin.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar la barra de navegación');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    })
    .catch(error => console.error(error));