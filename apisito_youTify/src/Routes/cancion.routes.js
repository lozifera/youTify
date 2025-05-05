const express = require('express');
const router = express.Router();
const { crearCancion,obtenerCanciones,obtenerCancionesPorId,eliminarCancion,editarCancion,obtenerCancionesPorAlbun, upload } = require('../controllers/cancion.controllers');

// Ruta para crear una canción (maneja la subida de imágenes y audios)
router.post('/crearCancion', upload, crearCancion);
router.get('/obtenerCanciones', obtenerCanciones);
router.get('/obtenerCanciones/:id', obtenerCancionesPorId);
router.delete('/eliminarCancion/:id', eliminarCancion);
router.patch('/editarCancion/:id', upload, editarCancion);
router.get('/album/:id_albun', obtenerCancionesPorAlbun);

module.exports = router;