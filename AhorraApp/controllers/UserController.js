import { getDB } from '../database/db';
import * as Crypto from 'expo-crypto';

// Función para encriptar
const encriptarPassword = async (texto) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    texto
  );
  return digest;
};

// 1. CREAR ADMIN
export const inicializarAdmin = async () => {
  const db = await getDB();
  try {
    await db.runAsync("DELETE FROM usuarios WHERE email = ?", ['tony@ahorraapp.com']);
    const passEncriptada = await encriptarPassword('12345');
    await db.runAsync(
      "INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)",
      ['Tony Developer', 'tony@ahorraapp.com', passEncriptada, '4423188424']
    );
    console.log("Usuario Admin creado 🔒");
  } catch (error) {
    console.log("Error creando admin:", error);
  }
};

// 2. LOGIN
export const loginUsuario = async (email, password) => {
  const db = await getDB();
  try {
    const passEncriptada = await encriptarPassword(password);
    const usuario = await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?",
      [email, passEncriptada]
    );
    return usuario; 
  } catch (error) {
    console.log("Error en login:", error);
    return null;
  }
};

// 3. REGISTRO
export const registrarUsuario = async (datos, callback) => {
  const db = await getDB();
  const { nombre, email, password, telefono } = datos;
  try {
    const passEncriptada = await encriptarPassword(password);
    await db.runAsync(
      "INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)",
      [nombre, email, passEncriptada, telefono]
    );
    if (callback) callback(true);
  } catch (error) {
    console.log("Error registrando:", error);
    if (callback) callback(false);
  }
};


export const validarIdentidad = async (email, telefono) => {
  const db = await getDB();
  try {
    
    const usuario = await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE email = ? AND telefono = ?",
      [email, telefono]
    );
    return !!usuario; 
  } catch (error) {
    console.log("Error validando identidad:", error);
    return false;
  }
};

// 5. RESTABLECER CONTRASEÑA 
export const restablecerPassword = async (email, nuevaPassword, callback) => {
  const db = await getDB();
  try {
    const passEncriptada = await encriptarPassword(nuevaPassword);
    await db.runAsync(
      "UPDATE usuarios SET password = ? WHERE email = ?",
      [passEncriptada, email]
    );
    if (callback) callback(true);
  } catch (error) {
    console.log("Error restableciendo password:", error);
    if (callback) callback(false);
  }
};