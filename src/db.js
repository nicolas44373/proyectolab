// src/db.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuario de tu base de datos MySQL
  password: '', // Contraseña de tu base de datos MySQL
  database: 'fotocopier', // Nombre de tu base de datos MySQL
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL correctamente');
});

module.exports = connection;
