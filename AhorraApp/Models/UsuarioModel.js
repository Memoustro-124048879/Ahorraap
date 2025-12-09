import { Platform } from 'react-native';
import db from '../Database/Database';

// Helper para manejar queries en web (con verificación de window)
const webQuery = {
    getData() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return { usuarios: [], transacciones: [], presupuestos: [] };
        }

        try {
            const data = window.localStorage.getItem('lana_app_data');
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

export const UsuarioModel = {
    crear: async (email, password, nombre, telefono) => {
        try {
            if (Platform.OS === 'web') {
                const data = webQuery.getData();
                const id = data.usuarios.length + 1;
                data.usuarios.push({ id, email, password, nombre, telefono, foto_perfil: null });
                webQuery.setData(data);
                return id;
            } else {
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
                return { id, nombre, email, telefono }; // Retornar datos actualizados (parcialmente)
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    },

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
