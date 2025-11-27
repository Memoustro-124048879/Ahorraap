// screens/Tresscreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Alert,
  Platform 
} from 'react-native';


import { Ionicons } from '@expo/vector-icons';

const AHORRA_APP_LOGO = require('../assets/ahorra_app_logo.jpg');

const CustomInput = ({
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  value,
  onChangeText,
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      autoCorrect={false}
    />
  </View>
);


export default function Tresscreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

 
  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    if (!fullName || !email || !phone || !password) {
      mostrarAlerta('Error de registro', 'Por favor, rellena todos los campos para continuar.');
      return;
    }

    if (!validateEmail(email)) {
      mostrarAlerta('Error de validación', 'El formato del correo electrónico es incorrecto.');
      return;
    }

    
    mostrarAlerta('Registro exitoso', `¡Bienvenido(a) ${fullName}! Tus datos han sido registrados.`);
    
   
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');

    
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      
      {/* --- BOTÓN DE REGRESAR (NUEVO) --- */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()} 
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      {/* ---------------------------------- */}

      <View style={styles.formContainer}>
        
        <View style={styles.logoTextContainer}>
          <Image
            source={AHORRA_APP_LOGO}
            style={{ width: 100, height: 100, marginBottom: 20 }}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.AhorraText}>Ahorra+</Text>
            <Text style={styles.AppText}>App</Text>
          </View>
        </View>

        <CustomInput
          placeholder="👤 Nombre completo"
          value={fullName}
          onChangeText={setFullName}
        />
        <CustomInput
          placeholder="✉️ Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <CustomInput
          placeholder="📞 Número de teléfono"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <CustomInput
          placeholder="🔐 Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Listo</Text>
        </TouchableOpacity>

        
        <TouchableOpacity 
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{ color: '#007BFF' }}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backButton: {
    position: 'absolute',
    top: 50,  
    left: 20,
    zIndex: 10, 
    padding: 10, 
  },
  formContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 20, 
  },
  AhorraText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E6F3C',
    lineHeight: 30,
  },
  AppText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#469A49',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
});