import React, { useState, useEffect } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert, 
  ScrollView 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
  inputFondo: "#f5f5f5",
};

export default function ModalEditarTransacciones({ visible, onClose }) {
  
  // 1. MODOS: 'lista' (ver todas) o 'editar' (formulario)
  const [modo, setModo] = useState('lista');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  // 2. DATOS DE EJEMPLO (Simulando BD)
  const [transacciones, setTransacciones] = useState([
    { id: '1', titulo: 'Pago Netflix', monto: '-199', fecha: '29 Nov', categoria: 'Entretenimiento' },
    { id: '2', titulo: 'Nómina', monto: '8,500', fecha: '30 Nov', categoria: 'Salario' },
    { id: '3', titulo: 'Cena Tacos', monto: '-450', fecha: '01 Dic', categoria: 'Comida' },
  ]);

  // 3. ESTADOS DEL FORMULARIO
  const [formTitulo, setFormTitulo] = useState('');
  const [formMonto, setFormMonto] = useState('');
  const [formCategoria, setFormCategoria] = useState('');

  // --- LÓGICA ---

  // Preparar formulario para editar
  const abrirEditor = (item) => {
    setItemSeleccionado(item);
    setFormTitulo(item.titulo);
    setFormMonto(item.monto);
    setFormCategoria(item.categoria);
    setModo('editar');
  };

  // Guardar cambios
  const guardarCambios = () => {
    if (!formTitulo || !formMonto) {
      Alert.alert("Error", "Los campos no pueden estar vacíos");
      return;
    }

    const listaActualizada = transacciones.map(t => 
      t.id === itemSeleccionado.id 
        ? { ...t, titulo: formTitulo, monto: formMonto, categoria: formCategoria }
        : t
    );

    setTransacciones(listaActualizada);
    setModo('lista'); // Volver a la lista
    Alert.alert("Actualizado", "La transacción se modificó correctamente.");
  };

  // Eliminar item
  const eliminarTransaccion = (id) => {
    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro? Se borrará del registro.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => setTransacciones(transacciones.filter(t => t.id !== id))
        }
      ]
    );
  };

  // RENDERIZAR CADA FILA
  const renderItem = ({ item }) => (
    <View style={estilos.fila}>
      <View style={estilos.info}>
        <Text style={estilos.tituloItem}>{item.titulo}</Text>
        <Text style={estilos.subtituloItem}>{item.fecha} • {item.categoria}</Text>
        <Text style={[
          estilos.montoItem, 
          { color: item.monto.includes('-') ? color.rojo : color.verde }
        ]}>
          ${item.monto}
        </Text>
      </View>

      <View style={estilos.acciones}>
        {/* Botón Editar */}
        <TouchableOpacity onPress={() => abrirEditor(item)} style={estilos.btnAccion}>
          <MaterialIcons name="edit" size={24} color={color.verde} />
        </TouchableOpacity>
        
        {/* Botón Eliminar */}
        <TouchableOpacity onPress={() => eliminarTransaccion(item.id)} style={estilos.btnAccion}>
          <Ionicons name="trash-outline" size={24} color={color.rojo} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>
          
          {/* HEADER CON BOTÓN ATRÁS (Si estamos editando) */}
          <View style={estilos.modalHeader}>
            {modo === 'editar' ? (
              <TouchableOpacity onPress={() => setModo('lista')}>
                <Ionicons name="arrow-back" size={28} color={color.texto} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 28}} /> // Espacio vacío para centrar
            )}

            <Text style={estilos.modalTitulo}>
              {modo === 'lista' ? 'Editar Transacciones' : 'Modificar Datos'}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* --- CONTENIDO DINÁMICO --- */}
          
          {modo === 'lista' ? (
            // VISTA 1: LISTA
            <FlatList
              data={transacciones}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={estilos.vacio}>No hay transacciones recientes.</Text>
              }
            />
          ) : (
            // VISTA 2: FORMULARIO DE EDICIÓN
            <ScrollView>
              <Text style={estilos.label}>Concepto</Text>
              <TextInput 
                style={estilos.input} 
                value={formTitulo} 
                onChangeText={setFormTitulo} 
              />

              <Text style={estilos.label}>Monto</Text>
              <TextInput 
                style={estilos.input} 
                value={formMonto} 
                onChangeText={setFormMonto} 
                keyboardType="numeric"
              />

              <Text style={estilos.label}>Categoría</Text>
              <TextInput 
                style={estilos.input} 
                value={formCategoria} 
                onChangeText={setFormCategoria} 
              />

              <TouchableOpacity style={estilos.botonGuardar} onPress={guardarCambios}>
                <Text style={estilos.textoBoton}>Guardar Cambios</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.texto,
  },
  
  // Estilos de la Lista
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  info: {
    flex: 1,
  },
  tituloItem: {
    fontSize: 16,
    fontWeight: '600',
    color: color.texto,
  },
  subtituloItem: {
    fontSize: 12,
    color: color.textoSuave,
    marginTop: 2,
  },
  montoItem: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  btnAccion: {
    padding: 5,
  },
  vacio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },

  // Estilos del Formulario
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textoSuave,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: color.inputFondo,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
    color: color.texto,
  },
  botonGuardar: {
    backgroundColor: color.verde,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 25,
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});