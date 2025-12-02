import { getDB } from '../database/db';

// 1. OBTENER TODOS
export const obtenerPresupuestos = async (callback) => {
  const db = await getDB();
  try {
    const resultados = await db.getAllAsync("SELECT * FROM presupuestos ORDER BY id DESC");
    callback(resultados);
  } catch (error) {
    console.log("Error obteniendo presupuestos:", error);
    callback([]);
  }
};

// 2. AGREGAR 
export const agregarPresupuesto = async (categoria, monto, fecha, callback) => {
  const db = await getDB();
  try {
    await db.runAsync(
      "INSERT INTO presupuestos (categoria, monto, fecha) VALUES (?, ?, ?)",
      [categoria, parseFloat(monto), fecha]
    );
    console.log("Presupuesto agregado con fecha");
    if (callback) callback();
  } catch (error) {
    console.log("Error agregando presupuesto:", error);
  }
};

// 3. EDITAR 
export const editarPresupuesto = async (id, categoria, monto, fecha, callback) => {
  const db = await getDB();
  try {
    await db.runAsync(
      "UPDATE presupuestos SET categoria = ?, monto = ?, fecha = ? WHERE id = ?",
      [categoria, parseFloat(monto), fecha, id]
    );
    console.log("Presupuesto actualizado");
    if (callback) callback();
  } catch (error) {
    console.log("Error editando presupuesto:", error);
  }
};

// 4. ELIMINAR
export const eliminarPresupuesto = async (id, callback) => {
  const db = await getDB();
  try {
    await db.runAsync("DELETE FROM presupuestos WHERE id = ?", [id]);
    console.log("Presupuesto eliminado");
    if (callback) callback();
  } catch (error) {
    console.log("Error eliminando presupuesto:", error);
  }
};