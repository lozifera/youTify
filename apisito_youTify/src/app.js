const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const generoRoutes = require('./Routes/genero.routes'); 
const artistaRoutes = require('./Routes/artista.routes');
const albunRoutes = require('./Routes/albun.routes'); 
const cancionRoutes = require('./Routes/cancion.routes');

const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/genero', generoRoutes);
app.use('/artista', artistaRoutes);
app.use('/albun', albunRoutes);
app.use('/cancion', cancionRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.render('index', { title: 'Bienvenido a YouTify' }); // Renderiza una vista básica
});

module.exports = app;