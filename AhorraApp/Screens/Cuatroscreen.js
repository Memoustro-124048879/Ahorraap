// screens/Cuatroscreen.js
import React from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
};


function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  const handleNotificaciones = () => {
    
    Alert.alert("Notificaciones", "Sin novedades por ahora.");
  };

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
          <TouchableOpacity style={{ marginRight: 15 }} onPress={handleNotificaciones}>
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


export default function TransaccionesScreen({ navigation }) {
  
  
  const irA = (nombrePantalla) => {
    navigation.navigate(nombrePantalla);
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Transacciones" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View style={estilos.gridOpciones}>
            
            <TouchableOpacity 
              style={estilos.botonOpcion} 
              onPress={() => irA("Historial")}
            >
              <Ionicons name="reload-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Historial de{"\n"}registros</Text>
            </TouchableOpacity>

            
            <TouchableOpacity 
              style={estilos.botonOpcion} 
              onPress={() => irA("NuevaTransferencia")}
            >
               <FontAwesome5 name="exchange-alt" size={30} color="white" />
              <Text style={estilos.textoOpcion}>Nueva{"\n"}transferencia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={estilos.botonOpcion} 
              onPress={() => irA("EditarTransferencias")}
            >
              <MaterialIcons name="edit" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Editar{"\n"}transferencias</Text>
            </TouchableOpacity>

       
            <TouchableOpacity 
              style={estilos.botonOpcion} 
              onPress={() => irA("ListaFiltrada")}
            >
              <Ionicons name="list-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Listado{"\n"}filtrado</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      
      <View style={estilos.barraInferior}>
        
        
        <TouchableOpacity style={estilos.icono} onPress={() => Alert.alert("Perfil", "Próximamente")}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => irA("Presupuestos")}>
          <Ionicons name="document-text-outline" size={26} color="gray" />
        </TouchableOpacity>

        
        <TouchableOpacity style={estilos.botonCentral} activeOpacity={1}>
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
  cuerpo: { paddingHorizontal: 16, marginTop: 20, flex: 1 },
  cajaBlanca: {
    flex: 1,
    // Quitamos el fondo blanco gigante para que se vea más limpio el grid flotando
    // backgroundColor: color.tarjeta, 
    borderRadius: 16,
    // padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  gridOpciones: {
    width: "100%",
    maxWidth: 400, 
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  botonOpcion: {
    backgroundColor: color.verde,
    width: "48%", 
    aspectRatio: 1, 
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  textoOpcion: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
  },
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
  icono: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10
  },
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
});