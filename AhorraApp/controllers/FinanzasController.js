import { getDB } from '../database/db';

// 1. SEEDER (DATOS DE PRUEBA ENE-DIC)
export const insertarDatosPrueba = async (callback) => {
  const db = await getDB();
  
  try {
    // Limpiamos tabla para empezar de cero
    await db.runAsync("DELETE FROM transacciones"); 

    const transacciones = [
      // ENERO
      ['Nómina', 12500, 'ingreso', '2025-01-15', 'Salario'],
      ['Renta', 2861, 'gasto', '2025-01-20', 'Hogar'],
      // FEBRERO
      ['Nómina', 11000, 'ingreso', '2025-02-15', 'Salario'],
      ['Viaje', 8500, 'gasto', '2025-02-20', 'Ocio'],
      // MARZO
      ['Bono', 14200, 'ingreso', '2025-03-15', 'Salario'],
      ['Comida', 1200, 'gasto', '2025-03-10', 'Alimentos'],
      // ABRIL
      ['Freelance', 9800, 'ingreso', '2025-04-10', 'Extra'],
      ['Coche', 9000, 'gasto', '2025-04-22', 'Transporte'],
      // MAYO
      ['Nómina', 13000, 'ingreso', '2025-05-15', 'Salario'],
      ['Ropa', 4500, 'gasto', '2025-05-05', 'Personal'],
      // JUNIO
      ['Nómina', 12500, 'ingreso', '2025-06-15', 'Salario'],
      ['Cena', 6000, 'gasto', '2025-06-12', 'Ocio'],
      // JULIO
      ['Prima', 15000, 'ingreso', '2025-07-20', 'Salario'],
      ['Hotel', 3000, 'gasto', '2025-07-25', 'Viajes'],
      // AGOSTO
      ['Nómina', 11500, 'ingreso', '2025-08-15', 'Salario'],
      ['Escuela', 5000, 'gasto', '2025-08-28', 'Educación'],
      // SEPTIEMBRE
      ['Nómina', 12000, 'ingreso', '2025-09-15', 'Salario'],
      ['Fiesta', 2500, 'gasto', '2025-09-16', 'Ocio'],
      // OCTUBRE
      ['Nómina', 12000, 'ingreso', '2025-10-15', 'Salario'],
      ['Seguro', 8000, 'gasto', '2025-10-05', 'Salud'],
      // NOVIEMBRE
      ['Nómina', 12500, 'ingreso', '2025-11-15', 'Salario'],
      ['Buen Fin', 6500, 'gasto', '2025-11-18', 'Compras'],
      // DICIEMBRE
      ['Aguinaldo', 25000, 'ingreso', '2025-12-15', 'Salario'],
      ['Regalos', 12000, 'gasto', '2025-12-24', 'Regalos']
    ];

    // Insertamos uno por uno de forma segura
    for (const t of transacciones) {
      await db.runAsync(
        "INSERT INTO transacciones (titulo, monto, tipo, fecha, categoria) VALUES (?, ?, ?, ?, ?)", 
        t
      );
    }

    console.log("Datos anuales insertados correctamente ✅");
    if(callback) callback();
    
  } catch (error) {
    console.log("Error insertando datos:", error);
  }
};

// 2. OBTENER BALANCE (LÓGICA MANUAL BLINDADA)
export const obtenerBalancePorMes = async (mesNumero, callback) => {
  const db = await getDB();
  try {
    // Traemos TODO y filtramos aquí en JavaScript (Más seguro)
    const todas = await db.getAllAsync("SELECT * FROM transacciones");

    let ingresos = 0;
    let gastos = 0;

    todas.forEach(item => {
      // La fecha es 'YYYY-MM-DD'. El mes está en la posición 1.
      // Ejemplo: '2025-08-15'.split('-') -> ['2025', '08', '15']
      const partesFecha = item.fecha.split('-');
      if (partesFecha.length >= 2) {
        const mesItem = partesFecha[1]; 

        // Si coincide con el mes que pedimos (ej: '08')
        if (mesItem === mesNumero) {
          if (item.tipo === 'ingreso') ingresos += item.monto;
          if (item.tipo === 'gasto') gastos += item.monto;
        }
      }
    });

    callback({
      ingresos: ingresos,
      gastos: gastos,
      meta: 15000 
    });

  } catch (error) {
    console.log("Error calculando balance:", error);
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
    console.log("Error al guardar:", error);
  }
};