const {Cancion} = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        // Verifica el tipo de archivo y asigna la carpeta de destino
        if (file.mimetype.startsWith('image/')) {
            uploadPath = 'src/public/uploads/img'; // Carpeta para imágenes
        } else if (file.mimetype === 'audio/mpeg') {
            uploadPath = 'src/public/uploads/audios'; // Carpeta para audios
        } else {
            return cb(new Error('Tipo de archivo no soportado'), false);
        }

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

const crearCancion = async (req, res) => {
    const { nombre, id_albun } = req.body;

    // Verifica si se subieron archivos
    const imageFile = req.files['imagen'] ? req.files['imagen'][0] : null;
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;

    // Rutas de los archivos subidos
    const imgpath = imageFile ? `uploads/img/${imageFile.filename}` : null;
    const audioPath = audioFile ? `uploads/audios/${audioFile.filename}` : null;

    try {
        await Cancion.create({
            nombre,
            path: imgpath,
            fileName: imageFile ? imageFile.filename : null,
            audioPath: audioPath,
            audioFileName: audioFile ? audioFile.filename : null,
            id_albun,
        });
        res.status(201).json({ message: 'Canción creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la canción:', error, nombre, id_albun);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

const obtenerCanciones = async (req, res) => {
    try {
        const canciones = await Cancion.findAll();
        res.status(200).json(canciones);
    } catch (error) {
        console.error('Error al obtener las canciones:', error);
        res.status(500).json({ message: 'Error al obtener las canciones' });
    }
};
const obtenerCancionesPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const cancion = await Cancion.findByPk(id);
        if (!cancion) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }
        res.status(200).json(cancion);
    } catch (error) {
        console.error('Error al obtener la canción:', error);
        res.status(500).json({ message: 'Error al obtener la canción' });
    }
};

const eliminarCancion = async (req, res) => {
    const { id } = req.params;
    try {
        const cancion = await Cancion.findByPk(id);
        if (!cancion) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }
        await cancion.destroy();
        res.status(200).json({ message: 'Canción eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        res.status(500).json({ message: 'Error al eliminar la canción' });
    }
};

const editarCancion = async (req, res) => {
    const { id } = req.params; // ID de la canción a editar
    const { nombre, id_albun } = req.body; // Campos a actualizar
    let fileName = null;
    let filePath = null;

    // Verifica si se subió un archivo
    if (req.file) {
        fileName = req.file.filename; // Nombre del archivo subido
        filePath = req.file.mimetype.startsWith('image/')
            ? `uploads/img/${fileName}` // Ruta para imágenes
            : `uploads/audios/${fileName}`; // Ruta para audios
    }

    try {
        // Busca la canción por ID
        const cancion = await Cancion.findByPk(id);
        if (!cancion) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }

        // Actualiza los campos si están presentes
        if (nombre) cancion.nombre = nombre;
        if (id_albun) cancion.id_albun = id_albun;
        if (filePath) {
            if (req.file.mimetype.startsWith('image/')) {
                cancion.path = filePath;
                cancion.fileName = fileName;
            } else if (req.file.mimetype.startsWith('audio/')) {
                cancion.audioPath = filePath;
                cancion.audioFileName = fileName;
            }
        }

        // Guarda los cambios en la base de datos
        const cancionActualizada = await cancion.save();
        res.status(200).json({ message: 'Canción actualizada exitosamente', cancion: cancionActualizada });
    } catch (error) {
        console.error('Error al editar la canción:', error);
        res.status(500).json({ message: 'Error al editar la canción' });
    }
};

const obtenerCancionesPorAlbun = async (req, res) => {
    const { id_albun } = req.params; // ID del álbum a filtrar
    try {
        const canciones = await Cancion.findAll({
            where: { id_albun } // Filtra por el campo id_albun
        });
        if (canciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron canciones para este álbum' });
        }
        res.status(200).json(canciones);
    } catch (error) {
        console.error('Error al obtener las canciones por álbum:', error);
        res.status(500).json({ message: 'Error al obtener las canciones por álbum' });
    }
};

module.exports = {  
    crearCancion,
    obtenerCanciones,
    obtenerCancionesPorId,
    eliminarCancion,
    editarCancion,
    obtenerCancionesPorAlbun, // Exporta el nuevo controlador
    upload: upload.fields([
        { name: 'imagen', maxCount: 1 }, // Campo para la imagen
        { name: 'audio', maxCount: 1 },  // Campo para el audio
    ]),
};