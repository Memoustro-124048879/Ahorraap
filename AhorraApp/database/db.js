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
      
      -- ⚠️ ESTA LÍNEA BORRA LA TABLA VIEJA PARA ACTUALIZARLA
      DROP TABLE IF EXISTS presupuestos; 
      
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        password TEXT,
        telefono TEXT
      );

      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        titulo TEXT,
        monto REAL,
        tipo TEXT,
        fecha TEXT,
        categoria TEXT,
        descripcion TEXT,
        FOREIGN KEY(user_id) REFERENCES usuarios(id)
      );

      -- TABLA ACTUALIZADA CON FECHA
      CREATE TABLE IF NOT EXISTS presupuestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        categoria TEXT,
        monto REAL,
        fecha TEXT, -- <--- NUEVO CAMPO
        FOREIGN KEY(user_id) REFERENCES usuarios(id)
      );
    `);
    console.log('Base de Datos Actualizada (Presupuestos con Fecha) ✅');
  } catch (error) {
    console.log('Error inicializando DB:', error);
  }
};