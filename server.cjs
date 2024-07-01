const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const vision = require('@google-cloud/vision');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { promisify } = require('util'); // Para utilizar promisify

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'beelbonacossa@gmail.com',
    pass: 'wpvd qccu zdxm pnin'
  }
});

const app = express();
app.use(express.json());

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fotocopier',
  port: 3307
});

// Conexión a MySQL con soporte de promesas
const { createPool } = require('mysql2/promise');
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fotocopier',
  connectionLimit: 10,
  port: 3307
});

(async () => {
  try {
    await pool.getConnection();
    console.log('Conectado a MySQL correctamente');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
})();

// Middleware para configurar headers COOP y COEP
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Middleware de CORS para permitir solicitudes desde el frontend
app.use(cors());

// Configuración de Multer para manejar archivos PDF
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración del cliente de Vision API
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'path/to/your/service-account-file.json', // Reemplaza con la ruta a tu archivo de clave JSON
});

// Endpoint para registrar usuarios
app.post('/register', async (req, res) => {
  try {
    const { email, password, name, lastname, commission, legajo } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const sql = `INSERT INTO users (email, password, name, lastname, commission, legajo) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.query(sql, [email, hashedPassword, name, lastname, commission, legajo]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email en la base de datos
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [results] = await pool.query(sql, [email]);

    if (results.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    const user = results[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Endpoint para obtener datos de usuario
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  // Obtener datos del usuario desde la base de datos
  const sql = `SELECT id, email, name, lastname, commission, legajo FROM users WHERE id = ?`;
  const [results] = await pool.query(sql, [userId]);

  if (results.length === 0) {
    return res.status(400).json({ error: 'Usuario no encontrado' });
  }
  const user = results[0];
  res.json(user);
});


app.post('/impresora', async (req, res) => {
  try {
    const { nombre, marca, modelo, color } = req.body;

    // Insertar impresora en la base de datos
    const sql = `INSERT INTO impresoras (nombre, marca, modelo, color) VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [nombre, marca, modelo, color]);

    res.status(201).json({ message: 'Impresora guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar impresora:', error);
    res.status(500).json({ error: 'Error al guardar impresora' });
  }
});

// Endpoint para guardar una fotocopiadora
app.post('/fotocopiadora', async (req, res) => {
  try {
    const { nombre, marca, modelo, color } = req.body;

    // Insertar fotocopiadora en la base de datos
    const sql = `INSERT INTO fotocopiadoras (nombre, marca, modelo, color) VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [nombre, marca, modelo, color]);

    res.status(201).json({ message: 'Fotocopiadora guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar fotocopiadora:', error);
    res.status(500).json({ error: 'Error al guardar fotocopiadora' });
  }
});








// Endpoint para crear un pedido con archivo PDF y enviar correos
app.post('/pedidos', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, comision, legajo, implementacionIA, color, dobleFaz, anillado, cotizacion, emailCliente } = req.body;
    const archivo = req.file;

    // Cargar el archivo PDF y contar las hojas localmente
    const pdfDoc = await PDFDocument.load(archivo.buffer);
    const totalPages = pdfDoc.getPageCount();

    // Insertar pedido en la base de datos
    const sql = `INSERT INTO pedidos (nombre, comision, legajo, nombreArchivo, cantidadHojas, implementacionIA, color, dobleFaz, anillado, cotizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [nombre, comision, legajo, archivo.originalname, totalPages, implementacionIA, color, dobleFaz, anillado, cotizacion]);

    const nuevoPedido = {
      id: result.insertId,
      nombre,
      comision,
      legajo,
      nombreArchivo: archivo.originalname,
      cantidadHojas: totalPages,
      implementacionIA,
      color,
      dobleFaz,
      anillado,
      cotizacion,
    };

    // Enviar email al cliente
    const mailOptionsCliente = {
      from: 'beelbonacossa@gmail.com',
      to: emailCliente,
      subject: 'Pedido Aceptado!',
      text: 'Su pedido ha sido aceptado. Detalles del pedido: ' + JSON.stringify(nuevoPedido)
    };

    transporter.sendMail(mailOptionsCliente, async (error, info) => {
      if (error) {
        console.error('Error al enviar email al cliente:', error);
      } else {
        console.log('Email enviado al cliente: ' + info.response);

        // Guardar en tabla emailcliente
        const sqlEmailCliente = `INSERT INTO emailcliente (pedido_id, email) VALUES (?, ?)`;
        await pool.query(sqlEmailCliente, [nuevoPedido.id, emailCliente]);
      }
    });

    // Enviar email al administrador (ejemplo, cambiar con tu dirección de email administrativo)
    const mailOptionsAdmin = {
      from: 'beelbonacossa@gmail.com',
      to: 'beelbonacossa@hotmail.com',
      subject: 'Nuevo Pedido Realizado',
      text: 'Se ha realizado un nuevo pedido. Detalles del pedido: ' + JSON.stringify(nuevoPedido)
    };

    transporter.sendMail(mailOptionsAdmin, async (error, info) => {
      if (error) {
        console.error('Error al enviar email al administrador:', error);
      } else {
        console.log('Email enviado al administrador: ' + info.response);

        // Guardar en tabla emailadmin
        const sqlEmailAdmin = `INSERT INTO emailadmin (pedido_id, email) VALUES (?, ?)`;
        await pool.query(sqlEmailAdmin, [nuevoPedido.id, 'beelbonacossa@hotmail.com']);
      }
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
