import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db = null;

if (Platform.OS === 'web') {
  // En web, creamos un wrapper que simula SQLite usando localStorage del navegador
  const webDB = {
    async runAsync(query, params = []) {
      console.log('Web DB - Running:', query, params);

      // Para INSERT, generar un ID
      if (query.includes('INSERT')) {
        return { lastInsertRowId: Date.now() };
      }
      return {};
    },

    async getAllAsync(query, params = []) {
      console.log('Web DB - Getting all:', query, params);

      // Verificar que estamos en el navegador
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage no disponible');
        return [];
      }

      try {
        const data = window.localStorage.getItem('lana_app_data');
        if (!data) return [];

        const parsed = JSON.parse(data);

        // Retornar datos según el tipo de query
        if (query.includes('usuarios')) {
          return parsed.usuarios || [];
        } else if (query.includes('transacciones')) {
          return parsed.transacciones || [];
        } else if (query.includes('presupuestos')) {
          return parsed.presupuestos || [];
        }
        return [];
      } catch (error) {
        console.error('Error parsing web storage:', error);
        return [];
      }
    },

    async execAsync(sql) {
      console.log('Web DB - Executing:', sql);

      // Verificar que estamos en el navegador
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage no disponible');
        return;
      }

      // Inicializar estructura de datos en web
      const data = window.localStorage.getItem('lana_app_data');
      if (!data) {
        window.localStorage.setItem('lana_app_data', JSON.stringify({
          usuarios: [],
          transacciones: [],
          presupuestos: []
        }));
      }
    }
  };

  db = webDB;
} else {
  // En móvil, usamos SQLite normal
  try {
    db = SQLite.openDatabaseSync('lana_app.db');
  } catch (error) {
    console.error('Error abriendo base de datos SQLite:', error);
  }
}

export const initDatabase = async () => {
  try {
    if (Platform.OS === 'web') {
      // Inicializar almacenamiento web
      if (db && db.execAsync) {
        await db.execAsync('INIT');
      }
      console.log('Base de datos web inicializada correctamente');
    } else {
      // Inicializar SQLite en móvil
      if (db && db.execAsync) {
        await db.execAsync(`
          PRAGMA foreign_keys = ON;
          
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nombre TEXT,
            telefono TEXT,
            foto_perfil TEXT
          );

          CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            monto REAL NOT NULL,
            tipo TEXT NOT NULL DEFAULT 'gasto',
            categoria TEXT NOT NULL,
            fecha TEXT NOT NULL,
            descripcion TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
          );

          CREATE TABLE IF NOT EXISTS presupuestos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            monto REAL NOT NULL,
            categoria TEXT NOT NULL,
            mes TEXT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
          );
        `);

        // Migraciones: Intentar añadir columnas si la tabla ya existía sin ellas
        try {
          await db.execAsync('ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;');
        } catch (e) { /* Ignorar si ya existe */ }

        try {
          await db.execAsync('ALTER TABLE usuarios ADD COLUMN telefono TEXT;');
        } catch (e) { /* Ignorar si ya existe */ }

        console.log('Base de datos SQLite inicializada correctamente');
      } else {
        console.error('DB no está disponible');
      }
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

export default db;
