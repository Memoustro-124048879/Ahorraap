import { Platform } from 'react-native';
import db from '../Database/Database';

console.log('[PresupuestoModel] Initializing...', { PlatformOS: Platform?.OS });

const isWeb = Platform?.OS === 'web';

// Helper para manejar queries en web
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

export const PresupuestoModel = {
    crear: async (usuarioId, monto, categoria, mes) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                const id = data.presupuestos.length + 1;
                data.presupuestos.push({ id, usuario_id: usuarioId, monto, categoria, mes });
                webQuery.setData(data);
                return id;
            } else {
                const result = await db.runAsync(
                    'INSERT INTO presupuestos (usuario_id, monto, categoria, mes) VALUES (?, ?, ?, ?)',
                    [usuarioId, monto, categoria, mes]
                );
                return result.lastInsertRowId;
            }
        } catch (error) {
            console.error('Error al crear presupuesto:', error);
            throw error;
        }
    },

    obtenerTodosPorUsuario: async (usuarioId) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                return data.presupuestos.filter(p => p.usuario_id === usuarioId);
            } else {
                const presupuestos = await db.getAllAsync(
                    'SELECT * FROM presupuestos WHERE usuario_id = ?',
                    [usuarioId]
                );
                return presupuestos;
            }
        } catch (error) {
            console.error('Error al obtener presupuestos:', error);
            throw error;
        }
    },

    actualizar: async (id, monto, categoria, mes) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                const index = data.presupuestos.findIndex(p => p.id === id);
                if (index !== -1) {
                    data.presupuestos[index] = { ...data.presupuestos[index], monto, categoria, mes };
                    webQuery.setData(data);
                }
            } else {
                await db.runAsync(
                    'UPDATE presupuestos SET monto = ?, categoria = ?, mes = ? WHERE id = ?',
                    [monto, categoria, mes, id]
                );
            }
        } catch (error) {
            console.error('Error al actualizar presupuesto:', error);
            throw error;
        }
    },

    eliminar: async (id) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                data.presupuestos = data.presupuestos.filter(p => p.id !== id);
                webQuery.setData(data);
            } else {
                await db.runAsync('DELETE FROM presupuestos WHERE id = ?', [id]);
            }
        } catch (error) {
            console.error('Error al eliminar presupuesto:', error);
            throw error;
        }
    },

    obtenerPorCategoriaYMes: async (usuarioId, categoria, mes) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                return data.presupuestos.find(
                    p => p.usuario_id === usuarioId && p.categoria === categoria && p.mes === mes
                ) || null;
            } else {
                const presupuesto = await db.getFirstAsync(
                    'SELECT * FROM presupuestos WHERE usuario_id = ? AND categoria = ? AND mes = ?',
                    [usuarioId, categoria, mes]
                );
                return presupuesto;
            }
        } catch (error) {
            console.error('Error al obtener presupuesto por categoría:', error);
            throw error;
        }
    },

    filtrar: async (usuarioId, categoria, mes) => {
        try {
            if (isWeb) {
                const data = webQuery.getData();
                let filtered = data.presupuestos.filter(p => p.usuario_id === usuarioId);

                if (categoria) {
                    filtered = filtered.filter(p => p.categoria.toLowerCase().includes(categoria.toLowerCase()));
                }
                if (mes) {
                    filtered = filtered.filter(p => p.mes.includes(mes));
                }
                return filtered;
            } else {
                let query = 'SELECT * FROM presupuestos WHERE usuario_id = ?';
                const params = [usuarioId];

                if (categoria) {
                    query += ' AND categoria LIKE ?';
                    params.push(`%${categoria}%`);
                }
                if (mes) {
                    query += ' AND mes LIKE ?';
                    params.push(`%${mes}%`);
                }

                const rows = await db.getAllAsync(query, params);
                return rows;
            }
        } catch (error) {
            console.error('Error al filtrar presupuestos:', error);
            throw error;
        }
    }
};
