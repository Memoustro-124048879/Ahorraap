// database/db.js
import * as SQLite from "expo-sqlite";

let db = null;

// Inicializar la BD y crear tablas
export const initDB = async () => {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync("ahorraapp.db");
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS presupuestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL,
        monto REAL NOT NULL
      );

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

    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.log("Error inicializando tablas:", error);
  }
};

// Retornar la conexión (para las pantallas)
export const getDB = () => {
  if (!db) db = SQLite.openDatabaseSync("ahorraapp.db");
  return db;
};
