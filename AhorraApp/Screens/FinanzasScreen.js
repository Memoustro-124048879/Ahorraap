import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

import ModalConfiguracion from "../components/ModalConfiguracion";
import ModalNotificacionesGeneral from "../components/ModalNotificacionesGeneral";


import { obtenerBalancePorMes, insertarDatosPrueba, obtenerSaldoTotal } from "../controllers/FinanzasController";

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458", 
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
  azul: "#3498db",
  barraFondo: "#e0e0e0",
};

const mapaMeses = {
  'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
  'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
  'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
};

function Encabezado({ titulo, abrirNotificaciones, abrirConfiguracion, saldo, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity><Text style={{fontSize:24}}>🏦</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          {/* Saldo Dinámico */}
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX", {minimumFractionDigits: 2})}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>
        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={abrirNotificaciones}>
            <Ionicons name="notifications-outline" size={24} color={color.verde} />
          </TouchableOpacity>
          <TouchableOpacity onPress={abrirConfiguracion}>
            <Ionicons name="settings-outline" size={24} color={color.verde} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BarraProgreso = ({ label, monto, total, colorBarra, icono }) => {
  const porcentaje = (total > 0 && monto > 0) ? Math.min((monto / total) * 100, 100) : 0;
  return (
    <View style={estilos.bloqueBarra}>
      <View style={estilos.infoBarra}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Ionicons name={icono} size={18} color={color.textoSuave} style={{marginRight:5}} />
            <Text style={estilos.etiquetaBarra}>{label}</Text>
        </View>
        <Text style={[estilos.montoBarra, {color: colorBarra}]}>${monto.toLocaleString()}</Text>
      </View>
      <View style={estilos.trackBarra}>
        <View style={[estilos.fillBarra, { width: `${porcentaje}%`, backgroundColor: colorBarra }]} />
      </View>
    </View>
  );
};

export default function FinanzasScreen({ navigation }) {
  const [notiVisible, setNotiVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const notificaciones = ["Nuevo ingreso registrado", "Presupuesto superado"];

  const [mesSeleccionado, setMesSeleccionado] = useState('Enero');
  const meses = Object.keys(mapaMeses);
  
  const [dataActual, setDataActual] = useState({ ingresos: 0, gastos: 0, meta: 15000 });
  const [saldoActual, setSaldoActual] = useState(0); // Estado para el Header
  const [cargando, setCargando] = useState(false);

  
  useFocusEffect(
    useCallback(() => {
      cargarDatosDelMes(mesSeleccionado);
      actualizarSaldoGlobal();
    }, [mesSeleccionado])
  );

  const actualizarSaldoGlobal = () => {
    obtenerSaldoTotal((total) => setSaldoActual(total));
  };

  const cargarDatosDelMes = (mes) => {
    setCargando(true);
    const numeroMes = mapaMeses[mes];
    
    obtenerBalancePorMes(numeroMes, (resultados) => {
      const datosLimpios = resultados || { ingresos: 0, gastos: 0, meta: 15000 };
      setDataActual(datosLimpios);
      setCargando(false);
    });
  };

  const llenarBaseDatos = () => {
    insertarDatosPrueba(() => {
      alert("Base de datos reiniciada y cargada.");
      cargarDatosDelMes(mesSeleccionado); 
      actualizarSaldoGlobal();
    });
  };

  const balance = dataActual.ingresos - dataActual.gastos;

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado 
        titulo="Mis Finanzas" 
        abrirNotificaciones={() => setNotiVisible(true)}
        abrirConfiguracion={() => setConfigVisible(true)}
        saldo={saldoActual} // Pasamos el saldo real
      />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={estilos.selectorMesesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 5}}>
            {meses.map((mes) => {
              const activo = mes === mesSeleccionado;
              return (
                <TouchableOpacity 
                  key={mes} 
                  onPress={() => setMesSeleccionado(mes)}
                  style={[estilos.chipMes, activo && estilos.chipMesActivo]}
                >
                  <Text style={[estilos.textoMes, activo && estilos.textoMesActivo]}>{mes}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View style={estilos.cardResumen}>
            <Text style={estilos.tituloResumen}>Balance de {mesSeleccionado}</Text>
            {cargando ? (
              <ActivityIndicator color={color.verde} size="large" />
            ) : (
              <Text style={estilos.montoResumen}>${balance.toLocaleString()} <Text style={{fontSize:16, color:'#999'}}>MXN</Text></Text>
            )}
        </View>

        <View style={estilos.cardDetalle}>
            <Text style={estilos.subtitulo}>Desglose General</Text>
            <BarraProgreso label="Ingresos" monto={dataActual.ingresos} total={dataActual.meta} colorBarra={color.verde} icono="arrow-up-circle-outline" />
            <BarraProgreso label="Gastos" monto={dataActual.gastos} total={dataActual.ingresos} colorBarra={color.rojo} icono="arrow-down-circle-outline" />
            <BarraProgreso label="Ahorro" monto={balance} total={dataActual.ingresos} colorBarra={color.azul} icono="wallet-outline" />
        </View>

        <TouchableOpacity style={estilos.botonReporte} onPress={llenarBaseDatos}>
            <Text style={estilos.textoBotonReporte}>Cargar Datos</Text>
            <Ionicons name="refresh" size={20} color={color.verde} />
        </TouchableOpacity>

      </ScrollView>

      <ModalNotificacionesGeneral visible={notiVisible} onClose={() => setNotiVisible(false)} notificaciones={notificaciones} />
      <ModalConfiguracion visible={configVisible} onClose={() => setConfigVisible(false)} navigation={navigation} />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  encabezado: { backgroundColor: color.verde, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 16, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, zIndex: 1 },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: { backgroundColor: color.tarjeta, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", elevation: 5 },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: '600' },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 100 },
  selectorMesesContainer: { marginBottom: 20, height: 50 },
  chipMes: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent', marginRight: 5, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center' },
  chipMesActivo: { backgroundColor: color.verde, borderColor: color.verde, elevation: 2 },
  textoMes: { color: '#666', fontWeight: '600' },
  textoMesActivo: { color: 'white', fontWeight: 'bold' },
  cardResumen: { backgroundColor: color.tarjeta, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, elevation: 3 },
  tituloResumen: { fontSize: 14, color: color.textoSuave, fontWeight: '600', marginBottom: 5 },
  montoResumen: { fontSize: 36, fontWeight: '900', color: color.texto, marginBottom: 10 },
  cardDetalle: { backgroundColor: color.tarjeta, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: color.texto },
  bloqueBarra: { marginBottom: 20 },
  infoBarra: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  etiquetaBarra: { fontSize: 14, fontWeight: '600', color: '#555' },
  montoBarra: { fontSize: 14, fontWeight: 'bold' },
  trackBarra: { height: 12, backgroundColor: color.barraFondo, borderRadius: 6, overflow: 'hidden' },
  fillBarra: { height: '100%', borderRadius: 6 },
  botonReporte: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 2, borderColor: color.verde, borderRadius: 15, borderStyle: 'dashed' },
  textoBotonReporte: { color: color.verde, fontWeight: 'bold', marginRight: 10 }
});