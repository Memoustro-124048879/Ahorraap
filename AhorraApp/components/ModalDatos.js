
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};


const DatoFila = ({ label, valor, icono }) => (
  <View style={estilos.datoFila}>
    <View style={estilos.datoIcono}>
      <Ionicons name={icono} size={20} color={color.verde} />
    </View>
    <View>
      <Text style={estilos.datoLabel}>{label}</Text>
      <Text style={estilos.datoValor}>{valor}</Text>
    </View>
  </View>
);

export default function ModalDatos({ visible, onClose, onEdit }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>
          
          
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>Mis Datos</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

       
          <View style={estilos.modalBody}>
            <DatoFila label="Nombre Completo" valor="Tony Developer" icono="person" />
            <DatoFila label="Correo Electrónico" valor="tony@ahorraapp.com" icono="mail" />
            <DatoFila label="Teléfono" valor="+52 55 1234 5678" icono="call" />
            <DatoFila label="ID de Usuario" valor="#8839201" icono="finger-print" />
          </View>

          <TouchableOpacity style={estilos.botonModal} onPress={onEdit}>
            <Text style={estilos.textoBotonModal}>Editar Información</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 4},
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.texto,
  },
  modalBody: {
    marginBottom: 20,
  },
  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  datoIcono: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f9f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  datoLabel: {
    fontSize: 12,
    color: color.textoSuave,
    fontWeight: '600',
  },
  datoValor: {
    fontSize: 16,
    color: color.texto,
    fontWeight: '500',
  },
  botonModal: {
    backgroundColor: color.verde,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotonModal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});