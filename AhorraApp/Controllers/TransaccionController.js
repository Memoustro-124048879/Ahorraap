import { TransaccionModel } from '../Models/TransaccionModel';
import { PresupuestoController } from './PresupuestoController';

// Controlador para gestionar las operaciones de transacciones (ingresos y gastos)
export const TransaccionController = {

    // Crea una nueva transacción verificando antes el presupuesto si es un gasto
    agregarTransaccion: async (usuarioId, monto, tipo, categoria, fecha, descripcion, ignorarPresupuesto = false) => {
        if (!usuarioId || !monto || !tipo || !categoria || !fecha) {
            throw new Error('Todos los campos son obligatorios');
        }

        const montoNum = parseFloat(monto);

        // Bloqueo estricto de presupuesto para gastos (salvo que se confirme ignorar)
        if (tipo === 'gasto' && !ignorarPresupuesto) {
            const mes = fecha.substring(0, 7); // Formato YYYY-MM

            // Verificamos si la nueva transacción excedería el límite
            const resultado = await PresupuestoController.verificarPresupuesto(usuarioId, categoria, mes, montoNum);

            if (resultado.excedido) {
                // Lanzamos error especial para que la UI pregunte
                const error = new Error(resultado.mensaje);
                error.isBudgetWarning = true;
                error.budgetDetails = resultado;
                throw error;
            }
        }

        // Si pasa las validaciones, procedemos a crearla
        const id = await TransaccionModel.crear(usuarioId, montoNum, tipo, categoria, fecha, descripcion);

        return { id, alerta: null };
    },

    // Obtiene el listado completo de transacciones
    obtenerTransacciones: async (usuarioId) => {
        return await TransaccionModel.obtenerTodasPorUsuario(usuarioId);
    },

    // Actualiza los datos de una transacción existente
    editarTransaccion: async (id, monto, tipo, categoria, fecha, descripcion) => {
        if (!id || !monto || !tipo || !categoria || !fecha) {
            throw new Error('Todos los campos son obligatorios');
        }
        return await TransaccionModel.actualizar(id, parseFloat(monto), tipo, categoria, fecha, descripcion);
    },

    eliminarTransaccion: async (id) => {
        return await TransaccionModel.eliminar(id);
    },

    // Permite buscar transacciones por categoría o fecha
    filtrarTransacciones: async (usuarioId, categoria, fecha) => {
        return await TransaccionModel.filtrar(usuarioId, categoria, fecha);
    },

    // Calcula el balance total (Ingresos - Gastos) para el Dashboard
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
