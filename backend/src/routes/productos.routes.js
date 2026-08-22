const express = require('express');

const {
  obtenerProductos,
  actualizarDisponibilidad
} = require('../controllers/productos.controller');

const {
  verificarToken
} = require('../middleware/auth.middleware');

const router = express.Router();

router.get(
  '/',
  obtenerProductos
);

router.put(
  '/:id/disponibilidad',
  verificarToken,
  actualizarDisponibilidad
);

module.exports = router;