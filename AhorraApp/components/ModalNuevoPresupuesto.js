import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

export default function ModalNuevoPresupuesto({ visible, onClose, onGuardar }) {
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");

  const handleGuardar = () => {
    if(categoria && monto){
      onGuardar({ categoria, monto });
      setCategoria("");
      setMonto("");
      onClose();
    } else {
      alert("Completa todos los campos");
    }
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <View style={styles.header}>
            <Text style={styles.titulo}>Nuevo Presupuesto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={monto} onChangeText={setMonto} />
            </View>
          </View>

          <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
            <Text style={styles.textoBoton}>Agregar Presupuesto</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
},
  modal: { 
    width: "85%", 
    backgroundColor: "white", 
    borderRadius: 20, 
    padding: 20, 
    elevation: 10 
},
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20 
},
  titulo: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: color.texto 
},
  body: { 
    marginBottom: 20 
},
  inputGroup: { 
    marginBottom: 15 
},
  label: { 
    fontSize: 13, 
    marginBottom: 5, 
    color: color.textoSuave 
},
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    height: 45 
},
  boton: { 
    backgroundColor: color.verde, 
    paddingVertical: 12, 
    borderRadius: 15, 
    alignItems: "center" 
},
  textoBoton: {
     color: "white", 
     fontSize: 16, 
     fontWeight: "bold" 
    },
});
