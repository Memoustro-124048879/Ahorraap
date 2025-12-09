import React, { useState, useCallback } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../Contexts/UserContext';
import { TransaccionModel } from '../Models/TransaccionModel';
import Colors from '../constants/colors';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function GraficasScreen() {
  const { usuario } = useUser();
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [datosGraficas, setDatosGraficas] = useState(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    if (!usuario) return;

    try {
      setCargando(true);
      const año = new Date().getFullYear();
      const mesStr = String(mesSeleccionado + 1).padStart(2, '0');
      const fechaBusqueda = `${año}-${mesStr}`;

      // Obtener todas las transacciones del mes
      const transacciones = await TransaccionModel.obtenerTodasPorUsuario(usuario.id);

      // Filtrar por el mes seleccionado
      const transaccionesMes = transacciones.filter(t =>
        t.fecha && t.fecha.startsWith(fechaBusqueda)
      );

      // Calcular totales
      let totalIngresos = 0;
      let totalGastos = 0;
      let totalEgresos = 0;

      transaccionesMes.forEach(t => {
        const monto = parseFloat(t.monto) || 0;
        if (t.tipo === 'ingreso') {
          totalIngresos += monto;
        } else if (t.tipo === 'gasto' || t.tipo === 'egreso') {
          // Fusionar gastos y egresos como simplemente 'egresos'
          totalEgresos += monto;
        }
      });

      // Calcular porcentajes (basado en el total de movimientos)
      const totalMovimientos = totalIngresos + totalGastos + totalEgresos;
      const datos = {
        ingresos: totalMovimientos > 0 ? Math.round((totalIngresos / totalMovimientos) * 100) : 0,
        egresos: totalMovimientos > 0 ? Math.round((totalEgresos / totalMovimientos) * 100) : 0,
        montosReales: {
          ingresos: totalIngresos,
          gastos: totalGastos,
          egresos: totalEgresos,
          total: totalMovimientos
        }
      };

      setDatosGraficas(datos);

      // 2. Obtener Gastos por Categoría
      const gastosCat = await TransaccionModel.obtenerGastosPorCategoria(usuario.id, fechaBusqueda);

      // Ordenar por mayor gasto y calcular porcentaje
      const totalSoloGastos = gastosCat.reduce((acc, curr) => acc + curr.total, 0);
      const gastosCatConPorcentaje = gastosCat.map(g => ({
        ...g,
        porcentaje: totalSoloGastos > 0 ? Math.round((g.total / totalSoloGastos) * 100) : 0
      })).sort((a, b) => b.total - a.total);

      setGastosPorCategoria(gastosCatConPorcentaje);
    } catch (error) {
      console.error('Error al cargar datos de gráficas:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de las gráficas');
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [usuario, mesSeleccionado])
  );

  if (cargando) {
    return (
      <SafeAreaView style={estilos.container}>
        <View style={estilos.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.moradoPrimario} />
          <Text style={estilos.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!datosGraficas) {
    return (
      <SafeAreaView style={estilos.container}>
        <View style={estilos.loadingContainer}>
          <Ionicons name="bar-chart-outline" size={60} color={Colors.grisTexto} />
          <Text style={estilos.emptyText}>No hay datos disponibles</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.fondoPrincipal} />

      <ScrollView>
        {/* Header */}
        <View style={estilos.header}>
          <Text style={estilos.titulo}>Gráficas Financieras</Text>
          <Text style={estilos.subtitulo}>Visualiza tus finanzas por mes</Text>
        </View>

        {/* Selector de Mes */}
        <View style={estilos.selectorMesContainer}>
          <Text style={estilos.etiquetaMes}>Selecciona un mes:</Text>
          <View style={estilos.botonesContainer}>
            {MESES.map((mes, index) => (
              <TouchableOpacity
                key={mes}
                style={[
                  estilos.botonMes,
                  index === mesSeleccionado && estilos.botonMesActivo,
                ]}
                onPress={() => setMesSeleccionado(index)}
              >
                <Text
                  style={[
                    estilos.textoBotonMes,
                    index === mesSeleccionado && estilos.textoBotonMesActivo,
                  ]}
                >
                  {mes}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gráficas de Barras */}
        <View style={estilos.graficasContainer}>
          <Text style={estilos.tituloGrafica}>Resumen de {MESES[mesSeleccionado]}</Text>
          {datosGraficas.montosReales.total > 0 ? (
            <>
              {/* Barra de Ingresos */}
              <View style={estilos.barraRow}>
                <Text style={estilos.etiquetaBarra}>Ingresos</Text>
                <View style={estilos.barraContainer}>
                  <View
                    style={[
                      estilos.barra,
                      {
                        width: `${datosGraficas.ingresos}%`,
                        backgroundColor: Colors.moradoSecundario,
                      },
                    ]}
                  />
                </View>
                <Text style={estilos.porcentaje}>{datosGraficas.ingresos}%</Text>
              </View>



              {/* Barra de Egresos */}
              <View style={estilos.barraRow}>
                <Text style={estilos.etiquetaBarra}>Egresos</Text>
                <View style={estilos.barraContainer}>
                  <View
                    style={[
                      estilos.barra,
                      {
                        width: `${datosGraficas.egresos}%`,
                        backgroundColor: Colors.cianAccion,
                      },
                    ]}
                  />
                </View>
                <Text style={estilos.porcentaje}>{datosGraficas.egresos}%</Text>
              </View>
            </>
          ) : (
            <View style={estilos.emptyContainer}>
              <Ionicons name="information-circle-outline" size={40} color={Colors.grisTexto} />
              <Text style={estilos.emptyMessage}>
                No hay transacciones registradas para {MESES[mesSeleccionado]}
              </Text>
            </View>
          )}
        </View>

        {/* Resumen numérico */}
        {datosGraficas.montosReales.total > 0 && (
          <View style={estilos.resumenContainer}>
            <View style={estilos.tarjetaResumen}>
              <Ionicons name="trending-up" size={24} color={Colors.moradoSecundario} />
              <Text style={estilos.tituloTarjeta}>Ingresos</Text>
              <Text style={[estilos.valorTarjeta, { color: Colors.moradoSecundario }]}>
                ${datosGraficas.montosReales.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={estilos.porcentajeTarjeta}>{datosGraficas.ingresos}%</Text>
            </View>



            <View style={estilos.tarjetaResumen}>
              <Ionicons name="cash" size={24} color={Colors.cianAccion} />
              <Text style={estilos.tituloTarjeta}>Egresos</Text>
              <Text style={[estilos.valorTarjeta, { color: Colors.cianAccion }]}>
                ${datosGraficas.montosReales.egresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={estilos.porcentajeTarjeta}>{datosGraficas.egresos}%</Text>
            </View>
          </View>
        )}

        {/* GRÁFICA POR CATEGORÍA */}
        {
          gastosPorCategoria.length > 0 && (
            <View style={estilos.graficasContainer}>
              <Text style={estilos.tituloGrafica}>Gastos por Categoría</Text>
              {gastosPorCategoria.map((item, index) => (
                <View key={index} style={estilos.barraRow}>
                  <Text style={estilos.etiquetaBarra} numberOfLines={1}>{item.categoria}</Text>
                  <View style={estilos.barraContainer}>
                    <View
                      style={[
                        estilos.barra,
                        {
                          width: `${item.porcentaje}%`,
                          backgroundColor: Colors.moradoPrimario,
                        }
                      ]}
                    />
                  </View>
                  <View style={{ alignItems: 'flex-end', width: 70 }}>
                    <Text style={estilos.porcentaje}>{item.porcentaje}%</Text>
                    <Text style={[estilos.textoTipo, { fontSize: 9 }]}>${item.total.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          )
        }

        {/* Botón de actualizar */}
        <View style={estilos.accionesContainer}>
          <TouchableOpacity style={estilos.botonActualizar} onPress={cargarDatos}>
            <Ionicons name="refresh" size={20} color={Colors.blanco} />
            <Text style={estilos.textoBotonActualizar}>Actualizar Datos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondoPrincipal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.grisTexto,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.grisTexto,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.moradoPrimario,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.blanco,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  selectorMesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  etiquetaMes: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grisOscuro,
    marginBottom: 10,
  },
  botonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botonMes: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.fondoSecundario,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  botonMesActivo: {
    backgroundColor: Colors.moradoPrimario,
  },
  textoBotonMes: {
    fontSize: 14,
    color: Colors.grisTexto,
  },
  textoBotonMesActivo: {
    color: Colors.blanco,
    fontWeight: '600',
  },
  graficasContainer: {
    backgroundColor: Colors.blanco,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tituloGrafica: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.grisOscuro,
    marginBottom: 20,
  },
  barraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  etiquetaBarra: {
    width: 80,
    fontSize: 14,
    color: Colors.grisOscuro,
    fontWeight: '500',
  },
  barraContainer: {
    flex: 1,
    height: 30,
    backgroundColor: Colors.fondoSecundario,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  barra: {
    height: '100%',
    borderRadius: 15,
  },
  porcentaje: {
    width: 45,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grisOscuro,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyMessage: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.grisTexto,
    textAlign: 'center',
  },
  resumenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tarjetaResumen: {
    backgroundColor: Colors.blanco,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tituloTarjeta: {
    fontSize: 12,
    color: Colors.grisTexto,
    marginTop: 8,
    marginBottom: 4,
  },
  valorTarjeta: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  porcentajeTarjeta: {
    fontSize: 12,
    color: Colors.grisTexto,
    marginTop: 4,
  },
  accionesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  botonActualizar: {
    flexDirection: 'row',
    backgroundColor: Colors.cianAccion,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textoBotonActualizar: {
    color: Colors.blanco,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});