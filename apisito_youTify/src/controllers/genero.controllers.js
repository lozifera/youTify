const {Genero} = require('../models');
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

const crearGenero = async (req, res) => {
    const { nombre} = req.body;
    const fileName = req.file.filename; // Nombre del archivo subido
    const imgpath = `uploads/img/${fileName}`; // Ruta del archivo subido
    try{
        await Genero.create({
            nombre,
            path: imgpath,
            fileName: fileName,   
        });
        res.status(201).json({ message: 'Género creado exitosamente' });
    }catch (error) {
        console.error('Error al crear el género:', error, nombre);
        res.status(500).json({ message: 'Error al crear el género' });
    }
};

const obtenerGeneros = async (req, res) => {
    try {
        const generos = await Genero.findAll();
        res.status(200).json(generos);
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        res.status(500).json({ message: 'Error al obtener los géneros' });
    }
};

const obtenerGeneroPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }
        res.status(200).json(genero);
    } catch (error) {
        console.error('Error al obtener el género:', error);
        res.status(500).json({ message: 'Error al obtener el género' });
    }
};

const eliminarGenero = async (req, res) => {
    const { id } = req.params;
    try {
        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }
        await genero.destroy();
        res.status(200).json({ message: 'Género eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el género:', error);
        res.status(500).json({ message: 'Error al eliminar el género' });
    }
}

const editarGenero = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    let fileName = null;
    let imgpath = null;

    if (req.file) {
        fileName = req.file.filename;
        imgpath = `uploads/img/${fileName}`;
    }

    try {
        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }

        if (nombre) genero.nombre = nombre;
        if (imgpath) {
            genero.path = imgpath;
            genero.fileName = fileName;
        }

        const generoActualizado = await genero.save();
        res.status(200).json({ message: 'Género actualizado exitosamente', genero: generoActualizado });
    } catch (error) {
        console.error('Error al editar el género:', error);
        res.status(500).json({ message: 'Error al editar el género' });
    }
};

module.exports = {
    crearGenero,
    obtenerGeneros,
    obtenerGeneroPorId,
    eliminarGenero,
    editarGenero, // Asegúrate de exportar editarGenero
    upload
};
