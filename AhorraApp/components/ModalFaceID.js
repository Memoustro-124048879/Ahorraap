import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

export default function ModalFaceID({ visible, onClose }) {
  const [faceID, setFaceID] = useState(true);

  
  const handleGuardar = () => {
    
    const estado = faceID ? "activada" : "desactivada";
    Alert.alert("Seguridad", `Autenticación biométrica ${estado}.`);
    onClose(); 
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Face ID / Touch ID</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={estilos.modalBody}>
            <View style={estilos.row}>
              <Text style={estilos.label}>Activar autenticación biométrica</Text>
              
             
              <Switch 
                trackColor={{ false: "#767577", true: "#a5d6b6" }}
                thumbColor={faceID ? color.verde : "#f4f3f4"}
                value={faceID} 
                onValueChange={setFaceID} 
              />
            </View>
          </View>

          <TouchableOpacity style={estilos.botonModal} onPress={handleGuardar}>
            <Text style={estilos.textoBotonModal}>Guardar</Text>
          </TouchableOpacity>

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
    alignItems: "center"
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.texto
  },
  modalBody: {
    marginBottom: 25
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
  },
  label: {
    fontSize: 16,
    color: color.texto,
    flex: 1, 
    marginRight: 10
  },
  botonModal: {
    backgroundColor: color.verde,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center"
  },
  textoBotonModal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }
});