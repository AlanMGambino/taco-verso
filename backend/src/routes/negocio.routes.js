const express = require('express');

const {
  obtenerNegocio,
  actualizarEstadoNegocio
} = require('../controllers/negocio.controller');

const router = express.Router();

const {
  verificarToken
} =
  require('../middleware/auth.middleware');

router.get(
  '/',
  obtenerNegocio
);

router.put(
  '/estado',
  verificarToken,
  actualizarEstadoNegocio
);

module.exports = router;