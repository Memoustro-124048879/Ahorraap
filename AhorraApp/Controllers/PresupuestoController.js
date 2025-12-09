import { PresupuestoModel } from '../Models/PresupuestoModel';
import { TransaccionModel } from '../Models/TransaccionModel';

export const PresupuestoController = {
    crearPresupuesto: async (usuarioId, monto, categoria, mes) => {
        if (!monto || !categoria || !mes) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Verificar si ya existe un presupuesto para esa categoría y mes
        const existente = await PresupuestoModel.obtenerPorCategoriaYMes(usuarioId, categoria, mes);
        if (existente) {
            throw new Error('Ya existe un presupuesto para esta categoría en este mes');
        }

        return await PresupuestoModel.crear(usuarioId, parseFloat(monto), categoria, mes);
    },

    obtenerPresupuestos: async (usuarioId) => {
        return await PresupuestoModel.obtenerTodosPorUsuario(usuarioId);
    },

    editarPresupuesto: async (id, monto, categoria, mes) => {
        return await PresupuestoModel.actualizar(id, parseFloat(monto), categoria, mes);
    },

    filtrarPresupuestos: async (usuarioId, categoria, mes) => {
        return await PresupuestoModel.filtrar(usuarioId, categoria, mes);
    },

    eliminarPresupuesto: async (id) => {
        return await PresupuestoModel.eliminar(id);
    },

    verificarPresupuesto: async (usuarioId, categoria, mes, montoNuevaTransaccion) => {
        const presupuesto = await PresupuestoModel.obtenerPorCategoriaYMes(usuarioId, categoria, mes);

        if (!presupuesto) return null; // No hay presupuesto asignado, no se bloquea (o se asume infinito/0 según regla de negocio? Asumimos libre si no hay presupuesto definido)

        // Obtener gastos actuales de esa categoría en el mes
        const transacciones = await TransaccionModel.filtrar(usuarioId, categoria, mes);
        const totalGastado = transacciones.reduce((sum, t) => sum + (t.tipo === 'gasto' ? t.monto : 0), 0);

        if (totalGastado + montoNuevaTransaccion > presupuesto.monto) {
            return `El presupuesto para ${categoria} es de $${presupuesto.monto}. Llevas gastado $${totalGastado}. Esta transacción de $${montoNuevaTransaccion} excedería el límite.`;
        }

        return null; // Todo OK
    }
};
