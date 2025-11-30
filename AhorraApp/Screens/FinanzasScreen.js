// Screens/FinanzasScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ModalConfiguracion from "../components/ModalConfiguracion";
import ModalNotificacionesGeneral from "../components/ModalNotificacionesGeneral";
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


function Encabezado({ titulo, abrirNotificaciones, abrirConfiguracion, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>
           <Text style={{fontSize:24}}>🏦</Text> 
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>
        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }}onPress={abrirNotificaciones}>
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
  const porcentaje = Math.min((monto / total) * 100, 100);
  
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
  
    const notificaciones = [
      "Nuevo ingreso registrado",
      "Presupuesto superado en Supermercado"
    ];
  const [mesSeleccionado, setMesSeleccionado] = useState('Enero');
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];

  const dataFinanciera = {
    ingresos: 12500,
    gastos: 2861, 
    meta: 15000 
  };
  
  const balance = dataFinanciera.ingresos - dataFinanciera.gastos;

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
     
      <Encabezado titulo="Mis Finanzas" 
      abrirNotificaciones={() => setNotiVisible(true)}
      abrirConfiguracion={() => setConfigVisible(true)}/>

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
            <Text style={estilos.montoResumen}>${balance.toLocaleString()} <Text style={{fontSize:16, color:'#999'}}>MXN</Text></Text>
            <View style={estilos.badgeEstado}>
                <Ionicons name="trending-up" size={16} color="white" style={{marginRight:4}} />
                <Text style={{color:'white', fontWeight:'bold', fontSize:12}}>+15% vs mes pasado</Text>
            </View>
        </View>

       
        <View style={estilos.cardDetalle}>
            <Text style={estilos.subtitulo}>Desglose General</Text>
            
            <BarraProgreso 
                label="Ingresos" 
                monto={dataFinanciera.ingresos} 
                total={dataFinanciera.meta}
                colorBarra={color.verde}
                icono="arrow-up-circle-outline"
            />

            <BarraProgreso 
                label="Gastos" 
                monto={dataFinanciera.gastos} 
                total={dataFinanciera.ingresos}
                colorBarra={color.rojo}
                icono="arrow-down-circle-outline"
            />

            <BarraProgreso 
                label="Ahorro / Disponible" 
                monto={balance} 
                total={dataFinanciera.ingresos}
                colorBarra={color.azul}
                icono="wallet-outline"
            />
        </View>

      
        <TouchableOpacity style={estilos.botonReporte}>
            <Text style={estilos.textoBotonReporte}>Descargar Reporte PDF</Text>
            <Ionicons name="download-outline" size={20} color={color.verde} />
        </TouchableOpacity>

      </ScrollView>
       <ModalNotificacionesGeneral
              visible={notiVisible}
              onClose={() => setNotiVisible(false)}
              notificaciones={notificaciones}
            />
      
            <ModalConfiguracion
              visible={configVisible}
              onClose={() => setConfigVisible(false)}
            />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  
 
  encabezado: {
    backgroundColor: color.verde,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    zIndex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: {
    backgroundColor: color.tarjeta,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4}
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: '600' },

  scrollContent: { 
    paddingTop: 20, 
    paddingHorizontal: 20, 
    paddingBottom: 100 
  },
  selectorMesesContainer: {
    marginBottom: 20,
    height: 50,
  },
  chipMes: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center'
  },
  chipMesActivo: {
    backgroundColor: color.verde,
    borderColor: color.verde,
    elevation: 2,
  },
  textoMes: { color: '#666', fontWeight: '600' },
  textoMesActivo: { color: 'white', fontWeight: 'bold' },
  cardResumen: {
    backgroundColor: color.tarjeta,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2}
  },
  tituloResumen: { fontSize: 14, color: color.textoSuave, fontWeight: '600', marginBottom: 5 },
  montoResumen: { fontSize: 36, fontWeight: '900', color: color.texto, marginBottom: 10 },
  badgeEstado: {
    backgroundColor: color.verde,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetalle: {
    backgroundColor: color.tarjeta,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2}
  },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: color.texto },
  bloqueBarra: { marginBottom: 20 },
  infoBarra: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  etiquetaBarra: { fontSize: 14, fontWeight: '600', color: '#555' },
  montoBarra: { fontSize: 14, fontWeight: 'bold' },
  trackBarra: { height: 12, backgroundColor: color.barraFondo, borderRadius: 6, overflow: 'hidden' },
  fillBarra: { height: '100%', borderRadius: 6 },
  botonReporte: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: color.verde,
    borderRadius: 15,
    borderStyle: 'dashed',
  },
  textoBotonReporte: { color: color.verde, fontWeight: 'bold', marginRight: 10 }
});