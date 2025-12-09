import { UsuarioModel } from '../Models/UsuarioModel';

export const AuthController = {
    registrar: async (email, password, nombre, telefono) => {
        if (!email || !password || !nombre) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Crear usuario
        const usuarioId = await UsuarioModel.crear(email, password, nombre, telefono);
        return { id: usuarioId, email, nombre, telefono };
    },

    login: async (email, password) => {
        if (!email || !password) {
            throw new Error('Correo y contraseña son obligatorios');
        }

        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        if (usuario.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        return usuario;
    },

    recuperarPassword: async (email) => {
        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('No existe una cuenta con este correo');
        }

        // En una app real, aquí se enviaría un correo.
        // Para este proyecto local, simularemos el cambio o retornaremos éxito.
        return true;
    }
};
