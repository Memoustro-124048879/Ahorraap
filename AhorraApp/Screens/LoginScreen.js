import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal, 
  StatusBar
} from 'react-native';

import { loginUsuario } from '../controllers/UserController'; // <--- IMPORTAMOS EL CONTROLADOR

const logoAhorrapp = require('../assets/full.jpg');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');
  
  const verdeOficial = '#2DA458'; 

  // --- LÓGICA DE LOGIN REAL ---
  const handleLogin = async () => {
    
    // 1. Validaciones básicas visuales
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Campos vacíos', 'Por favor ingresa tu correo y contraseña.');
      return; 
    }

    // 2. CONSULTAR BASE DE DATOS
    const usuarioEncontrado = await loginUsuario(email, password);

    if (usuarioEncontrado) {
      console.log('Login exitoso:', usuarioEncontrado.nombre);
      navigation.replace('MainApp'); 
    } else {
      Alert.alert("Error de acceso", "Correo o contraseña incorrectos.");
    }
  };

  const handleRecuperar = () => {
    if (!emailRecuperacion.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo válido.');
      return;
    }
    setModalVisible(false);
    setEmailRecuperacion('');
    Alert.alert('Correo enviado', `Se enviaron instrucciones a ${emailRecuperacion}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>
        <Image source={logoAhorrapp} style={styles.logo} />

        <View style={styles.inputContainer}>
          <Text style={styles.icon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry 
          />
        </View>

        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: verdeOficial }]}
          onPress={handleLogin}
        >
          <Text style={styles.btnText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={[styles.link, { marginTop: 20, fontWeight: 'bold' }]}>
            ¿No tienes cuenta? <Text style={{ color: verdeOficial }}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL RECUPERACIÓN */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
            <Text style={styles.modalDesc}>Ingresa tu correo asociado:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="ejemplo@correo.com"
              value={emailRecuperacion}
              onChangeText={setEmailRecuperacion}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: verdeOficial }]}
                onPress={handleRecuperar}
              >
                <Text style={styles.modalBtnText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, padding: 25, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, backgroundColor: '#F5F5F5', borderRadius: 30, paddingHorizontal: 20, marginBottom: 15 },
  icon: { fontSize: 20, marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  btn: { width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, elevation: 3 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#666', marginTop: 20, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalDesc: { fontSize: 16, color: '#666', marginBottom: 15 },
  modalInput: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 20, fontSize: 16 },
  modalBtns: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold' }
});