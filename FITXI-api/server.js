// Cargamos las herramientas que instalamos
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Para poder usar variables de entorno

const expertoRoutes = require('./src/routes/expertoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const {  testConnection } = require('./src/config/database');

// Creamos nuestra aplicación
const app = express();

// Configuraciones básicas
app.use(cors()); // Permitimos comunicación con el frontend
app.use(express.json()); // Para entender datos en formato JSON
app.use('/api/usuarios', usuarioRoutes); // Rutas para usuarios
app.use('/api/expertos', expertoRoutes); // Rutas para expertos

// Nuestra primera ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '¡Bienvenido a FITXI API!',
        version: '1.0.0',
        endpoints: {
            usuarios: 'api/usuarios',
            expertos: 'api/expertos',
        }
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
const PORT = process.env.PORT || 3000;

async function startServer() {
    // Probar la conexión a la base de datos antes de iniciar el servidor
    const dbConectada = await testConnection();

    if (dbConectada) {
        app.listen(PORT, () => {
            console.log(`🚀 FITXI API corriendo en http://localhost:${PORT}`);
        });
    } else {
        console.error('❌ No se pudo conectar a la base de datos. Servidor no iniciado.');
        process.exit(1); // Salir del proceso con error
    }
}

startServer();