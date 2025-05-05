const express = require('express');
const router = express.Router();
const { crearArtista,obtenerArtistas,obtenerArtistaPorId,eliminarArtista,editarArtista,obtenerArtistasPorGenero, upload } = require('../controllers/artista.controllers');


router.post('/crearArtista', upload.single('file'), crearArtista);
router.get('/obtenerArtistas', obtenerArtistas);
router.get('/obtenerArtistas/:id', obtenerArtistaPorId);
router.delete('/eliminarArtista/:id', eliminarArtista);
router.patch('/editarArtista/:id', upload.single('file'), editarArtista);
router.get('/genero/:id_genero', obtenerArtistasPorGenero);

module.exports = router;