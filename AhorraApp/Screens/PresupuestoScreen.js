import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Modales
import ModalNuevoPresupuesto from '../components/ModalNuevoPresupuesto';
import ModalEditarPresupuesto from '../components/ModalEditarPresupuesto';
import ModalNotificacionesGeneral from '../components/ModalNotificacionesGeneral';
import ModalConfiguracion from '../components/ModalConfiguracion';

// Controlador de Base de Datos
import { 
  obtenerPresupuestos, 
  agregarPresupuesto, 
  editarPresupuesto, 
  eliminarPresupuesto 
} from '../controllers/PresupuestoController';

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458", 
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
  itemVerde: '#d4edda',
  textoEditar: '#6cbd86',
  botonAgregar: '#2DA458', // Ajustado para que se vea fuerte el botón
};

function Encabezado({ titulo, abrirNotificaciones, abrirConfiguraciones, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>
          <Text style={{ fontSize:24 }}>🏦</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>
        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={abrirNotificaciones}>
            <Ionicons name="notifications-outline" size={24} color={color.verde} />
          </TouchableOpacity>
          <TouchableOpacity onPress={abrirConfiguraciones}>
            <Ionicons name="settings-outline" size={24} color={color.verde} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PresupuestoScreen({ navigation }) {
  const [notiVisible, setNotiVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const notificaciones = ["Nuevo ingreso registrado", "Presupuesto superado en Supermercado"];

  // ESTADO DE PRESUPUESTOS (Desde BD)
  const [presupuestos, setPresupuestos] = useState([]);

  // Modales
  const [modalNuevoVisible, setModalNuevoVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

  // CARGAR DATOS AL ENTRAR
  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = () => {
    obtenerPresupuestos((datos) => {
      setPresupuestos(datos);
    });
  };

  // --- FUNCIONES CRUD ---

  const handleGuardarNuevo = ({ categoria, monto }) => {
    agregarPresupuesto(categoria, monto, () => {
      Alert.alert("Éxito", "Presupuesto agregado correctamente.");
      cargarDatos(); // Recargar lista
      setModalNuevoVisible(false);
    });
  };

  const handleGuardarEdicion = ({ id, categoria, monto }) => {
    editarPresupuesto(id, categoria, monto, () => {
      Alert.alert("Actualizado", "Presupuesto modificado correctamente.");
      cargarDatos();
      setModalEditarVisible(false);
    });
  };

  const handleEliminar = (id) => {
    Alert.alert(
      "Eliminar Presupuesto",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            eliminarPresupuesto(id, () => {
              cargarDatos();
            });
          }
        }
      ]
    );
  };

  const abrirEditor = (item) => {
    setPresupuestoSeleccionado(item);
    setModalEditarVisible(true);
  };

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado 
        titulo="Mis Presupuestos" 
        abrirNotificaciones={()=> setNotiVisible(true)} 
        abrirConfiguraciones={()=>setConfigVisible(true)}
      />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={estilos.headerSection}>
          <Text style={estilos.subtitulo}>Presupuestos Mensuales</Text>
          <TouchableOpacity>
             <Ionicons name="filter" size={20} color={color.verde} />
          </TouchableOpacity>
        </View>

        {/* LISTA DE PRESUPUESTOS */}
        <View style={estilos.listaContainer}>
          {presupuestos.length === 0 ? (
             <Text style={{textAlign:'center', color:'#999', marginTop: 20}}>No tienes presupuestos aún.</Text>
          ) : (
            presupuestos.map((item) => (
              <View key={item.id} style={estilos.cardPresupuesto}>
                <View style={estilos.barraLateral} />
                <View style={estilos.cardContent}>
                  <View>
                    <Text style={estilos.categoriaTexto}>{item.categoria}</Text>
                    <Text style={estilos.montoTexto}>${item.monto.toLocaleString()} <Text style={{fontSize:12, color:'#999'}}>MXN</Text></Text>
                  </View>

                  <View style={estilos.acciones}>
                    <TouchableOpacity style={estilos.btnIcono} onPress={() => abrirEditor(item)}>
                      <MaterialIcons name="edit" size={22} color={color.verde} />
                    </TouchableOpacity>

                    <TouchableOpacity style={estilos.btnIcono} onPress={() => handleEliminar(item.id)}>
                      <MaterialIcons name="delete-outline" size={22} color={color.rojo} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity 
          style={estilos.botonAgregar}
          onPress={() => setModalNuevoVisible(true)} 
        >
          <Ionicons name="add-circle-outline" size={24} color="white" style={{marginRight: 8}}/>
          <Text style={estilos.textoBoton}>Nuevo Presupuesto</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- MODALES --- */}
      <ModalNuevoPresupuesto
        visible={modalNuevoVisible}
        onClose={() => setModalNuevoVisible(false)}
        onGuardar={handleGuardarNuevo} // Conectado a BD
      />

      <ModalEditarPresupuesto
        visible={modalEditarVisible}
        presupuesto={presupuestoSeleccionado}
        onClose={() => setModalEditarVisible(false)}
        onGuardar={handleGuardarEdicion} // Conectado a BD
      />

      <ModalNotificacionesGeneral
        visible={notiVisible}
        onClose={() => setNotiVisible(false)}
        notificaciones={notificaciones}
      />

      <ModalConfiguracion
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        navigation={navigation}
      />

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
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listaContainer: { gap: 15 },
  cardPresupuesto: { backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', overflow: 'hidden', elevation: 2, height: 80 },
  barraLateral: { width: 6, backgroundColor: color.verde, height: '100%' },
  cardContent: { flex: 1, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoriaTexto: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  montoTexto: { fontSize: 18, fontWeight: 'bold', color: color.verde },
  acciones: { flexDirection: 'row', gap: 15 },
  btnIcono: { padding: 5 },
  botonAgregar: { backgroundColor: color.botonAgregar, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 25, marginTop: 30, elevation: 4 },
  textoBoton: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});