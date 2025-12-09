import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { AuthController } from '../Controllers/AuthController';
import Colors from '../constants/colors';

// Importamos la imagen del logo desde la carpeta de assets
const AHORRA_APP_LOGO = require('../assets/ahorra_app_logo.png');

// Componente personalizado para los campos de texto del formulario.
// Recibe las propiedades (props) como placeholder, valor y función de cambio.
const CustomInput = ({
  placeholder,
  secureTextEntry, // Para ocultar el texto (contraseñas)
  keyboardType = 'default', // Tipo de teclado (email, numérico, etc.)
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
      // Desactivamos mayúsculas automáticas si es un email
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      autoCorrect={false}
    />
  </View>
);

// Pantalla de Registro de Usuario
export default function RegistroScreen({ navigation }) {
  // Manejo del estado para cada campo del formulario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Función simple para verificar que el email tenga formato correcto (@ y .)
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función que se ejecuta al presionar "Registrarse"
  const handleRegister = async () => {
    // Limpiamos espacios en blanco al inicio y final
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const fullNameTrimmed = fullName.trim();

    // Verificamos que los campos obligatorios no estén vacíos
    if (!fullNameTrimmed || !emailTrimmed || !passwordTrimmed) {
      Alert.alert('Error de registro', 'Por favor, rellena nombre, correo y contraseña.');
      return;
    }

    // Verificamos el formato del correo
    if (!validateEmail(emailTrimmed)) {
      Alert.alert('Error de validación', 'El formato del correo electrónico es incorrecto.');
      return;
    }

    // Intentamos realizar el registro llamando al controlador
    try {
      await AuthController.registrar(emailTrimmed, passwordTrimmed, fullNameTrimmed, phone.trim());

      Alert.alert('Registro exitoso', `¡Bienvenido(a) ${fullNameTrimmed}!`, [
        // Redirigimos al Login tras el éxito
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
    } catch (error) {
      // Mostramos cualquier error que ocurra (ej. correo ya existe)
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.formContainer}>
        {/* Logo y Nombre de la App */}
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

        {/* Campos del Formulario */}
        <CustomInput
          placeholder="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
        />
        <CustomInput
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <CustomInput
          placeholder="Número de teléfono (Opcional)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <CustomInput
          placeholder="Palabra Clave (ej. Comida favorita)"
          value={secretWord}
          onChangeText={setSecretWord}
        />
        <CustomInput
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {/* Botones de Acción */}
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