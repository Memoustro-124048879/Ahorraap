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

    // Nuevo: Obtiene presupuestos con el cálculo de cuánto se ha gastado
    obtenerPresupuestosConProgreso: async (usuarioId) => {
        const presupuestos = await PresupuestoModel.obtenerTodosPorUsuario(usuarioId);

        // Para cada presupuesto, calculamos lo gastado
        const resultados = await Promise.all(presupuestos.map(async (p) => {
            const transacciones = await TransaccionModel.filtrar(usuarioId, p.categoria, p.mes);
            const totalGastado = transacciones.reduce((sum, t) => sum + (t.tipo === 'gasto' ? t.monto : 0), 0);

            return {
                ...p,
                gastado: totalGastado,
                restante: p.monto - totalGastado
            };
        }));

        return resultados;
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

        if (!presupuesto) return { excedido: false };

        // Obtener gastos actuales de esa categoría en el mes
        const transacciones = await TransaccionModel.filtrar(usuarioId, categoria, mes);
        const totalGastado = transacciones.reduce((sum, t) => sum + (t.tipo === 'gasto' ? t.monto : 0), 0);

        const nuevoTotal = totalGastado + montoNuevaTransaccion;
        const restanteActual = presupuesto.monto - totalGastado;

        if (nuevoTotal > presupuesto.monto) {
            return {
                excedido: true,
                presupuesto: presupuesto.monto,
                gastado: totalGastado,
                restante: restanteActual,
                diferencia: nuevoTotal - presupuesto.monto,
                nuevoTotal: nuevoTotal,
                mensaje: `El presupuesto para ${categoria} es de $${presupuesto.monto}. Te quedan $${restanteActual}. Esta transacción te dejaría en -$${(nuevoTotal - presupuesto.monto).toFixed(2)}.`
            };
        }

        return { excedido: false };
    }
};
