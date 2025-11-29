import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

const MesItem = ({ mes, monto }) => (
  <View style={estilos.itemFila}>
    <View style={estilos.itemIcono}>
      <Ionicons name="document-text" size={22} color={color.verde} />
    </View>

    <View>
      <Text style={estilos.itemTitulo}>{mes}</Text>
      <Text style={estilos.itemSub}>{`Gastos totales: $${monto}`}</Text>
    </View>
  </View>
);

export default function ModalExtractos({ visible, onClose }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

          {/* Header */}
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Extractos Mensuales</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={estilos.modalBody}>
            <MesItem mes="Enero 2025" monto="2,380" />
            <MesItem mes="Febrero 2025" monto="1,950" />
            <MesItem mes="Marzo 2025" monto="3,420" />
          </View>

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
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    color: color.texto,
    fontWeight: "bold",
  },
  modalBody: {
    marginBottom: 20,
  },
  itemFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemIcono: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f9f4",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemSub: {
    fontSize: 12,
    color: color.textoSuave,
  }
});
