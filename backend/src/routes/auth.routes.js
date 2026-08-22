const express = require('express');

const {
  rateLimit
} = require('express-rate-limit');

const {
  login
} = require('../controllers/auth.controller');

const router = express.Router();


const loginLimiter = rateLimit({

  windowMs:
    15 * 60 * 1000,

  limit: 5,

  standardHeaders: 'draft-8',

  legacyHeaders: false,

  message: {
    message:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.'
  }

});


router.post(
  '/login',
  loginLimiter,
  login
);


module.exports = router;