import React, { useState, useEffect } from "react";
import { 
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


import { 
  obtenerTodasLasTransacciones, 
  editarTransaccion, 
  eliminarTransaccion 
} from "../controllers/FinanzasController";

const color = {
  verde: "#2DA458", texto: "#101010", textoSuave: "#666",
  rojo: "#e74c3c", inputFondo: "#f5f5f5"
};

export default function ModalEditarTransacciones({ visible, onClose }) {
  
  const [modo, setModo] = useState('lista');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [transacciones, setTransacciones] = useState([]);

  
  const [formTitulo, setFormTitulo] = useState('');
  const [formMonto, setFormMonto] = useState('');
  const [formCategoria, setFormCategoria] = useState('');
  const [formFecha, setFormFecha] = useState('');

  
  useEffect(() => {
    if (visible) {
      cargarDatos();
      setModo('lista');
    }
  }, [visible]);

  const cargarDatos = () => {
    obtenerTodasLasTransacciones((datos) => setTransacciones(datos));
  };

  const abrirEditor = (item) => {
    setItemSeleccionado(item);
    setFormTitulo(item.titulo); 
    setFormMonto(item.monto.toString());
    setFormCategoria(item.categoria);
    setFormFecha(item.fecha);
    setModo('editar');
  };

  const handleGuardarCambios = () => {
    if (!formTitulo || !formMonto) {
      Alert.alert("Error", "Campos vacíos");
      return;
    }

    const datosEditados = {
      tipo: itemSeleccionado.tipo,
      monto: formMonto,
      categoria: formCategoria,
      descripcion: formTitulo, 
      fecha: formFecha,
      metodoPago: itemSeleccionado.descripcion 
    };

    
    editarTransaccion(itemSeleccionado.id, datosEditados, () => {
      Alert.alert("Éxito", "Transacción actualizada.");
      cargarDatos(); 
      setModo('lista');
    });
  };

  const handleEliminar = (id) => {
    Alert.alert(
      "Eliminar",
      "¿Seguro que deseas borrar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            // LLAMA A LA BD
            eliminarTransaccion(id, () => {
              cargarDatos(); 
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={estilos.fila}>
      <View style={estilos.info}>
        <Text style={estilos.tituloItem}>{item.titulo}</Text>
        <Text style={estilos.subtituloItem}>{item.fecha} • {item.categoria}</Text>
        <Text style={[
          estilos.montoItem, 
          { color: item.tipo === 'gasto' ? color.rojo : color.verde }
        ]}>
          {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
        </Text>
      </View>
      <View style={estilos.acciones}>
        <TouchableOpacity onPress={() => abrirEditor(item)} style={estilos.btnAccion}>
          <MaterialIcons name="edit" size={24} color={color.verde} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEliminar(item.id)} style={estilos.btnAccion}>
          <Ionicons name="trash-outline" size={24} color={color.rojo} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>
          
          <View style={estilos.modalHeader}>
            {modo === 'editar' ? (
              <TouchableOpacity onPress={() => setModo('lista')}>
                <Ionicons name="arrow-back" size={28} color={color.texto} />
              </TouchableOpacity>
            ) : ( <View style={{width: 28}} /> )}
            <Text style={estilos.modalTitulo}>
              {modo === 'lista' ? 'Editar Transacciones' : 'Modificar'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          {modo === 'lista' ? (
            <FlatList
              data={transacciones}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <ScrollView>
              <Text style={estilos.label}>Concepto</Text>
              <TextInput style={estilos.input} value={formTitulo} onChangeText={setFormTitulo} />

              <Text style={estilos.label}>Monto</Text>
              <TextInput style={estilos.input} value={formMonto} onChangeText={setFormMonto} keyboardType="numeric" />

              <Text style={estilos.label}>Categoría</Text>
              <TextInput style={estilos.input} value={formCategoria} onChangeText={setFormCategoria} />

              <Text style={estilos.label}>Fecha (YYYY-MM-DD)</Text>
              <TextInput style={estilos.input} value={formFecha} onChangeText={setFormFecha} />

              <TouchableOpacity style={estilos.botonGuardar} onPress={handleGuardarCambios}>
                <Text style={estilos.textoBoton}>Guardar Cambios</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "white", borderRadius: 20, padding: 20, elevation: 10, maxHeight: '80%' },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 },
  modalTitulo: { fontSize: 18, fontWeight: "bold", color: color.texto },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  info: { flex: 1 },
  tituloItem: { fontSize: 16, fontWeight: '600', color: color.texto },
  subtituloItem: { fontSize: 12, color: color.textoSuave, marginTop: 2 },
  montoItem: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  acciones: { flexDirection: 'row', gap: 15 },
  btnAccion: { padding: 5 },
  label: { fontSize: 14, fontWeight: '600', color: color.textoSuave, marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: color.inputFondo, borderRadius: 10, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#eee', color: color.texto },
  botonGuardar: { backgroundColor: color.verde, borderRadius: 15, paddingVertical: 15, alignItems: "center", marginTop: 25 },
  textoBoton: { color: "white", fontSize: 16, fontWeight: "bold" },
});