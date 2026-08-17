const Usuario = require('../models/usuario');

const usuarioController = {
    //Regsitro de nuevo Usuario
    async register(req, res) {
        try {
            const {nombre, email, password, telefono, direccion} = req.body;
        
        // Validaciones basicas
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y contraseñas son obligatorios'});
        }
    
        const resultado = await Usuario.crear({
            nombre, email, password, telefono, direccion
        });
    
        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: resultado });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(400).json({ error: 'Error al registrar usuario' });
        }

    },

    //Login de Usuario
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
            }

            const usuario = await Usuario.login(email, password);
            res.json({ message: 'Inicio de sesión exitoso', usuario });
        } catch (error) {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    }
};

module.exports = usuarioController;