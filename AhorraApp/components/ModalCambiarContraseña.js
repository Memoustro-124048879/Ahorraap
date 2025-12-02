import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

export default function ModalCambiarContrasena({ visible, onClose }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleGuardar = () => {
    // 1. Validar campos vacíos
    if (!actual.trim() || !nueva.trim() || !confirmar.trim()) {
      Alert.alert("Campos incompletos", "Por favor, llena todos los campos para continuar.");
      return;
    }

    // 2. Validar que la nueva contraseña coincida con la confirmación
    if (nueva !== confirmar) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden. Inténtalo de nuevo.");
      return;
    }

    // 3. Simular éxito
    Alert.alert(
      "Éxito", 
      "Contraseña actualizada correctamente.",
      [
        {
          text: "OK", 
          onPress: () => {
            
            setActual("");
            setNueva("");
            setConfirmar("");
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={estilos.modalBody}>

            <View style={estilos.inputGroup}>
              <Text style={estilos.inputLabel}>Contraseña Actual</Text>
              <TextInput
                style={estilos.input}
                secureTextEntry
                placeholder="********"
                placeholderTextColor="#ccc"
                value={actual}
                onChangeText={setActual}
              />
            </View>

            <View style={estilos.inputGroup}>
              <Text style={estilos.inputLabel}>Nueva Contraseña</Text>
              <TextInput
                style={estilos.input}
                secureTextEntry
                placeholder="********"
                placeholderTextColor="#ccc"
                value={nueva}
                onChangeText={setNueva}
              />
            </View>

            <View style={estilos.inputGroup}>
              <Text style={estilos.inputLabel}>Confirmar Contraseña</Text>
              <TextInput
                style={estilos.input}
                secureTextEntry
                placeholder="********"
                placeholderTextColor="#ccc"
                value={confirmar}
                onChangeText={setConfirmar}
              />
            </View>

          </View>

          <TouchableOpacity style={estilos.botonModal} onPress={handleGuardar}>
            <Text style={estilos.textoBotonModal}>Guardar Cambios</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.texto,
  },
  modalBody: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 5,
    color: color.textoSuave
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    color: color.texto,
  },
  botonModal: {
    backgroundColor: color.verde,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  textoBotonModal: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});