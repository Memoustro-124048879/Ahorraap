import React, { useState } from "react";
import {Modal,View,Text,TextInput,TouchableOpacity,StyleSheet,Platform,ScrollView,Alert} from "react-native";

export default function ModalEditarTransacciones({
  visible,
  onClose,
  onSave,
}) {
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

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

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* TIPO */}
            <TextInput
              style={styles.modalInput}
              placeholder="Tipo (Ingreso / Gasto)"
              placeholderTextColor="#777"
              value={tipo}
              onChangeText={setTipo}
              multiline={false}
            />

            {/* MONTO */}
            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
              multiline={false}
            />

            {/* CATEGORÍA */}
            <TextInput
              style={styles.modalInput}
              placeholder="Categoría (Comida, transporte...)"
              placeholderTextColor="#777"
              value={categoria}
              onChangeText={setCategoria}
              multiline={false}
            />

            {/* DESCRIPCIÓN */}
            <TextInput
              style={[styles.modalInput, styles.largeInput]}
              placeholder="Descripción"
              placeholderTextColor="#777"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              scrollEnabled
            />

            {/* FECHA */}
            <TextInput
              style={styles.modalInput}
              placeholder="Fecha (YYYY-MM-DD)"
              placeholderTextColor="#777"
              value={fecha}
              onChangeText={setFecha}
              multiline={false}
            />

            {/* MÉTODO DE PAGO */}
            <TextInput
              style={styles.modalInput}
              placeholder="Método de pago (Efectivo / Tarjeta / Transferencia)"
              placeholderTextColor="#777"
              value={metodoPago}
              onChangeText={setMetodoPago}
              multiline={false}
            />
          </ScrollView>

          {/* BOTONES */}
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
                if (!tipo || !monto || !categoria || !descripcion || !fecha || !metodoPago) {
                      if (Platform.OS === "web") {
                        window.alert("Por favor completa todos los campos.");
                      } else {
                            Alert.alert("Error", "Por favor completa todos los campos.");
                      }
                return; 
                }
                onSave({
                  tipo,
                  monto,
                  categoria,
                  descripcion,
                  fecha,
                  metodoPago,
                });
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
    width: "88%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#F4F4F4",
    color: "#000",
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    textAlignVertical: "center",
  },
  largeInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 15,
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
