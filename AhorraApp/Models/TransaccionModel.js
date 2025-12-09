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

export const TransaccionModel = {
  crear: async (usuarioId, monto, tipo, categoria, fecha, descripcion) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        const id = data.transacciones.length + 1;
        data.transacciones.push({ id, usuario_id: usuarioId, monto, tipo, categoria, fecha, descripcion });
        webQuery.setData(data);
        return id;
      } else {
        const result = await db.runAsync(
          'INSERT INTO transacciones (usuario_id, monto, tipo, categoria, fecha, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
          [usuarioId, monto, tipo, categoria, fecha, descripcion]
        );
        return result.lastInsertRowId;
      }
    } catch (error) {
      console.error('Error al crear transacción:', error);
      throw error;
    }
  },

  obtenerTodasPorUsuario: async (usuarioId) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        return data.transacciones
          .filter(t => t.usuario_id === usuarioId)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      } else {
        const rows = await db.getAllAsync(
          'SELECT * FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC',
          [usuarioId]
        );
        return rows;
      }
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      throw error;
    }
  },

  actualizar: async (id, monto, tipo, categoria, fecha, descripcion) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        const index = data.transacciones.findIndex(t => t.id === id);
        if (index !== -1) {
          data.transacciones[index] = { ...data.transacciones[index], monto, tipo, categoria, fecha, descripcion };
          webQuery.setData(data);
        }
      } else {
        await db.runAsync(
          'UPDATE transacciones SET monto = ?, tipo = ?, categoria = ?, fecha = ?, descripcion = ? WHERE id = ?',
          [monto, tipo, categoria, fecha, descripcion, id]
        );
      }
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        data.transacciones = data.transacciones.filter(t => t.id !== id);
        webQuery.setData(data);
      } else {
        await db.runAsync('DELETE FROM transacciones WHERE id = ?', [id]);
      }
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      throw error;
    }
  },

  filtrar: async (usuarioId, categoria, fecha) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        let filtered = data.transacciones.filter(t => t.usuario_id === usuarioId);

        if (categoria) {
          filtered = filtered.filter(t => t.categoria.toLowerCase().includes(categoria.toLowerCase()));
        }
        if (fecha) {
          filtered = filtered.filter(t => t.fecha.includes(fecha));
        }

        return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      } else {
        let query = 'SELECT * FROM transacciones WHERE usuario_id = ?';
        const params = [usuarioId];

        if (categoria) {
          query += ' AND categoria LIKE ?';
          params.push(`%${categoria}%`);
        }

        if (fecha) {
          query += ' AND fecha LIKE ?';
          params.push(`%${fecha}%`);
        }

        query += ' ORDER BY fecha DESC';

        const rows = await db.getAllAsync(query, params);
        return rows;
      }
    } catch (error) {
      console.error('Error al filtrar transacciones:', error);
      throw error;
    }
  },

  obtenerBalance: async (usuarioId) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        const transacciones = data.transacciones.filter(t => t.usuario_id === usuarioId);

        let ingresos = 0;
        let gastos = 0;

        transacciones.forEach(t => {
          if (t.tipo === 'ingreso') ingresos += parseFloat(t.monto);
          if (t.tipo === 'gasto') gastos += parseFloat(t.monto);
        });

        return { ingresos, gastos, total: ingresos - gastos };
      } else {
        const rows = await db.getAllAsync(
          'SELECT tipo, SUM(monto) as total FROM transacciones WHERE usuario_id = ? GROUP BY tipo',
          [usuarioId]
        );

        let ingresos = 0;
        let gastos = 0;

        rows.forEach(row => {
          if (row.tipo === 'ingreso') ingresos = row.total;
          if (row.tipo === 'gasto') gastos = row.total;
        });

        return { ingresos, gastos, total: ingresos - gastos };
      }
    } catch (error) {
      console.error('Error al obtener balance:', error);
      throw error;
    }
  },

  obtenerGastosPorCategoria: async (usuarioId, mes) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        const transacciones = data.transacciones.filter(t =>
          t.usuario_id === usuarioId &&
          t.tipo === 'gasto' &&
          t.fecha.startsWith(mes)
        );

        const grouped = {};
        transacciones.forEach(t => {
          if (!grouped[t.categoria]) grouped[t.categoria] = 0;
          grouped[t.categoria] += parseFloat(t.monto);
        });

        return Object.keys(grouped).map(categoria => ({
          categoria,
          total: grouped[categoria]
        }));
      } else {
        const rows = await db.getAllAsync(
          `SELECT categoria, SUM(monto) as total 
           FROM transacciones 
           WHERE usuario_id = ? AND tipo = 'gasto' AND fecha LIKE ?
           GROUP BY categoria`,
          [usuarioId, `${mes}%`]
        );
        return rows;
      }
    } catch (error) {
      console.error('Error al obtener gastos por categoría:', error);
      throw error;
    }
  },

  obtenerBalanceMensual: async (usuarioId) => {
    try {
      if (Platform.OS === 'web') {
        const data = webQuery.getData();
        const transacciones = data.transacciones.filter(t => t.usuario_id === usuarioId);

        const grouped = {};
        transacciones.forEach(t => {
          const mes = t.fecha.substring(0, 7); // YYYY-MM
          const key = `${mes}-${t.tipo}`;
          if (!grouped[key]) {
            grouped[key] = { mes, tipo: t.tipo, total: 0 };
          }
          grouped[key].total += parseFloat(t.monto);
        });

        return Object.values(grouped).sort((a, b) => a.mes.localeCompare(b.mes));
      } else {
        const rows = await db.getAllAsync(
          `SELECT strftime('%Y-%m', fecha) as mes, tipo, SUM(monto) as total 
           FROM transacciones 
           WHERE usuario_id = ?
           GROUP BY mes, tipo 
           ORDER BY mes ASC`,
          [usuarioId]
        );
        return rows;
      }
    } catch (error) {
      console.error('Error al obtener balance mensual:', error);
      throw error;
    }
  }
};
