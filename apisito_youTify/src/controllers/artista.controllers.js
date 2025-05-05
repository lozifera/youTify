const {Artista} = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'src/public/uploads/img'; // Carpeta donde se guardarán las imágenes
        // Verifica si la carpeta existe, si no, la crea
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Crea la carpeta y subcarpetas si no existen
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    },
});
const upload = multer({ storage });

const crearArtista = async (req, res) => {
    const { nombre, id_genero } = req.body;
    const fileName = req.file.filename; // Nombre del archivo subido
    const imgpath = `uploads/img/${fileName}`; // Ruta del archivo subido
    try{
        await Artista.create({
            nombre,
            path: imgpath,
            fileName: fileName,
            id_genero, 
        });
        res.status(201).json({ message: 'Artista creado exitosamente' });
    }
    catch (error) {
        console.error('Error al crear el artista:', error);
        res.status(500).json({ message: 'Error al crear el artista' });
    }
};

const obtenerArtistas = async (req, res) => {
    try {
        const artistas = await Artista.findAll();
        res.status(200).json(artistas);
    } catch (error) {
        console.error('Error al obtener los artistas:', error);
        res.status(500).json({ message: 'Error al obtener los artistas' });
    }
};

const obtenerArtistaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const artista = await Artista.findByPk(id);
        if (!artista) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }
        res.status(200).json(artista);
    } catch (error) {
        console.error('Error al obtener el artista:', error);
        res.status(500).json({ message: 'Error al obtener el artista' });
    }
};

const eliminarArtista = async (req, res) => {
    const { id } = req.params;
    try {
        const artista = await Artista.findByPk(id);
        if (!artista) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }
        await artista.destroy();
        res.status(200).json({ message: 'Artista eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el artista:', error);
        res.status(500).json({ message: 'Error al eliminar el artista' });
    }
}

const editarArtista = async (req, res) => {
    const { id } = req.params; // ID del artista a editar

    // Verifica si req.body está definido
    if (!req.body) {
        return res.status(400).json({ message: 'El cuerpo de la solicitud está vacío' });
    }

    const { nombre, id_genero } = req.body; // Campos a actualizar
    let fileName = null;
    let imgpath = null;

    // Verifica si se subió un archivo
    if (req.file) {
        fileName = req.file.filename; // Nombre del archivo subido
        imgpath = `uploads/img/${fileName}`; // Ruta del archivo subido
    }

    try {
        // Busca el artista por ID
        const artista = await Artista.findByPk(id);
        if (!artista) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }

        // Actualiza los campos si están presentes
        if (nombre) artista.nombre = nombre;
        if (id_genero) artista.id_genero = id_genero;
        if (imgpath) {
            artista.path = imgpath;
            artista.fileName = fileName;
        }

        // Guarda los cambios en la base de datos
        const artistaActualizado = await artista.save();
        res.status(200).json({ message: 'Artista actualizado exitosamente', artista: artistaActualizado });
    } catch (error) {
        console.error('Error al editar el artista:', error);
        res.status(500).json({ message: 'Error al editar el artista' });
    }
};

const obtenerArtistasPorGenero = async (req, res) => {
    const { id_genero } = req.params; // ID del género a filtrar
    try {
        const artistas = await Artista.findAll({
            where: { id_genero } // Filtra por el campo id_genero
        });
        if (artistas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron artistas para este género' });
        }
        res.status(200).json(artistas);
    } catch (error) {
        console.error('Error al obtener los artistas por género:', error);
        res.status(500).json({ message: 'Error al obtener los artistas por género' });
    }
};

module.exports = {
    crearArtista,
    obtenerArtistas,
    obtenerArtistaPorId,
    eliminarArtista,
    editarArtista,
    obtenerArtistasPorGenero, // Exporta el nuevo controlador
    upload
};