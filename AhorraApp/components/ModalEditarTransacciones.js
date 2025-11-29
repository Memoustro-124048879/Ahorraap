import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function ModalEditarTransacciones({
  visible,
  onClose,
  onSave,
  transaccion = {}
}) {
  const [monto, setMonto] = useState(transaccion.monto || "");
  const [descripcion, setDescripcion] = useState(transaccion.descripcion || "");
  const [categoria, setCategoria] = useState(transaccion.categoria || "");
  const [fecha, setFecha] = useState(transaccion.fecha || "");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>Editar Transacción</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Monto"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Categoría"
            value={categoria}
            onChangeText={setCategoria}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Fecha (YYYY-MM-DD)"
            value={fecha}
            onChangeText={setFecha}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#777" }]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                onSave({ monto, descripcion, categoria, fecha });
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
