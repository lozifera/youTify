const { Albun } = require('../models');
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

const crearAlbun = async (req, res) => {
    const { nombre, id_artista } = req.body;
    const fileName = req.file.filename; // Nombre del archivo subido
    const imgpath = `uploads/img/${fileName}`; // Ruta del archivo subido
    try {
        await Albun.create({
            nombre,
            path: imgpath,
            fileName: fileName,
            id_artista,
        });
        res.status(201).json({ message: 'Álbum creado exitosamente' });
    }
    catch (error) {
        console.error('Error al crear el álbum:', error, nombre, id_artista, id_genero);
        res.status(500).json({ message: 'Error al crear el álbum' });
    }
};

const obtenerAlbunes = async (req, res) => {
    try {
        const albunes = await Albun.findAll();
        res.status(200).json(albunes);
    } catch (error) {
        console.error('Error al obtener los álbumes:', error);
        res.status(500).json({ message: 'Error al obtener los álbumes' });
    }
};

const obtenerAlbunPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const albun = await Albun.findByPk(id);
        if (!albun) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }
        res.status(200).json(albun);
    } catch (error) {
        console.error('Error al obtener el álbum:', error);
        res.status(500).json({ message: 'Error al obtener el álbum' });
    }
};
const eliminarAlbun = async (req, res) => {
    const { id } = req.params;
    try {
        const albun = await Albun.findByPk(id);
        if (!albun) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }
        await albun.destroy();
        res.status(200).json({ message: 'Álbum eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el álbum:', error);
        res.status(500).json({ message: 'Error al eliminar el álbum' });
    }
};

const editarAlbun = async (req, res) => {
    const { id } = req.params; // ID del álbum a editar
    const { nombre, id_artista } = req.body; // Campos a actualizar
    let fileName = null;
    let imgpath = null;

    // Verifica si se subió un archivo
    if (req.file) {
        fileName = req.file.filename; // Nombre del archivo subido
        imgpath = `uploads/img/${fileName}`; // Ruta del archivo subido
    }

    try {
        // Busca el álbum por ID
        const albun = await Albun.findByPk(id);
        if (!albun) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }

        // Actualiza los campos si están presentes
        if (nombre) albun.nombre = nombre;
        if (id_artista) albun.id_artista = id_artista;
        if (imgpath) {
            albun.path = imgpath;
            albun.fileName = fileName;
        }

        // Guarda los cambios en la base de datos
        const albunActualizado = await albun.save();
        res.status(200).json({ message: 'Álbum actualizado exitosamente', albun: albunActualizado });
    } catch (error) {
        console.error('Error al editar el álbum:', error);
        res.status(500).json({ message: 'Error al editar el álbum' });
    }
};

const obtenerAlbunesPorArtista = async (req, res) => {
    const { id_artista } = req.params; // ID del artista a filtrar
    try {
        const albunes = await Albun.findAll({
            where: { id_artista } // Filtra por el campo id_artista
        });
        if (albunes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron álbumes para este artista' });
        }
        res.status(200).json(albunes);
    } catch (error) {
        console.error('Error al obtener los álbumes por artista:', error);
        res.status(500).json({ message: 'Error al obtener los álbumes por artista' });
    }
};

module.exports = {
    crearAlbun,
    obtenerAlbunes,
    obtenerAlbunPorId,
    eliminarAlbun,
    editarAlbun,
    obtenerAlbunesPorArtista, // Exporta el nuevo controlador
    upload
};