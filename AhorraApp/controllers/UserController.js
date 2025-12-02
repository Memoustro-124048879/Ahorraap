import { getDB } from '../database/db';

// 1. CREAR USUARIO ADMIN POR DEFECTO (SEEDER)
export const inicializarAdmin = async () => {
  const db = await getDB();
  try {
    // Verificamos si ya existe el admin
    const usuario = await db.getFirstAsync("SELECT * FROM usuarios WHERE email = ?", ['tony@ahorraapp.com']);
    
    if (!usuario) {
      await db.runAsync(
        "INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)",
        ['Tony Developer', 'tony@ahorraapp.com', '12345', '+52 55 1234 5678']
      );
      console.log("Usuario Admin (Tony) creado exitosamente 👤");
    }
  } catch (error) {
    console.log("Error creando admin:", error);
  }
};

// 2. LOGIN (Validar credenciales)
export const loginUsuario = async (email, password) => {
  const db = await getDB();
  try {
    const usuario = await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?",
      [email, password]
    );
    return usuario; // Devuelve el usuario si existe, o null si no
  } catch (error) {
    console.log("Error en login:", error);
    return null;
  }
};

// 3. REGISTRO (Para la pantalla de registro)
export const registrarUsuario = async (datos, callback) => {
  const db = await getDB();
  const { nombre, email, password, telefono } = datos;
  try {
    await db.runAsync(
      "INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)",
      [nombre, email, password, telefono]
    );
    if (callback) callback(true);
  } catch (error) {
    console.log("Error registrando:", error);
    if (callback) callback(false);
  }
};