const pool = require('../config/database');

const obtenerNegocio = async (req, res) => {
  try {

    const [rows] = await pool.query(
      'SELECT * FROM negocio LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'No se encontró la configuración del negocio'
      });
    }

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener el estado del negocio'
    });

  }
};


const actualizarEstadoNegocio = async (req, res) => {
  try {

    const { abierto } = req.body;

    if (typeof abierto !== 'boolean') {
      return res.status(400).json({
        message: 'El campo abierto debe ser boolean'
      });
    }

    const [result] = await pool.query(
      `
      UPDATE negocio
      SET abierto = ?
      WHERE id = 1
      `,
      [abierto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Negocio no encontrado'
      });
    }

    res.json({
      message: 'Estado actualizado correctamente',
      abierto
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar el estado'
    });

  }
};


module.exports = {
  obtenerNegocio,
  actualizarEstadoNegocio
};