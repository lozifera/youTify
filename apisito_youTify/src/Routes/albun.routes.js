const express = require('express');
const router = express.Router();
const {crearAlbun,obtenerAlbunes,obtenerAlbunPorId,eliminarAlbun,editarAlbun,obtenerAlbunesPorArtista,upload} = require('../controllers/albun.controllers');

router.post('/crearAlbun', upload.single('file'), crearAlbun);
router.get('/obtenerAlbunes', obtenerAlbunes);
router.get('/obtenerAlbunes/:id', obtenerAlbunPorId);
router.delete('/eliminarAlbun/:id', eliminarAlbun);
router.patch('/editarAlbun/:id', upload.single('file'), editarAlbun);
router.get('/artista/:id_artista', obtenerAlbunesPorArtista);

module.exports = router;

