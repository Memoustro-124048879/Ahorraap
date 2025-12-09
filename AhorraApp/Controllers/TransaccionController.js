import { TransaccionModel } from '../Models/TransaccionModel';
import { PresupuestoController } from './PresupuestoController';

export const TransaccionController = {
    agregarTransaccion: async (usuarioId, monto, tipo, categoria, fecha, descripcion) => {
        if (!usuarioId || !monto || !tipo || !categoria || !fecha) {
            throw new Error('Todos los campos son obligatorios');
        }

        const montoNum = parseFloat(monto);

        // Verificar presupuesto si es un gasto (BLOQUEO ESTRICTO)
        if (tipo === 'gasto') {
            const mes = fecha.substring(0, 7); // YYYY-MM
            const errorPresupuesto = await PresupuestoController.verificarPresupuesto(usuarioId, categoria, mes, montoNum);

            if (errorPresupuesto) {
                // Si hay error (mensaje), lanzamos excepción para detener la creación
                throw new Error(errorPresupuesto);
            }
        }

        const id = await TransaccionModel.crear(usuarioId, montoNum, tipo, categoria, fecha, descripcion);

        return { id, alerta: null };
    },

    obtenerTransacciones: async (usuarioId) => {
        return await TransaccionModel.obtenerTodasPorUsuario(usuarioId);
    },

    editarTransaccion: async (id, monto, tipo, categoria, fecha, descripcion) => {
        if (!id || !monto || !tipo || !categoria || !fecha) {
            throw new Error('Todos los campos son obligatorios');
        }
        return await TransaccionModel.actualizar(id, parseFloat(monto), tipo, categoria, fecha, descripcion);
    },

    eliminarTransaccion: async (id) => {
        return await TransaccionModel.eliminar(id);
    },

    filtrarTransacciones: async (usuarioId, categoria, fecha) => {
        return await TransaccionModel.filtrar(usuarioId, categoria, fecha);
    },

    obtenerResumenFinanciero: async (usuarioId) => {
        return await TransaccionModel.obtenerBalance(usuarioId);
    },

    obtenerGastosCategoria: async (usuarioId, mes) => {
        return await TransaccionModel.obtenerGastosPorCategoria(usuarioId, mes);
    },

    obtenerHistorialMensual: async (usuarioId) => {
        return await TransaccionModel.obtenerBalanceMensual(usuarioId);
    }
};
