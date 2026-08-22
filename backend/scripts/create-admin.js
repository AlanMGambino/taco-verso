require('dotenv').config();

const bcrypt = require('bcrypt');
const pool = require('../src/config/database');


async function crearAdmin() {

  try {

    const usuario =
      'tacoverso';

    const password =
      'T@c0vv3rS0o@';


    const saltRounds = 12;


    const passwordHash =
      await bcrypt.hash(
        password,
        saltRounds
      );


    await pool.query(
      `
      INSERT INTO usuarios_admin (
        usuario,
        password_hash,
        activo
      )
      VALUES (?, ?, TRUE)
      `,
      [
        usuario,
        passwordHash
      ]
    );


    console.log(
      '✅ Administrador creado correctamente'
    );

    process.exit(0);

  } catch (error) {

    console.error(
      '❌ Error creando administrador:'
    );

    console.error(
      error.message
    );

    process.exit(1);

  }

}


crearAdmin();