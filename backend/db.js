import sqlite3 from "sqlite3";
import { open } from "sqlite";

let dbInstance = null;

// Función para inicializar la base de datos
async function initializeDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    // En Vercel, usamos /tmp para archivos temporales
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/tmp/nexa.db' 
      : './nexa.db';

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Activamos claves foráneas
    await dbInstance.exec(`PRAGMA foreign_keys = ON;`);

    // Crear tablas si no existen
    await dbInstance.exec(`
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

    // Insertar datos de ejemplo si las tablas están vacías
    const voluntariosCount = await dbInstance.get("SELECT COUNT(*) as count FROM voluntarios");
    if (voluntariosCount.count === 0) {
      await dbInstance.exec(`
        INSERT INTO voluntarios (nombre, email, telefono) VALUES 
        ('Juan Pérez', 'juan@example.com', '123456789'),
        ('María García', 'maria@example.com', '987654321');
      `);
    }

    const donacionesCount = await dbInstance.get("SELECT COUNT(*) as count FROM donaciones");
    if (donacionesCount.count === 0) {
      await dbInstance.exec(`
        INSERT INTO donaciones (tipo, valor, descripcion) VALUES 
        ('economica', 100.50, 'Donación económica'),
        ('en_especie', 0, 'Ropa y alimentos');
      `);
    }

    const transportesCount = await dbInstance.get("SELECT COUNT(*) as count FROM transportes");
    if (transportesCount.count === 0) {
      await dbInstance.exec(`
        INSERT INTO transportes (vehiculo, conductor, disponibilidad, lat, lng) VALUES 
        ('Furgoneta A', 'Carlos López', 'Disponible', 40.4168, -3.7038),
        ('Camión B', 'Ana Martín', 'Ocupado', 40.4200, -3.7100);
      `);
    }

    return dbInstance;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Exportar función para obtener la instancia de la base de datos
export async function getDb() {
  return await initializeDatabase();
}

// Para compatibilidad con el código existente
export const db = {
  async all(sql, params = []) {
    const database = await getDb();
    return await database.all(sql, params);
  },
  async get(sql, params = []) {
    const database = await getDb();
    return await database.get(sql, params);
  },
  async run(sql, params = []) {
    const database = await getDb();
    return await database.run(sql, params);
  },
  async exec(sql) {
    const database = await getDb();
    return await database.exec(sql);
  }
};
