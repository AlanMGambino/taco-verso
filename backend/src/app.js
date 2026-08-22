require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./config/database');

const negocioRoutes =
  require('./routes/negocio.routes');

const productosRoutes =
  require('./routes/productos.routes');

const authRoutes =
  require('./routes/auth.routes');


const app = express();

const PORT =
  process.env.PORT || 3000;


/* =========================
   MIDDLEWARES
   SIEMPRE ANTES DE LAS RUTAS
   ========================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: [
      'GET',
      'POST',
      'PUT'
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);

app.use(
  express.json({
    limit: '20kb'
  })
);


/* =========================
   RUTAS
   ========================= */

app.get('/', (req, res) => {

  res.json({
    message:
      'API Taco-Verso funcionando 🌮'
  });

});


app.use(
  '/api/auth',
  authRoutes
);


app.use(
  '/api/negocio',
  negocioRoutes
);


app.use(
  '/api/productos',
  productosRoutes
);


/* =========================
   MYSQL
   ========================= */

async function probarConexion() {

  try {

    const connection =
      await pool.getConnection();

    console.log(
      '✅ Conexión a MySQL exitosa'
    );

    connection.release();

  } catch (error) {

    console.error(
      '❌ Error conectando a MySQL:',
      error.message
    );

  }

}


app.listen(
  PORT,
  '0.0.0.0',
  async () => {

    console.log(
      `🌮 Taco-Verso API ejecutándose en puerto ${PORT}`
    );

    await probarConexion();

  }
);