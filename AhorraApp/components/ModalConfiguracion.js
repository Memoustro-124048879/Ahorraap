// components/ModalConfiguracion.js
import React,{useState} from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import ModalNotificaciones from './ModalNotificaciones';
import ModalTema from './ModalTema';
import ModalSeguridad from './ModalSeguridad';
import ModalIdioma from './ModalIdioma';

const color = {
  fondoModal: "#f1f2f3",
  tarjeta: "#ffffff",
  texto: "#101010",
  verde: "#2DA458",
  gris: "#888",
};

export default function ModalConfiguracion({ visible, onClose, navigation }) {
  const [temaVisible, setTemaVisible] = useState(false);
  const [seguridadVisible, setSeguridadVisible] = useState(false);
  const [idiomaVisible, setIdiomaVisible] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);
  
  const opciones = [
    { id: 1, titulo: "Perfil", icono: "person-outline", action: () => {onClose(); navigation.navigate('Perfil');}},
    { id: 2, titulo: "Notificaciones", icono: "notifications-outline", action: () => setNotiVisible(true) },
    { id: 3, titulo: "Seguridad", icono: "lock-closed-outline", action: () => setSeguridadVisible(true) },
    { id: 4, titulo: "Idioma", icono: "language-outline", action: () => setIdiomaVisible(true) },
  ];

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.fondo}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Configuración</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={28} color={color.texto} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.lista}>
            {opciones.map((opcion) => (
              <TouchableOpacity key={opcion.id} style={styles.tarjeta}onPress={opcion.action}>
                <Ionicons name={opcion.icono} size={24} color={color.verde} style={{ marginRight: 15 }} />
                <Text style={styles.textoOpcion}>{opcion.titulo}</Text>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={color.gris} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <ModalNotificaciones  visible={notiVisible} onClose={() => setNotiVisible(false)} />

      <ModalTema visible={temaVisible} onClose={() => setTemaVisible(false)} />
      <ModalSeguridad visible={seguridadVisible} onClose={() => setSeguridadVisible(false)} />
      <ModalIdioma visible={idiomaVisible} onClose={() => setIdiomaVisible(false)} />
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
    marginBottom: 20,
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
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  textoOpcion: { 
    fontSize: 16, 
    color: color.texto 
  },
});