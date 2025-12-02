import { getDB } from '../database/db';

// 1. OBTENER TODOS (Leer)
export const obtenerPresupuestos = async (callback) => {
  const db = await getDB();
  try {
    const resultados = await db.getAllAsync("SELECT * FROM presupuestos");
    callback(resultados);
  } catch (error) {
    console.log("Error obteniendo presupuestos:", error);
    callback([]);
  }
};

// 2. AGREGAR (Crear)
export const agregarPresupuesto = async (categoria, monto, callback) => {
  const db = await getDB();
  try {
    await db.runAsync(
      "INSERT INTO presupuestos (categoria, monto) VALUES (?, ?)",
      [categoria, parseFloat(monto)]
    );
    console.log("Presupuesto agregado");
    if (callback) callback();
  } catch (error) {
    console.log("Error agregando presupuesto:", error);
  }
};

// 3. EDITAR (Actualizar)
export const editarPresupuesto = async (id, categoria, monto, callback) => {
  const db = await getDB();
  try {
    await db.runAsync(
      "UPDATE presupuestos SET categoria = ?, monto = ? WHERE id = ?",
      [categoria, parseFloat(monto), id]
    );
    console.log("Presupuesto actualizado");
    if (callback) callback();
  } catch (error) {
    console.log("Error editando presupuesto:", error);
  }
};

// 4. ELIMINAR (Borrar)
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