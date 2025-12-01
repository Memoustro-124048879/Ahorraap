import { getDB } from '../database/db';

// 1. Insertar datos de prueba (SEEDER COMPLETO ENE-DIC)
export const insertarDatosPrueba = async (callback) => {
  const db = await getDB();
  
  try {
    // Limpiamos tabla
    await db.runAsync("DELETE FROM transacciones"); 

    // --- ENERO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 12500, 'ingreso', '2025-01-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Renta', 2861, 'gasto', '2025-01-20', 'Hogar']);
    
    // --- FEBRERO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 11000, 'ingreso', '2025-02-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Viaje', 8500, 'gasto', '2025-02-20', 'Ocio']);

    // --- MARZO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Bono', 14200, 'ingreso', '2025-03-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Comida', 1200, 'gasto', '2025-03-10', 'Alimentos']);

    // --- ABRIL ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Freelance', 9800, 'ingreso', '2025-04-10', 'Extra']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Coche', 9000, 'gasto', '2025-04-22', 'Transporte']);

    // --- MAYO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 13000, 'ingreso', '2025-05-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Ropa', 4500, 'gasto', '2025-05-05', 'Personal']);

    // --- JUNIO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 12500, 'ingreso', '2025-06-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Salida', 6000, 'gasto', '2025-06-12', 'Ocio']);

    // --- JULIO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Prima Vacacional', 15000, 'ingreso', '2025-07-20', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Hotel', 3000, 'gasto', '2025-07-25', 'Viajes']);

    // --- AGOSTO ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 11500, 'ingreso', '2025-08-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Escuela', 5000, 'gasto', '2025-08-28', 'Educación']);

    // --- SEPTIEMBRE ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 12000, 'ingreso', '2025-09-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Fiesta Patria', 2500, 'gasto', '2025-09-16', 'Ocio']);

    // --- OCTUBRE ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 12000, 'ingreso', '2025-10-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Seguro Médico', 8000, 'gasto', '2025-10-05', 'Salud']);

    // --- NOVIEMBRE ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Nómina', 12500, 'ingreso', '2025-11-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Buen Fin', 6500, 'gasto', '2025-11-18', 'Compras']);

    // --- DICIEMBRE (Aguinaldo) ---
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Aguinaldo', 25000, 'ingreso', '2025-12-15', 'Salario']);
    await db.runAsync("INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", ['Regalos Navidad', 12000, 'gasto', '2025-12-24', 'Regalos']);

    console.log("Datos anuales insertados correctamente");
    if(callback) callback();
    
  } catch (error) {
    console.log("Error insertando datos:", error);
  }
};

// 2. Obtener balance por mes
export const obtenerBalancePorMes = async (mesNumero, callback) => {
  const db = await getDB();

  try {
    const resultados = await db.getAllAsync(
      `SELECT tipo, SUM(monto) as total 
       FROM transacciones 
       WHERE strftime('%m', fecha) = ? 
       GROUP BY tipo`,
      [mesNumero]
    );

    let ingresos = 0;
    let gastos = 0;

    resultados.forEach(item => {
      if (item.tipo === 'ingreso') ingresos = item.total;
      if (item.tipo === 'gasto') gastos = item.total;
    });

    callback({
      ingresos: ingresos,
      gastos: gastos,
      meta: 15000 
    });

  } catch (error) {
    console.log("Error consultando mes:", error);
  }
};
export const obtenerTodasLasTransacciones = async (callback) => {
  const db = await getDB();
  try {
    const resultados = await db.getAllAsync("SELECT * FROM transacciones ORDER BY fecha DESC");
    callback(resultados);
  } catch (error) {
    console.log("Error obteniendo historial:", error);
    callback([]);
  }
};