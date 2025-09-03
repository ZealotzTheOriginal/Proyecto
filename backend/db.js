import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Abrimos la base de datos con soporte async/await
export const db = await open({
  filename: "./nexa.db",
  driver: sqlite3.Database,
});

// Activamos claves foráneas (por si en el futuro usas relaciones)
await db.exec(`PRAGMA foreign_keys = ON;`);

// Crear tablas si no existen
await db.exec(`
CREATE TABLE IF NOT EXISTS voluntarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT
);

CREATE TABLE IF NOT EXISTS donaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL CHECK (tipo IN ('economica', 'en_especie')),
  valor REAL DEFAULT 0,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS transportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehiculo TEXT NOT NULL,
  conductor TEXT,
  disponibilidad TEXT NOT NULL DEFAULT 'Disponible',
  lat REAL,
  lng REAL
);
`);
