// screens/Seisscreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  gris: "#dcdcdc",
  rosado: "#f7efef",
  verdeSuave: "#b8e0c2",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#d9534f",
};

// --- ENCABEZADO ESTANDARIZADO ---
function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity><Text style={{fontSize:24}}>🏦</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>
        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={24} color={color.verde} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={color.verde} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PresupuestoScreen({ navigation }) { 
  const presupuestos = [
    { id: 1, texto: "1500MXN / Ropa para bebé" },
    { id: 2, texto: "500MXN / Gimnasio" },
  ];

  const irA = (pantalla) => navigation.navigate(pantalla);

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Presupuesto" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <Text style={estilos.textoTitulo}>Presupuesto:</Text>

          <View style={estilos.cuadroPresupuesto}>
            {presupuestos.map((item) => (
              <View key={item.id} style={estilos.itemPresupuesto}>
                <Text style={estilos.textoPresupuesto}>{item.texto}</Text>
                <View style={estilos.contenedorAcciones}>
                  <TouchableOpacity onPress={() => Alert.alert("Editar", "Función pendiente")}>
                    <Text style={estilos.textoEditar}>editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Alert.alert("Eliminar", "Función pendiente")}>
                    <Text style={estilos.textoEliminar}>eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={estilos.botonAgregar}
            onPress={() => irA("AgregarPresupuesto")} 
          >
            <Text style={estilos.textoBoton}>Agregar presupuesto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- BARRA INFERIOR ESTANDARIZADA --- */}
      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="document-text" size={26} color={color.verde} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botonCentral} onPress={() => irA("Transacciones")}>
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => irA("Graficas")}>
          <Ionicons name="stats-chart-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="calendar-outline" size={26} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  
  // --- ESTILOS IDÉNTICOS A CUATROSCREEN ---
  encabezado: {
    backgroundColor: color.verde,
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
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: {
    backgroundColor: color.tarjeta,
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
  saldo: { fontSize: 26, fontWeight: "800", color: color.texto },
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
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: color.verde,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    elevation: 8,
    shadowColor: "#2f8a4f",
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 4},
    borderWidth: 4,
    borderColor: "#f1f2f3"
  },
  // ----------------------------------------

  cuerpo: { paddingHorizontal: 16, marginTop: 20, flex: 1, paddingBottom: 90 },
  cajaBlanca: {
    flex: 1,
    backgroundColor: color.tarjeta,
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-start",
  },
  textoTitulo: { fontWeight: "700", color: color.texto, fontSize: 16, marginBottom: 8 },
  cuadroPresupuesto: {
    flex: 1,
    backgroundColor: color.rosado,
    borderRadius: 20,
    marginVertical: 10,
    padding: 10,
  },
  itemPresupuesto: {
    backgroundColor: color.verdeSuave,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contenedorAcciones: { flexDirection: "row", gap: 10 },
  textoPresupuesto: { color: color.texto, fontSize: 14, fontWeight: "600" },
  textoEditar: { color: color.verde, fontSize: 13, fontWeight: "500" },
  textoEliminar: { color: color.rojo, fontSize: 13, fontWeight: "500" },
  botonAgregar: {
    alignSelf: "flex-end",
    backgroundColor: color.verde,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 10,
  },
  textoBoton: { color: "white", fontWeight: "600", fontSize: 13 },
});