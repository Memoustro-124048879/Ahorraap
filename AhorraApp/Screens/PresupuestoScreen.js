import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Modales
import ModalNuevoPresupuesto from '../components/ModalNuevoPresupuesto';
import ModalEditarPresupuesto from '../components/ModalEditarPresupuesto';
import ModalNotificacionesGeneral from '../components/ModalNotificacionesGeneral';
import ModalConfiguracion from '../components/ModalConfiguracion';
import ModalFiltroPresupuesto from '../components/ModalFiltroPresupuesto'; 

// Controladores
import { obtenerPresupuestos, agregarPresupuesto, editarPresupuesto, eliminarPresupuesto } from '../controllers/PresupuestoController';
import { obtenerSaldoTotal } from '../controllers/FinanzasController';

const color = {
  fondo: "#f1f2f3", verde: "#2DA458", tarjeta: "#ffffff", texto: "#101010", textoSuave: "#666", rojo: "#e74c3c", itemVerde: '#d4edda', textoEditar: '#6cbd86', botonAgregar: '#2DA458',
};

function Encabezado({ titulo, abrirNotificaciones, abrirConfiguraciones, saldo, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity><Text style={{ fontSize:24 }}>🏦</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX", {minimumFractionDigits: 2})}</Text>
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
  const notificaciones = ["Nuevo ingreso registrado", "Presupuesto superado"];

  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestosFiltrados, setPresupuestosFiltrados] = useState([]); 
  const [saldoActual, setSaldoActual] = useState(0);
  
  const [modalNuevoVisible, setModalNuevoVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false); 
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  
  const [filtroActivo, setFiltroActivo] = useState(null); 

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = () => {
    obtenerPresupuestos((datos) => {
      setPresupuestos(datos);
      setPresupuestosFiltrados(datos); 
      setFiltroActivo(null); 
    });
    obtenerSaldoTotal((total) => setSaldoActual(total));
  };

  // --- LÓGICA DE FILTRADO ---
  const aplicarFiltro = (filtro) => {
    setFiltroActivo(filtro);
    
    if (!filtro) {
      setPresupuestosFiltrados(presupuestos); 
      return;
    }

    const filtrados = presupuestos.filter(item => {
      if (filtro.tipo === 'categoria') {
        return item.categoria === filtro.valor;
      }
      if (filtro.tipo === 'fecha') {
        return item.fecha.startsWith(filtro.valor); 
      }
      return true;
    });
    setPresupuestosFiltrados(filtrados);
  };

  const handleGuardarNuevo = ({ categoria, monto, fecha }) => {
    agregarPresupuesto(categoria, monto, fecha, () => {
      Alert.alert("Éxito", "Presupuesto agregado.");
      cargarDatos(); 
      setModalNuevoVisible(false);
    });
  };

  const handleGuardarEdicion = ({ id, categoria, monto, fecha }) => {
    editarPresupuesto(id, categoria, monto, fecha, () => {
      Alert.alert("Actualizado", "Presupuesto modificado.");
      cargarDatos();
      setModalEditarVisible(false);
    });
  };

  const handleEliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => eliminarPresupuesto(id, cargarDatos) }
    ]);
  };

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado 
        titulo="Mis Presupuestos" 
        abrirNotificaciones={()=> setNotiVisible(true)} 
        abrirConfiguraciones={()=>setConfigVisible(true)} 
        saldo={saldoActual}
      />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={estilos.headerSection}>
          <Text style={estilos.subtitulo}>Presupuestos Mensuales</Text>
          <TouchableOpacity onPress={() => setModalFiltroVisible(true)}>
             <Ionicons name={filtroActivo ? "filter" : "filter-outline"} size={24} color={color.verde} />
          </TouchableOpacity>
        </View>

       
        {filtroActivo && (
          <View style={estilos.chipFiltro}>
            <Text style={{color:'white', marginRight: 5}}>Filtrado por: {filtroActivo.valor}</Text>
            <TouchableOpacity onPress={() => aplicarFiltro(null)}>
               <Ionicons name="close-circle" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}

        
        <View style={estilos.listaContainer}>
          {presupuestosFiltrados.length === 0 ? (
             <Text style={{textAlign:'center', color:'#999', marginTop: 20}}>No hay presupuestos.</Text>
          ) : (
            presupuestosFiltrados.map((item) => (
              <View key={item.id} style={estilos.cardPresupuesto}>
                <View style={estilos.barraLateral} />
                <View style={estilos.cardContent}>
                  <View>
                    <Text style={estilos.categoriaTexto}>{item.categoria}</Text>
                    <Text style={estilos.montoTexto}>${item.monto.toLocaleString()} <Text style={{fontSize:12, color:'#999'}}>MXN</Text></Text>
                    <Text style={{fontSize:12, color:color.textoSuave, marginTop:2}}>Vence: {item.fecha}</Text>
                  </View>
                  <View style={estilos.acciones}>
                    <TouchableOpacity style={estilos.btnIcono} onPress={() => { setPresupuestoSeleccionado(item); setModalEditarVisible(true); }}>
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

        <TouchableOpacity style={estilos.botonAgregar} onPress={() => setModalNuevoVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="white" style={{marginRight: 8}}/>
          <Text style={estilos.textoBoton}>Nuevo Presupuesto</Text>
        </TouchableOpacity>
      </ScrollView>

     
      <ModalFiltroPresupuesto 
        visible={modalFiltroVisible} 
        onClose={() => setModalFiltroVisible(false)} 
        datos={presupuestos} 
        onAplicar={aplicarFiltro} 
      />
      <ModalNuevoPresupuesto visible={modalNuevoVisible} onClose={() => setModalNuevoVisible(false)} onGuardar={handleGuardarNuevo} />
      <ModalEditarPresupuesto visible={modalEditarVisible} presupuesto={presupuestoSeleccionado} onClose={() => setModalEditarVisible(false)} onGuardar={handleGuardarEdicion} />
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listaContainer: { gap: 15 },
  cardPresupuesto: { backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', overflow: 'hidden', elevation: 2, height: 90 },
  barraLateral: { width: 6, backgroundColor: color.verde, height: '100%' },
  cardContent: { flex: 1, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoriaTexto: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  montoTexto: { fontSize: 18, fontWeight: 'bold', color: color.verde },
  acciones: { flexDirection: 'row', gap: 15 },
  btnIcono: { padding: 5 },
  botonAgregar: { backgroundColor: color.botonAgregar, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 25, marginTop: 30, elevation: 4 },
  textoBoton: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
 
  chipFiltro: {
    flexDirection: 'row',
    backgroundColor: color.verde,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15
  }
});