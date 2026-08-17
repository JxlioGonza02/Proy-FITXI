const Experto = require("../models/experto");

const expertoController = {
  //Registro de nuevo Experto
  async register(req, res) {
    try {
      const {
        nombre,
        email,
        password,
        telefono,
        especialidad,
        descripcion,
        experiencia_años,
        radio_servicio_km
      } = req.body;

      // Validaciones especificas para expertos
      if (!nombre || !email || !password || !especialidad) {
        return res.status(400).json({
          error: "Nombre, email, contraseña y especialidad son obligatorios",
        });
      }

      const resultado = await Experto.crear({
        nombre,
        email,
        password,
        telefono,
        especialidad,
        descripcion,
        experiencia_años,
        radio_servicio_km
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: "Error al registrar experto" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const experto = await Experto.login(email, password);
      res.json({ message: "Inicio de sesión exitoso", experto });
    } catch (error) {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  },
};

module.exports = expertoController;