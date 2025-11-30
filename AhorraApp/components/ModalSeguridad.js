import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = { fondo:"#f1f2f3", verde:"#2DA458", texto:"#101010", tarjeta:"#fff" };

export default function ModalSeguridad({ visible, onClose }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.fondo}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Seguridad</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={28} color={color.texto} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput style={styles.input} secureTextEntry value={pass} onChangeText={setPass} />

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput style={styles.input} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />

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
  label:{ fontSize:14, color: color.texto, marginTop:10 },
  input:{ backgroundColor: color.tarjeta, borderRadius:10, padding:10, marginTop:5 },
  boton:{ backgroundColor: color.verde, borderRadius:10, padding:12, marginTop:20, alignItems:'center' },
  textoBoton:{ color:'white', fontWeight:'bold' },
});
