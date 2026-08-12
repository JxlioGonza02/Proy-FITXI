const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Experto {
    static async crear(datosExperto) {
        try {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(datosExperto.password, salt);

            const [result] = await pool.execute(
                `INSERT INTO expertos (nombre, email, password_hash, telefono, especialidad, descripcion, experiencia_años, radio_servicio_km
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    datosExperto.nombre,
                    datosExperto.email,
                    password_hash,
                    datosExperto.telefono || null,
                    datosExperto.especialidad,
                    datosExperto.descripcion || null,
                    datosExperto.experiencia_años || 0,
                    datosExperto.radio_servicio_km || 5.00
                ]
            );
            
            return { 
                id: result.insertId, 
                mensaje: 'Experto registrado exitosamente. Pendiente de verificación.' 
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El email ya está registrado');
            }
            throw error;
        }
    }

    static async buscarPorEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM expertos WHERE email = ? AND activo = TRUE',
            [email]
        );
        return rows[0];
    }

    static async login(email, password) {
        const experto = await this.buscarPorEmail(email);
        
        if (!experto) {
            throw new Error('Experto no encontrado');
        }

        const passwordValido = await bcrypt.compare(password, experto.password_hash);
        
        if (!passwordValido) {
            throw new Error('Contraseña incorrecta');
        }

        const { password_hash, ...expertoSinPassword } = experto;
        return expertoSinPassword;
    }
}

module.exports = Experto;