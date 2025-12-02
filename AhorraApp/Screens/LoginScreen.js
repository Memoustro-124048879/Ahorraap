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
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { loginUsuario, inicializarAdmin, validarIdentidad, restablecerPassword } from '../controllers/UserController';

const logoAhorrapp = require('../assets/full.jpg');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const [modalVisible, setModalVisible] = useState(false);
  const [pasoRecuperacion, setPasoRecuperacion] = useState(1); 
  const [recupEmail, setRecupEmail] = useState('');
  const [recupTelefono, setRecupTelefono] = useState('');
  const [recupNuevaPass, setRecupNuevaPass] = useState('');
  
  const verdeOficial = '#2DA458'; 

  // --- LOGIN ---
  const handleLogin = async () => {
    const emailLimpio = email.trim();
    const passLimpio = password.trim();
    
    if (emailLimpio === '' || passLimpio === '') {
      Alert.alert('Campos vacíos', 'Por favor ingresa tus datos.');
      return; 
    }

    
    const usuarioEncontrado = await loginUsuario(emailLimpio, passLimpio);

    if (usuarioEncontrado) {
      try {
        
        await AsyncStorage.setItem('userSession', JSON.stringify(usuarioEncontrado));
        console.log('Sesión iniciada:', usuarioEncontrado.nombre);
        
        
        navigation.replace('MainApp'); 
      } catch (e) {
        console.log("Error guardando sesión", e);
      }
    } else {
      Alert.alert("Error de acceso", "Correo o contraseña incorrectos.");
    }
  };

  // --- RECUPERACIÓN: PASO 1 
  const handleVerificarDatos = async () => {
    if (!recupEmail.trim() || !recupTelefono.trim()) {
      Alert.alert("Faltan datos", "Ingresa tu correo y teléfono registrado.");
      return;
    }

    const esValido = await validarIdentidad(recupEmail.trim(), recupTelefono.trim());

    if (esValido) {
      setPasoRecuperacion(2); 
    } else {
      Alert.alert("Datos incorrectos", "El correo o el teléfono no coinciden con nuestros registros.");
    }
  };

  // --- RECUPERACIÓN: PASO 2 
  const handleGuardarNuevaPass = async () => {
    if (recupNuevaPass.length < 4) {
      Alert.alert("Contraseña corta", "La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    await restablecerPassword(recupEmail.trim(), recupNuevaPass.trim(), (exito) => {
      if (exito) {
        Alert.alert("¡Éxito!", "Tu contraseña ha sido restablecida. Ahora puedes ingresar.");
        cerrarModal();
      } else {
        Alert.alert("Error", "No se pudo actualizar la contraseña.");
      }
    });
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPasoRecuperacion(1); 
    setRecupEmail('');
    setRecupTelefono('');
    setRecupNuevaPass('');
  };

  
  const handleCrearAdmin = async () => {
    await inicializarAdmin();
    Alert.alert("Admin Restablecido", "Intenta con:\ntony@ahorraapp.com\n12345");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
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

              <TouchableOpacity style={styles.btn} onPress={handleLogin}>
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

              <TouchableOpacity onPress={handleCrearAdmin} style={{marginTop: 40, opacity: 0.5}}>
                <Text style={{fontSize: 10, color: '#ccc'}}>Restablecer Admin (Dev)</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* --- MODAL INTELIGENTE --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            
            <Text style={styles.modalTitle}>
              {pasoRecuperacion === 1 ? "Recuperar Acceso" : "Nueva Contraseña"}
            </Text>

            {pasoRecuperacion === 1 ? (
              
              <>
                <Text style={styles.modalDesc}>Verifica tu identidad:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Correo registrado"
                  value={recupEmail}
                  onChangeText={setRecupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Teléfono registrado"
                  value={recupTelefono}
                  onChangeText={setRecupTelefono}
                  keyboardType="phone-pad"
                />
                
                <View style={styles.modalBtns}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={cerrarModal}>
                    <Text style={styles.modalBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: verdeOficial }]} onPress={handleVerificarDatos}>
                    <Text style={styles.modalBtnText}>Verificar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              
              <>
                <Text style={styles.modalDesc}>¡Identidad Verificada! Crea una nueva clave:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nueva Contraseña"
                  value={recupNuevaPass}
                  onChangeText={setRecupNuevaPass}
                  secureTextEntry
                />
                
                <View style={styles.modalBtns}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={cerrarModal}>
                    <Text style={styles.modalBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: verdeOficial }]} onPress={handleGuardarNuevaPass}>
                    <Text style={styles.modalBtnText}>Restablecer</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 20 },
  content: { padding: 25, alignItems: 'center', width: '100%' },
  logo: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, backgroundColor: '#F5F5F5', borderRadius: 30, paddingHorizontal: 20, marginBottom: 15 },
  icon: { fontSize: 20, marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  btn: { width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, elevation: 3, backgroundColor: '#2DA458' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#666', marginTop: 20, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalDesc: { fontSize: 15, color: '#666', marginBottom: 15 },
  modalInput: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 15, fontSize: 16 },
  modalBtns: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold' }
});