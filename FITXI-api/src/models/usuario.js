const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
    // Creamos nuevo usuario
    static async crear(datoUsuario) {
        try{
            // Encriptamos la contraseña
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(datoUsuario.password, salt);
            const [result] = await pool.execute(
                'INSERT INTO usuarios (nombre, email, password_hash, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
                [datoUsuario.nombre,
                datoUsuario.email,
                password_hash,
                datoUsuario.telefono || null,
                datoUsuario.direccion || null
                ]
            );
            return {
                id: result.insertId,
                mensaje: 'Usuario creado exitosamente'
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El correo electrónico ya está registrado');
            }
            throw error;
        }
    }

    // Obtenemos usuario por email
    static async buscarPorEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE', [email]
        );
        return rows[0];
    }

    static async buscarPorId(id) {
        const [rows] = await pool.execute(
            'SELECT id, nombre, email, telefono, direccion, fecha_registro fecha_registro FROM usuarios WHERE id = ? AND activo = TRUE', [id]
        );
        return rows[0];
    }

    // Login de usuario

    static async login(email, password) {
        const usuario = await this.buscarPorEmail(email);

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }
        
        // No devolvemos la contraseña en la respuesta
        const { password_hash, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }
}

module.exports = Usuario;
