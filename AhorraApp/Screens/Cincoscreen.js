// screens/Cincoscreen.js
import React, { useState } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondoPantalla: "#f1f2f3", // Ajustado para coincidir con el home
  fondoTarjeta: "#ffffff",
  verdePrincipal: "#2f8a4f", // Ajustado al verde del home
  verdeFondoOscuro: "#2f8a4f",
  textoOscuro: "#101010",
  textoEtiqueta: "#444",
  textoSuave: "#666",
  grisIcono: "#dcdcdc",
  barraGastos: '#e0b0af',
  barraIngresos: "#98d4b3",
  barraEgresos: "#a7d2e0",
  fondoBotonMes: "#e0e0e0",
  textoBotonMes: "#555",
};

const Barra = ({ label, barColor, widthPercentage }) => (
  <View style={estilos.barraItem}>
    <Text style={estilos.etiquetaBarra}>{label}</Text>
    <View style={estilos.barraContainer}>
      <View
        style={[
          estilos.barra,
          { backgroundColor: barColor, width: `${widthPercentage}%` }
        ]}
      />
    </View>
  </View>
);

// --- ENCABEZADO ESTANDARIZADO ---
function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <StatusBar barStyle="light-content" backgroundColor={color.verdeFondoOscuro} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>
           {/* Icono ajustado para igualar al Home */}
           <Text style={{fontSize:24}}>🏦</Text> 
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>
        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={24} color={color.verdeFondoOscuro} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={color.verdeFondoOscuro} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function GraficasScreen({ navigation }) { 
  const [mesSeleccionado, setMesSeleccionado] = useState('Enero');
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const irA = (pantalla) => navigation.navigate(pantalla);

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Gráficas" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View style={estilos.graficaContainer}>
            <Barra label="Gastos" barColor={color.barraGastos} widthPercentage={85} />
            <Barra label="Ingresos" barColor={color.barraIngresos} widthPercentage={70} />
            <Barra label="Egresos" barColor={color.barraEgresos} widthPercentage={95} />
          </View>
          <View style={estilos.mesesContainer}>
            {meses.map((mes) => (
              <TouchableOpacity
                key={mes}
                style={[estilos.botonMes, mesSeleccionado === mes && estilos.botonMesActivo]}
                onPress={() => setMesSeleccionado(mes)}
              >
                <Text style={estilos.textoBotonMes}>{mes}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* --- BARRA INFERIOR ESTANDARIZADA --- */}
      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => irA("Presupuestos")}>
          <Ionicons name="document-text-outline" size={26} color="gray" />
        </TouchableOpacity>

        {/* BOTÓN HOME IDÉNTICO AL PRINCIPAL */}
        <TouchableOpacity style={estilos.botonCentral} onPress={() => irA("Transacciones")}>
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="stats-chart" size={26} color={color.verdeFondoOscuro} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="calendar-outline" size={26} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondoPantalla },
  
  // --- ESTILOS COPIADOS DE CUATROSCREEN (NO MODIFICAR) ---
  encabezado: {
    backgroundColor: color.verdeFondoOscuro,
    paddingTop: 40, 
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center'},
  saldoTarjeta: {
    backgroundColor: color.fondoTarjeta,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2}
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 26, fontWeight: "800", color: color.textoOscuro },
  moneda: { fontSize: 12, color: color.textoSuave, fontWeight: '600' },
  
  barraInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 10,
  },
  icono: { alignItems: "center", justifyContent: "center", flex: 1, paddingVertical: 10 },
  botonCentral: {
    width: 65, // Medida exacta del Home
    height: 65,
    borderRadius: 35,
    backgroundColor: color.verdePrincipal,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40, // Flotación exacta
    elevation: 8,
    shadowColor: "#2f8a4f",
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 4},
    borderWidth: 4,
    borderColor: "#f1f2f3" // Mismo color del fondo
  },
  // -----------------------------------------------------

  cuerpo: { paddingHorizontal: 16, marginTop: 20, flex: 1, paddingBottom: 90 }, // Padding bottom extra para que no tape la barra
  cajaBlanca: {
    flex: 1,
    backgroundColor: color.fondoTarjeta,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between'
  },
  graficaContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  barraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%'
  },
  etiquetaBarra: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textoEtiqueta,
    width: 70,
    textAlign: 'right',
    marginRight: 10,
    transform: [{ rotate: '-90deg' }],
  },
  barraContainer: {
    flex: 1,
    height: 35,
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barra: { height: '100%', borderRadius: 8 },
  mesesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  botonMes: {
    backgroundColor: color.fondoBotonMes,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  botonMesActivo: {
    backgroundColor: "#ccc", 
    borderWidth: 1,
    borderColor: "#999"
  },
  textoBotonMes: { fontSize: 12, color: color.textoBotonMes, fontWeight: '500' },
});