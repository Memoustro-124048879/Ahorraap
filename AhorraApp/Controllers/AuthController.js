import { UsuarioModel } from '../Models/UsuarioModel';

// --- CONTROLADOR: AuthController ---
// Los Controladores son los "Gerentes". Ellos toman las decisiones importantes.
// No guardan datos (eso lo hace el Modelo) y no dibujan pantallas (eso lo hacen las Screens).
// Ellos reciben la orden del usuario (ej. "Quiero registrarme"), verifican las reglas,
// y si todo está bien, mandan al Modelo a guardar.
export const AuthController = {

    // 1. REGISTRAR UN NUEVO USUARIO
    registrar: async (email, password, nombre, telefono) => {
        // Regla 1: Todo es obligatorio (menos el teléfono que aquí no validamos estricto).
        if (!email || !password || !nombre) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Regla 2: No puede haber dos usuarios con el mismo correo.
        const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Si pasamos las reglas, le decimos al Modelo que cree el usuario.
        const usuarioId = await UsuarioModel.crear(email, password, nombre, telefono);

        // Devolvemos los datos del nuevo usuario para que la App sepa quién es.
        return { id: usuarioId, email, nombre, telefono };
    },

    // 2. INICIAR SESIÓN (LOGIN)
    login: async (email, password) => {
        // Regla 1: Necesitamos ambos datos.
        if (!email || !password) {
            throw new Error('Correo y contraseña son obligatorios');
        }

        // Buscamos si el usuario existe.
        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Verificamos si la contraseña coincide.
        // NOTA: En una app real de producción, la contraseña estaría encriptada (no se vería texto plano).
        if (usuario.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        // ¡Login exitoso! Devolvemos al usuario.
        return usuario;
    },

    // 3. RECUPERAR CONTRASEÑA
    recuperarPassword: async (email) => {
        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('No existe una cuenta con este correo');
        }

        // En una app real, aquí conectaríamos con un servicio de Email para enviar un link.
        // Como es un proyecto local/demo, solo simulamos que salió bien devolviendo 'true'.
        return true;
    }
};
