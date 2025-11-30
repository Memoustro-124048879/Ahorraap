// components/ModalNotificacionesGeneral.js
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  fondoModal: "#f1f2f3",
  tarjeta: "#ffffff",
  texto: "#101010",
  verde: "#2DA458",
  rojo: "#e74c3c",
  amarillo: "#f1c40f"
};

export default function ModalNotificacionesGeneral({ visible, onClose, notificaciones = [] }) {
  const getIconColor = (mensaje) => {
    if (mensaje.toLowerCase().includes('ingreso')) return color.verde;
    if (mensaje.toLowerCase().includes('gasto') || mensaje.toLowerCase().includes('superado')) return color.rojo;
    return color.amarillo;
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.fondo}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Notificaciones</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={28} color={color.texto} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.lista}>
            {notificaciones.map((mensaje, index) => (
              <TouchableOpacity key={index} style={[styles.tarjeta, { borderLeftColor: getIconColor(mensaje) }]}>
                <Ionicons name="notifications-outline" size={24} color={getIconColor(mensaje)} style={{marginRight:10}} />
                <Text style={styles.mensaje}>{mensaje}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: color.fondoModal,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titulo: { fontSize: 18, fontWeight: 'bold', color: color.texto },
  lista: { paddingBottom: 20 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.tarjeta,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  mensaje: { fontSize: 14, color: color.texto, flex: 1 },
});
