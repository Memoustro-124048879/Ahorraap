import * as SQLite from 'expo-sqlite';

export const getDB = async () => {
  const db = await SQLite.openDatabaseAsync('ahorrapp.db');
  return db;
};

export const initDB = async () => {
  const db = await getDB();
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      -- Tabla Transacciones
      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        monto REAL,
        tipo TEXT,
        fecha TEXT,
        categoria TEXT,
        descripcion TEXT
      );

      -- Tabla Presupuestos
      CREATE TABLE IF NOT EXISTS presupuestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT,
        monto REAL
      );

      -- NUEVA TABLA: Usuarios
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        password TEXT,
        telefono TEXT
      );
    `);
    console.log('Tablas (incluida Usuarios) inicializadas ✅');
  } catch (error) {
    console.log('Error inicializando DB:', error);
  }
};