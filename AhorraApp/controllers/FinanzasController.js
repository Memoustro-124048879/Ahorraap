import { getDB } from '../database/db';

// 1. SEEDER (DATOS DE PRUEBA)
export const insertarDatosPrueba = async (callback) => {
  const db = await getDB();
  try {
    await db.runAsync("DELETE FROM transacciones"); 
    
    const transacciones = [
      ['Nómina', 12500, 'ingreso', '2025-01-15', 'Salario'],
      ['Renta', 2861, 'gasto', '2025-01-20', 'Hogar'],
      
    ];
    for (const t of transacciones) {
      await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", t);
    }
    console.log("Datos insertados ✅");
    if(callback) callback();
  } catch (error) {
    console.log("Error insertando:", error);
  }
};

// 2. OBTENER BALANCE POR MES
export const obtenerBalancePorMes = async (mesNumero, callback) => {
  const db = await getDB();
  try {
    const todas = await db.getAllAsync("SELECT * FROM transacciones");
    let ingresos = 0;
    let gastos = 0;
    todas.forEach(item => {
      const partesFecha = item.fecha.split('-');
      if (partesFecha.length >= 2 && partesFecha[1] === mesNumero) {
        if (item.tipo === 'ingreso') ingresos += item.monto;
        if (item.tipo === 'gasto') gastos += item.monto;
      }
    });
    callback({ ingresos, gastos, meta: 15000 });
  } catch (error) {
    console.log("Error balance:", error);
    callback({ ingresos: 0, gastos: 0, meta: 15000 });
  }
};

// 3. OBTENER TODAS (Historial)
export const obtenerTodasLasTransacciones = async (callback) => {
  const db = await getDB();
  try {
    const resultados = await db.getAllAsync("SELECT * FROM transacciones ORDER BY fecha DESC");
    callback(resultados);
  } catch (error) {
    console.log("Error historial:", error);
    callback([]);
  }
};

// 4. AGREGAR TRANSACCIÓN
export const agregarTransaccion = async (datos, callback) => {
  const db = await getDB();
  const { tipo, monto, categoria, descripcion, fecha, metodoPago } = datos;
  try {
    await db.runAsync(
      "INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
      [descripcion, parseFloat(monto), tipo.toLowerCase(), fecha, categoria, metodoPago]
    );
    if (callback) callback();
  } catch (error) {
    console.log("Error guardar:", error);
  }
};

// 5. EDITAR TRANSACCIÓN (NUEVO) ✏️
export const editarTransaccion = async (id, datos, callback) => {
  const db = await getDB();
  const { tipo, monto, categoria, descripcion, fecha, metodoPago } = datos;
  try {
    await db.runAsync(
      `UPDATE transacciones 
       SET titulo = ?, monto = ?, tipo = ?, fecha = ?, categoria = ?, descripcion = ? 
       WHERE id = ?`,
      [descripcion, parseFloat(monto), tipo.toLowerCase(), fecha, categoria, metodoPago, id]
    );
    console.log("Transacción editada");
    if (callback) callback();
  } catch (error) {
    console.log("Error editar:", error);
  }
};

// 6. ELIMINAR TRANSACCIÓN (NUEVO) 🗑️
export const eliminarTransaccion = async (id, callback) => {
  const db = await getDB();
  try {
    await db.runAsync("DELETE FROM transacciones WHERE id = ?", [id]);
    console.log("Transacción eliminada");
    if (callback) callback();
  } catch (error) {
    console.log("Error eliminar:", error);
  }
};

// 7. SALDO TOTAL
export const obtenerSaldoTotal = async (callback) => {
  const db = await getDB();
  try {
    const todas = await db.getAllAsync("SELECT * FROM transacciones");
    let total = 0;
    todas.forEach(item => {
      if (item.tipo === 'ingreso') total += item.monto;
      else if (item.tipo === 'gasto') total -= item.monto;
    });
    callback(total);
  } catch (error) {
    callback(0);
  }
};