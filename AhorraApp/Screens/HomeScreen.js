// Screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
};

// --- ENCABEZADO ---
function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
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


export default function HomeScreen({ navigation }) {
  
  const irA = (nombrePantalla) => navigation.navigate(nombrePantalla);

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Transacciones" />

      <ScrollView contentContainerStyle={estilos.scrollContent}>
        <View style={estilos.gridOpciones}>
            
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => irA("Historial")}>
              <Ionicons name="reload-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Historial de{"\n"}registros</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => irA("NuevaTransferencia")}>
               <FontAwesome5 name="exchange-alt" size={30} color="white" />
              <Text style={estilos.textoOpcion}>Nueva{"\n"}transferencia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => irA("EditarTransferencias")}>
              <MaterialIcons name="edit" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Editar{"\n"}transferencias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => irA("ListaFiltrada")}>
              <Ionicons name="list-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Listado{"\n"}filtrado</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  scrollContent: { padding: 16, paddingBottom: 100 }, 
  encabezado: {
    backgroundColor: color.verde,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    zIndex: 1
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
  gridOpciones: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  botonOpcion: {
    backgroundColor: color.verde,
    width: "47%",
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  textoOpcion: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
  },
});