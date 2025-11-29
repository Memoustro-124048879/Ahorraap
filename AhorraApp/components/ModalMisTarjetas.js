import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

const TarjetaItem = ({ nombre, terminacion, tipo }) => (
  <View style={estilos.itemFila}>
    <View style={estilos.itemIcono}>
      <Ionicons name={tipo === "debito" ? "card" : "card-outline"} size={22} color={color.verde} />
    </View>

    <View>
      <Text style={estilos.itemTitulo}>{nombre}</Text>
      <Text style={estilos.itemSub}>{`Terminación •••• ${terminacion}`}</Text>
    </View>
  </View>
);

export default function ModalMisTarjetas({ visible, onClose, onAdd }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

          {/* Header */}
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Mis Tarjetas</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Listado */}
          <View style={estilos.modalBody}>
            <TarjetaItem nombre="Bancomer" terminacion="9821" tipo="debito" />
            <TarjetaItem nombre="Santander" terminacion="4432" tipo="credito" />
          </View>

          {/* Botón */}
          <TouchableOpacity style={estilos.botonModal} onPress={onAdd}>
            <Text style={estilos.textoBotonModal}>Agregar Tarjeta</Text>
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
    alignItems: "center",
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
  itemFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  itemIcono: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f9f4",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  itemTitulo: {
    fontSize: 16,
    color: color.texto,
    fontWeight: "600",
  },
  itemSub: {
    fontSize: 12,
    color: color.textoSuave,
  },
  botonModal: {
    backgroundColor: color.verde,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotonModal: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
