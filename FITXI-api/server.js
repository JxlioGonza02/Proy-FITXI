// Cargamos las herramientas que instalamos
const express = require('express');
const cors = require('cors');

// Creamos nuestra aplicación
const app = express();

// Configuraciones básicas
app.use(cors()); // Permitimos comunicación con el frontend
app.use(express.json()); // Para entender datos en formato JSON

// Nuestra primera ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '¡Bienvenido a FITXI API!',
        version: '1.0.0'
    });
});

// Ruta para probar que funciona
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date()
    });
});

// Iniciamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 FITXI API corriendo en http://localhost:${PORT}`);
});