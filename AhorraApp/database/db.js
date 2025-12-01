// database/db.js
import * as SQLite from 'expo-sqlite';

// Función para obtener la conexión a la base de datos
export const getDB = async () => {
  const db = await SQLite.openDatabaseAsync('ahorrapp.db');
  return db;
};

// Función para inicializar las tablas
export const initDB = async () => {
  const db = await getDB();
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        monto REAL,
        tipo TEXT,
        fecha TEXT,
        categoria TEXT,
        descripcion TEXT
      );
    `);
    console.log('Tabla transacciones lista (Modo Async) ✅');
  } catch (error) {
    console.log('Error inicializando DB:', error);
  }
};