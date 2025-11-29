import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function ModalHistorial({ visible, onClose }) {

  const historialFalso = [
    { id: "1", descripcion: "Pago Oxxo", monto: -150 },
    { id: "2", descripcion: "Depósito Nómina", monto: 3500 },
    { id: "3", descripcion: "Spotify", monto: -129 },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <Text style={styles.titulo}>Historial de Transacciones</Text>

          <FlatList
            data={historialFalso}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTexto}>{item.descripcion}</Text>
                <Text style={[styles.monto, { color: item.monto > 0 ? "green" : "red" }]}>
                  {item.monto} MXN
                </Text>
              </View>
            )}
          />

          <TouchableOpacity style={styles.btnCerrar} onPress={onClose}>
            <Text style={styles.btnCerrarTexto}>Cerrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.4,
    borderColor: "#ccc",
  },
  itemTexto: { fontSize: 16 },
  monto: { fontSize: 16, fontWeight: "bold" },
  btnCerrar: {
    backgroundColor: "#2DA458",
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  btnCerrarTexto: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
