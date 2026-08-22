const pool = require('../config/database');

const obtenerProductos = async (req, res) => {
  try {

    const [rows] = await pool.query(
      `
      SELECT
        id,
        nombre,
        categoria,
        precio,
        disponible
      FROM productos
      ORDER BY categoria, id
      `
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener productos'
    });

  }
};


const actualizarDisponibilidad = async (req, res) => {
  try {

    const { id } = req.params;
    const { disponible } = req.body;

    if (typeof disponible !== 'boolean') {
      return res.status(400).json({
        message: 'El campo disponible debe ser boolean'
      });
    }

    const [result] = await pool.query(
      `
      UPDATE productos
      SET disponible = ?
      WHERE id = ?
      `,
      [
        disponible,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.json({
      message: 'Disponibilidad actualizada',
      id: Number(id),
      disponible
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar producto'
    });

  }
};


module.exports = {
  obtenerProductos,
  actualizarDisponibilidad
};