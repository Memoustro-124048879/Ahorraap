import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  fondoModal: "#f1f2f3",
  tarjeta: "#ffffff",
  texto: "#101010",
  verde: "#2DA458",
  rojo: "#e74c3c",
  amarillo: "#f1c40f",
  gris: "#999"
};

export default function ModalNotificacionesGeneral({ visible, onClose, notificaciones = [] }) {
  
  // Estado local para manejar la lista y poder borrar
  const [lista, setLista] = useState([]);

  // Cada vez que se abre el modal, cargamos las notificaciones que vienen de la pantalla
  useEffect(() => {
    if (visible) {
      setLista(notificaciones);
    }
  }, [visible, notificaciones]);

  const getIconColor = (mensaje) => {
    if (mensaje.toLowerCase().includes('ingreso')) return color.verde;
    if (mensaje.toLowerCase().includes('gasto') || mensaje.toLowerCase().includes('superado')) return color.rojo;
    return color.amarillo;
  };

  // Función para eliminar
  const confirmarEliminar = (index) => {
    Alert.alert(
      "Eliminar Notificación",
      "¿Deseas borrar este aviso?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive", 
          onPress: () => {
            // Creamos una copia y quitamos el elemento seleccionado
            const nuevaLista = [...lista];
            nuevaLista.splice(index, 1);
            setLista(nuevaLista);
          }
        }
      ]
    );
  };

  const limpiarTodas = () => {
    if (lista.length === 0) return;
    Alert.alert("Limpiar Todo", "¿Borrar todas las notificaciones?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar Todo", style: "destructive", onPress: () => setLista([]) }
    ]);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.fondo}>
        <View style={styles.modal}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Notificaciones</Text>
            
            <View style={{flexDirection:'row', alignItems:'center'}}>
                {/* Botón para limpiar todo (si hay notificaciones) */}
                {lista.length > 0 && (
                    <TouchableOpacity onPress={limpiarTodas} style={{marginRight: 15}}>
                        <Text style={styles.textoLimpiar}>Limpiar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close-outline" size={28} color={color.texto} />
                </TouchableOpacity>
            </View>
          </View>

          {/* Lista */}
          <ScrollView contentContainerStyle={styles.lista} showsVerticalScrollIndicator={false}>
            
            {lista.length === 0 ? (
                // ESTADO VACÍO
                <View style={styles.vacioContainer}>
                    <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
                    <Text style={styles.textoVacio}>Estás al día. Sin notificaciones.</Text>
                </View>
            ) : (
                // LISTA DE NOTIFICACIONES
                lista.map((mensaje, index) => (
                <View key={index} style={[styles.tarjeta, { borderLeftColor: getIconColor(mensaje) }]}>
                    
                    {/* Contenido */}
                    <View style={styles.contenidoTarjeta}>
                        <Ionicons name="notifications-outline" size={24} color={getIconColor(mensaje)} style={{marginRight:10}} />
                        <Text style={styles.mensaje}>{mensaje}</Text>
                    </View>

                    {/* Botón Eliminar Individual */}
                    <TouchableOpacity onPress={() => confirmarEliminar(index)} style={styles.btnEliminar}>
                        <Ionicons name="close" size={20} color={color.gris} />
                    </TouchableOpacity>
                    
                </View>
                ))
            )}

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
  textoLimpiar: { fontSize: 14, color: color.rojo, fontWeight: '600' },
  
  lista: { paddingBottom: 20 },
  
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: color.tarjeta,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  contenidoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  mensaje: { fontSize: 14, color: color.texto, flex: 1, marginRight: 10 },
  
  btnEliminar: {
    padding: 5,
  },

  
  vacioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  textoVacio: {
    color: '#999',
    marginTop: 10,
    fontSize: 14,
  }
});