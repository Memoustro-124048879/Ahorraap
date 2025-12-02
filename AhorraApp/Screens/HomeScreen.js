import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// --- MODALES ---
import ModalNuevaTransaccion from "../components/ModalNuevaTransaccion";
import ModalEditarTransacciones from "../components/ModalEditarTransacciones";
import ModalListadoTransacciones from "../components/ModalListadoTransacciones"; 
import ModalHistorial from "../components/ModalHistorial"; 
import ModalNotificacionesGeneral from "../components/ModalNotificacionesGeneral";
import ModalConfiguracion from "../components/ModalConfiguracion";

// --- CONTROLADORES ---
import { agregarTransaccion, obtenerSaldoTotal } from "../controllers/FinanzasController";

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458", 
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
};

function Encabezado({ titulo, abrirNotificaciones, abrirConfiguracion, saldo, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity><Text style={{fontSize:24}}>🏦</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
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

export default function HomeScreen({ navigation }) {
  
  const [saldoActual, setSaldoActual] = useState(0);
  
  
  const [modalNueva, setModalNueva] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalListado, setModalListado] = useState(false); 
  const [modalHistorial, setModalHistorial] = useState(false); 
  
  const [notiVisible, setNotiVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);

  const notificaciones = ["Nuevo ingreso registrado", "Presupuesto superado"];

  
  useFocusEffect(
    useCallback(() => {
      actualizarSaldo();
    }, [])
  );

  const actualizarSaldo = () => {
    obtenerSaldoTotal((total) => setSaldoActual(total));
  };

  const handleGuardarTransaccion = (datos) => {
    agregarTransaccion(datos, () => {
      Alert.alert("Éxito", "Transacción guardada correctamente.");
      setModalNueva(false);
      actualizarSaldo(); 
    });
  };

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado 
        titulo="Mis Transacciones" 
        abrirNotificaciones={() => setNotiVisible(true)} 
        abrirConfiguracion={() => setConfigVisible(true)}
        saldo={saldoActual}
      />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={estilos.gridOpciones}>
            
            {/* BOTÓN 1: HISTORIAL SIMPLE */}
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => setModalHistorial(true)}>
              <Ionicons name="reload-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Historial de{"\n"}transacciones</Text>
            </TouchableOpacity>

            {/* BOTÓN 2: NUEVA TRANSACCIÓN */}
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => setModalNueva(true)}>
               <FontAwesome5 name="exchange-alt" size={30} color="white" />
              <Text style={estilos.textoOpcion}>Nueva{"\n"}transacción</Text>
            </TouchableOpacity>

            {/* BOTÓN 3: EDITAR / ELIMINAR */}
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => setModalEditar(true)}>
              <MaterialIcons name="edit" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Editar{"\n"}transacciones</Text>
            </TouchableOpacity>

            {/* BOTÓN 4: LISTADO CON FILTROS */}
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => setModalListado(true)}>
              <Ionicons name="list-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Listado de{"\n"}transacciones</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>

      {/* --- MODALES --- */}
      
      <ModalNuevaTransaccion 
        visible={modalNueva} 
        onClose={() => setModalNueva(false)} 
        onSave={handleGuardarTransaccion} 
        saldoDisponible={saldoActual} 
      />

      {/* Modal Filtros (Botón 4) */}
      <ModalListadoTransacciones 
        visible={modalListado} 
        onClose={() => setModalListado(false)} 
      />
      
      {/* Modal Simple (Botón 1) */}
      <ModalHistorial 
        visible={modalHistorial} 
        onClose={() => setModalHistorial(false)} 
      />

      {/* Modal Edición (Botón 3) */}
      <ModalEditarTransacciones 
        visible={modalEditar} 
        onClose={() => {
          setModalEditar(false);
          actualizarSaldo(); 
        }} 
      />

      <ModalNotificacionesGeneral visible={notiVisible} onClose={() => setNotiVisible(false)} notificaciones={notificaciones} />
      <ModalConfiguracion visible={configVisible} onClose={() => setConfigVisible(false)} navigation={navigation} />
      
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  scrollContent: { padding: 16, paddingBottom: 100 }, 
  encabezado: { backgroundColor: color.verde, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 16, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, zIndex: 1 },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: { backgroundColor: color.tarjeta, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", elevation: 5 },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: '600' },
  gridOpciones: { marginTop: 20, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  botonOpcion: { backgroundColor: color.verde, width: "47%", aspectRatio: 1, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 20, elevation: 4 },
  textoOpcion: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 14, marginTop: 10 },
});