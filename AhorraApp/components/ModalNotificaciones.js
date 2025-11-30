import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

export default function ModalNotificaciones({ visible, onClose }) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar en la base de datos
    Alert.alert("Éxito", "Configuración de notificaciones guardada.");
    onClose(); // <--- ESTO CIERRA EL MODAL
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Notificaciones</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={estilos.modalBody}>
            
            {/* Opción 1: Push */}
            <View style={estilos.row}>
              <Text style={estilos.label}>Notificaciones Push</Text>
              <Switch 
                trackColor={{ false: "#767577", true: "#a5d6b6" }}
                thumbColor={push ? color.verde : "#f4f3f4"}
                value={push} 
                onValueChange={setPush} 
              />
            </View>

            {/* Opción 2: Email */}
            <View style={estilos.row}>
              <Text style={estilos.label}>Notificaciones por Email</Text>
              <Switch 
                trackColor={{ false: "#767577", true: "#a5d6b6" }}
                thumbColor={email ? color.verde : "#f4f3f4"}
                value={email} 
                onValueChange={setEmail} 
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
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.texto
  },
  modalBody: {
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: color.texto,
    fontWeight: '500'
  },
  botonModal: {
    backgroundColor: color.verde,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center"
  },
  textoBotonModal: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold"
  }
});