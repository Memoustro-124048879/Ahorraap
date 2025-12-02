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
  StatusBar,
  ScrollView, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import { registrarUsuario } from '../controllers/UserController';

const logoAhorrapp = require('../assets/full.jpg');

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const verdeOficial = '#2DA458'; 

  
  const handleRegistro = async () => {
    
  
    if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor rellena todos los datos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo real.');
      return;
    }

    if (telefono.length < 10) {
      Alert.alert('Teléfono inválido', 'Ingresa un número de al menos 10 dígitos.');
      return;
    }

    
    const nuevosDatos = { nombre, email, password, telefono };

    await registrarUsuario(nuevosDatos, (exito) => {
      if (exito) {
        
        Alert.alert(
          "¡Cuenta creada!", 
          `Bienvenido, ${nombre}. Ahora puedes iniciar sesión.`,
          [
            { text: "OK", onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        
        Alert.alert("Error", "No se pudo crear la cuenta. Es posible que el correo ya esté registrado.");
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Image source={logoAhorrapp} style={styles.logo} />
        <Text style={styles.titulo}>Crear Cuenta</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#A9A9A9"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={estilos.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
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

        <View style={estilos.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono celular"
            placeholderTextColor="#A9A9A9"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
        </View>

        <View style={estilos.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
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
          onPress={handleRegistro}
        >
          <Text style={styles.btnText}>Registrarme</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { marginTop: 20 }]}>
            ¿Ya tienes cuenta? <Text style={{ color: verdeOficial, fontWeight: 'bold' }}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 25 },
  backButton: { position: 'absolute', top: Platform.OS === 'android' ? 40 : 50, left: 20, zIndex: 10, padding: 5 },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginTop: 40, marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, backgroundColor: '#F5F5F5', borderRadius: 30, paddingHorizontal: 20, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  btn: { width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#666', fontSize: 15 },
});

const styles = estilos;