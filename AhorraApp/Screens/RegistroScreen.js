import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { AuthController } from '../Controllers/AuthController';
import Colors from '../constants/colors';

const AHORRA_APP_LOGO = require('../assets/ahorra_app_logo.png');

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
      placeholderTextColor={Colors.grisTexto}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      autoCorrect={false}
    />
  </View>
);

export default function RegistroScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Opcional
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const fullNameTrimmed = fullName.trim();

    if (!fullNameTrimmed || !emailTrimmed || !passwordTrimmed) {
      Alert.alert('Error de registro', 'Por favor, rellena nombre, correo y contraseña.');
      return;
    }

    if (!validateEmail(emailTrimmed)) {
      Alert.alert('Error de validación', 'El formato del correo electrónico es incorrecto.');
      return;
    }

    try {
      await AuthController.registrar(emailTrimmed, passwordTrimmed, fullNameTrimmed);
      Alert.alert('Registro exitoso', `¡Bienvenido(a) ${fullNameTrimmed}!`, [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.formContainer}>
        <View style={styles.logoTextContainer}>
          <Image
            source={AHORRA_APP_LOGO}
            style={{ width: 100, height: 100, marginBottom: 20, marginRight: 15 }}
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
          placeholder="📞 Número de teléfono (Opcional)"
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
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.grisOscuro, marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.blanco,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 50,
  },
  AhorraText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.moradoPrimario,
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
    backgroundColor: Colors.fondoSecundario,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.grisOscuro,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.cianAccion,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
});