import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = { fondo:"#f1f2f3", verde:"#2DA458", texto:"#101010", tarjeta:"#fff" };

export default function ModalTema({ visible, onClose }) {
  const [oscuro, setOscuro] = useState(false);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.fondo}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Tema</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={28} color={color.texto} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.opcion, oscuro && {backgroundColor:'#333'}]} onPress={()=>setOscuro(!oscuro)}>
            <Text style={[styles.texto, oscuro && {color:'white'}]}>{oscuro ? "Modo Oscuro" : "Modo Claro"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boton} onPress={onClose}>
            <Text style={styles.textoBoton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fondo:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modal:{ backgroundColor: color.fondo, padding:20, borderTopLeftRadius:20, borderTopRightRadius:20 },
  header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  titulo:{ fontSize:18, fontWeight:'bold', color: color.texto },
  opcion:{ backgroundColor: color.tarjeta, padding:15, borderRadius:12, marginBottom:10 },
  texto:{ fontSize:16, color: color.texto },
  boton:{ backgroundColor: color.verde, borderRadius:10, padding:12, marginTop:20, alignItems:'center' },
  textoBoton:{ color:'white', fontWeight:'bold' }
});
