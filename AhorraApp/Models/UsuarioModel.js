import { Platform } from 'react-native';
import db from '../Database/Database';

// Helper para manejar persistencia en Web usando localStorage
// Esto permite que la app funcione en el navegador simulando la base de datos
const webQuery = {
    getData() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return { usuarios: [], transacciones: [], presupuestos: [] };
        }

        try {
            const data = window.localStorage.getItem('lana_app_data');
            // Si existen datos previos los cargamos, si no, inicializamos vacío
            return data ? JSON.parse(data) : { usuarios: [], transacciones: [], presupuestos: [] };
        } catch {
            return { usuarios: [], transacciones: [], presupuestos: [] };
        }
    },

    setData(data) {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('lana_app_data', JSON.stringify(data));
        }
    }
};

// Modelo de Usuario: Gestiona todas las operaciones de datos relacionadas con usuarios
export const UsuarioModel = {

    // Crea un nuevo registro de usuario en la base de datos
    crear: async (email, password, nombre, telefono) => {
        try {
            // Lógica específica para WEB
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const id = data.usuarios.length + 1;
                // Agregamos el nuevo usuario al array en memoria
                data.usuarios.push({ id, email, password, nombre, telefono, foto_perfil: null });
                webQuery.setData(data); // Guardamos en localStorage
                return id;
            } else {
                // Lógica específica para CELULAR (SQLite)
                const result = await db.runAsync(
                    'INSERT INTO usuarios (email, password, nombre, telefono) VALUES (?, ?, ?, ?)',
                    [email, password, nombre, telefono]
                );
                return result.lastInsertRowId;
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },

    // Busca un usuario por su correo electrónico (útil para Login)
    buscarPorEmail: async (email) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const usuario = data.usuarios.find(u => u.email === email);
                return usuario || null;
            } else {
                const rows = await db.getAllAsync(
                    'SELECT * FROM usuarios WHERE email = ?',
                    [email]
                );
                return rows.length > 0 ? rows[0] : null;
            }
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    },

    // Busca un usuario por su ID único
    buscarPorId: async (id) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const usuario = data.usuarios.find(u => u.id === id);
                return usuario || null;
            } else {
                const rows = await db.getAllAsync(
                    'SELECT * FROM usuarios WHERE id = ?',
                    [id]
                );
                return rows.length > 0 ? rows[0] : null;
            }
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    },

    // Actualiza la información básica del perfil
    actualizarPerfil: async (id, nombre, email, telefono) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const index = data.usuarios.findIndex(u => u.id === id);
                if (index !== -1) {
                    data.usuarios[index].nombre = nombre;
                    data.usuarios[index].email = email;
                    data.usuarios[index].telefono = telefono;
                    webQuery.setData(data);
                    return data.usuarios[index];
                }
                throw new Error('Usuario no encontrado');
            } else {
                await db.runAsync(
                    'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
                    [nombre, email, telefono, id]
                );
                return { id, nombre, email, telefono };
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    },

    // Actualiza la contraseña del usuario
    actualizarPassword: async (id, newPassword) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const index = data.usuarios.findIndex(u => u.id === id);
                if (index !== -1) {
                    data.usuarios[index].password = newPassword;
                    webQuery.setData(data);
                    return true;
                }
                throw new Error('Usuario no encontrado');
            } else {
                await db.runAsync(
                    'UPDATE usuarios SET password = ? WHERE id = ?',
                    [newPassword, id]
                );
                return true;
            }
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw error;
        }
    },

    // Actualiza la foto de perfil (guarda la URI de la imagen)
    actualizarFoto: async (id, fotoUri) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const index = data.usuarios.findIndex(u => u.id === id);
                if (index !== -1) {
                    data.usuarios[index].foto_perfil = fotoUri;
                    webQuery.setData(data);
                    return fotoUri;
                }
                throw new Error('Usuario no encontrado');
            } else {
                await db.runAsync(
                    'UPDATE usuarios SET foto_perfil = ? WHERE id = ?',
                    [fotoUri, id]
                );
                return fotoUri;
            }
        } catch (error) {
            console.error('Error al actualizar foto:', error);
            throw error;
        }
    }
};
