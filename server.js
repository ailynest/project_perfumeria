const express = require('express');
const cors = require('cors');

const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); //carpeta con los archivo

//LOGIN COOKIES poner las dependencias
const session = require ('express-session')  //login cookies
const SQLiteStore = require('connect-sqlite3')(session);


app.use (session({
  store: new SQLiteStore({ db: 'sessions.db' }), // Almacena sesiones en SQLite
  secret: 'XASDWERTY', //PONER UNA CLAVE SEGURA
  resave: false,
  saveUninitialized: false,
  cookies: {
    secure: false,
    maxAge: 24 * 60 * 60 *1000,  //1 dia de duración
  }
}));

//Leer el JSON (endpoint)
app.get('/api/perfumes', (req, res) =>{
    //console.log("Mostrar el listado de perfumes");
    fs.readFile('data/perfumes.json', 'utf-8', (err, data) =>{
        if (err) return res.status(500).send('Error leyendo el archivo');
        res.send(JSON.parse(data));  //envio todos los datos
    });
});

//Variables de entorno como un APIKey o configuraciones sensibles un archivo .env
require('dotenv').config();
const port = process.env.PORT || 4000;

// Subir imagenes
const multer = require('multer');
const path = require('path');

// Define la ruta completa a la carpeta 'uploads'
const uploadDir = path.join(__dirname, 'uploads');

// Necesito trabajar con ficheros
//origin//const fs = require('fs');
const bodyParser = require('body-parser');

// Verifica si la carpeta existe y créala si no está presente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));


// Configurar carpeta de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que esta ruta sea válida, ruta donde se guardan las imagenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
  }
});

// Middleware de Multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF.'));
  }
});

//Formulario con photo
// Usamos una base de datos
const db = require('./database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Ruta para subir alumno (multipart/form-data)
app.post('/upload', upload.single('photo'), (req, res) => {
console.log(req.file);  // Añadir esto para verificar qué datos se reciben
const { nombre, apellido, usuario, email, pass } = req.body;
try {
  // Verificar si el usuario ya existe
  db.get('SELECT * FROM usuarios WHERE usuario = ? OR email = ?', [usuario, email], async (err, row) => {
    if (err) throw err;

    if (row) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }
  
    if (!req.file) {
      return res.status(400).send('No se ha subido ninguna foto.');
    }

    // Hash de la contraseña
    console.log(pass);
    const hashedPass = await bcrypt.hash(pass, saltRounds);
    console.log(hashedPass);
    // Crea un nuevo usuario
    const newUser = {
      id: Date.now(),
      nombre,
      apellido,
      usuario,
      email, 
      pass,
      hashedPass,
      photo: `/uploads/${req.file.filename}`,
    };
    // Verificar que los campos no estén vacíos
    if (!nombre || !apellido || !usuario || !email || !pass) {
      return res.status(400).send('Todos los campos son requeridos.');
    }
    // Guarda la información en un archivo JSON
    const filePath = './data/usuarios.json';
    const usuarios = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    usuarios.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));

  //Guarda la información en la tabla de la BD: usuarios
    db.run(`INSERT INTO usuarios (nombre, apellido, usuario, pass, email, photo) VALUES (?, ?, ?, ?, ?, ?)`,
    [newUser.nombre, newUser.apellido, newUser.usuario, newUser.hashedPass, newUser.email, newUser.photo], function(err) {
    // ["nombre", "apellido", "usuario", "pass", "email", "photo"], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
    });
    
    //base de datos//
    //res.status(200).send('Usuario añadido correctamente.');
    //res.status(404).json({ error: 'Usuario añadido correctamente.' });
  });
  }catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Servir archivos subidos
app.use('/uploads', express.static('uploads'));

// Leer el JSON
app.get('/api/usuarios', (req, res) => {
  fs.readFile('data/usuarios.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo el archivo');
    res.send(JSON.parse(data));
  });
});

// Detail del usuario en el json
app.get('/api/detail', (req, res) => {
    fs.readFile('data/usuarios.json', 'utf-8', (err, data) => {
      if (err) return res.status(500).send('Error leyendo el archivo');
      res.send(JSON.parse(data));
    });
});

// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});


///CODIGO DE LOGIN*********************************************************************************
//Login de usuario
app.post('/api/login', async (req, res) => {
  const { username, contraseña } = req.body;
  // Buscar usuario► usuario= ? OR email = ?', [username, email],
  db.get('SELECT * FROM usuarios WHERE usuario= ? OR email = ?', [username, username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Comparar contraseñas
    const match = await bcrypt.compare(contraseña, user.pass);                        //-user.variable- definida por la función async (err, user)
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
    // Login exitoso (aquí podrías añadir sesiones o JWT)
    db.get('UPDATE usuarios SET last_login_date = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Guardar el usuario en la sesión
    req.session.user = {
      id: user.id,
      user: user.usuario,
      email: user.email       
    };
    
    res.status(200).json({ success: true });
  });
});

app.post('/api/logout', (req, res) =>{
  req.session.destroy((err) => {
    if(err) res.status(500).json({ error: 'Error al cerrar sesión'});
    else res.clearCookie('connect.sid').json({ success:true});
  });
});


// Saber quien es el usuario que se ha logueado ENDPOINT 
// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/perfil', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
