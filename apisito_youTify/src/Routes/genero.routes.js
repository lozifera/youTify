const express = require('express');
const router = express.Router();
const { crearGenero,obtenerGeneros,obtenerGeneroPorId,eliminarGenero,editarGenero, upload } = require('../controllers/genero.controllers');


router.post('/crearGenero', upload.single('file'), crearGenero);
router.get('/obtenerGeneros', obtenerGeneros);
router.get('/obtenerGeneros/:id', obtenerGeneroPorId);
router.delete('/eliminarGenero/:id', eliminarGenero);
router.patch('/editarGenero/:id', upload.single('file'), editarGenero);

module.exports = router;