const sqlite = require ('sqlite3').verbose();
const db = new sqlite.Database ('informacion.db');

db.serialize(() => {
db.run (`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT,
    usuario TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pass TEXT NOT NULL,
    photo TEXT,
    created_date DEFAULT CURRENT_TIMESTAMP,
    last_login_date DEFAULT CURRENT_TIMESTAMP
)`);
});
//Creamos una tabla con la estructura de datos que queremos
module.exports = db;