const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool =
  require('../config/database');


const login = async (req, res) => {

  try {

    const {
  usuario,
  password
} = req.body || {};


    if (
      typeof usuario !== 'string' ||
      typeof password !== 'string'
    ) {

      return res.status(400).json({
        message:
          'Usuario y contraseña son obligatorios'
      });

    }


    const usuarioLimpio =
      usuario.trim();


    if (
      usuarioLimpio.length === 0 ||
      password.length === 0
    ) {

      return res.status(400).json({
        message:
          'Usuario y contraseña son obligatorios'
      });

    }


    /*
     * CONSULTA PARAMETRIZADA
     * Protege contra SQL Injection
     */

    const [rows] =
      await pool.query(
        `
        SELECT
          id,
          usuario,
          password_hash,
          activo
        FROM usuarios_admin
        WHERE usuario = ?
        LIMIT 1
        `,
        [
          usuarioLimpio
        ]
      );


    if (rows.length === 0) {

      return res.status(401).json({
        message:
          'Usuario o contraseña incorrectos'
      });

    }


    const admin =
      rows[0];


    if (!admin.activo) {

      return res.status(403).json({
        message:
          'Usuario deshabilitado'
      });

    }


    const passwordCorrecta =
      await bcrypt.compare(
        password,
        admin.password_hash
      );


    if (!passwordCorrecta) {

      return res.status(401).json({
        message:
          'Usuario o contraseña incorrectos'
      });

    }


    const token =
      jwt.sign(
        {
          id: admin.id,
          usuario:
            admin.usuario
        },
        process.env.JWT_SECRET,
        {
          expiresIn:
            '8h'
        }
      );


    return res.json({
      message:
        'Login correcto',

      token,

      usuario:
        admin.usuario
    });

  } catch (error) {

    console.error(
      'Error en login:',
      error
    );


    return res.status(500).json({
      message:
        'Error interno del servidor'
    });

  }

};


module.exports = {
  login
};