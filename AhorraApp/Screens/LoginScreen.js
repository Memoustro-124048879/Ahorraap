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
} from 'react-native';
import { AuthController } from '../Controllers/AuthController';
import { useUser } from '../Contexts/UserContext';
import Colors from '../constants/colors';

// Importamos el logo de la aplicación
const logoAhorrapp = require('../assets/ahorra_app_logo.png');

// Pantalla de Inicio de Sesión
const LoginScreen = ({ navigation }) => {
  // Estado local para los campos de texto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Accedemos a la función 'setUsuario' del contexto global para guardar al usuario cuando inicie sesión
  const { setUsuario } = useUser();

  // Función principal para procesar el ingreso
  const handleLogin = async () => {
    // Quitamos espacios en blanco accidentales
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    // Validamos que los campos no estén vacíos
    if (emailTrimmed === '') {
      Alert.alert('Error de ingreso', 'Por favor, ingresa tu correo.');
      return;
    }

    if (passwordTrimmed === '') {
      Alert.alert('Error de ingreso', 'Por favor, ingresa tu contraseña.');
      return;
    }

    try {
      // Intentamos hacer login con el Controlador
      const usuario = await AuthController.login(emailTrimmed, passwordTrimmed);

      // Si funciona, guardamos el usuario en el estado global de la App
      setUsuario(usuario);
      console.log('Usuario logueado:', usuario);

      // Navegamos a la pantalla principal (Dashboard)
      navigation.navigate('MainApp', { screen: 'Dashboard' });
    } catch (error) {
      // Si falla (contraseña incorrecta, usuario no existe), mostramos el error
      Alert.alert('Error de ingreso', error.message);
    }
  };

  // Estados para el modal de recuperación de contraseña
  const [modalVisible, setModalVisible] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');

  // Definimos colores locales basados en nuestra paleta global para mantener consistencia
  const colorBotonAccion = Colors.cianAccion;
  const colorGrisInput = Colors.fondoSecundario;
  const colorGrisTexto = Colors.grisTexto;
  const colorLink = Colors.cianAccion;

  // Función simulada para recuperar contraseña
  const handleEnviarRecuperacion = async () => {
    if (!emailRecuperacion) {
      Alert.alert('Error', 'Por favor, ingresa un correo válido.');
      return;
    }

    try {
      await AuthController.recuperarPassword(emailRecuperacion.trim());
      setModalVisible(false); // Cerramos el modal
      setEmailRecuperacion(''); // Limpiamos el campo
      Alert.alert(
        '¡Revisa tu correo!',
        `Se han enviado las instrucciones de recuperación a ${emailRecuperacion}.`
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.mainContainer}>

        {/* Logo Principal */}
        <Image source={logoAhorrapp} style={styles.logoImage} />

        {/* Campo de Correo */}
        <View style={[styles.inputContainer, { backgroundColor: colorGrisInput }]}>
          <Text style={styles.icon}></Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colorGrisTexto}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none" // Importante: emails no llevan mayúsculas
          />
        </View>

        {/* Campo de Contraseña */}
        <View style={[styles.inputContainer, { backgroundColor: colorGrisInput }]}>
          <Text style={styles.icon}></Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colorGrisTexto}
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Oculta los caracteres
          />
        </View>

        {/* Botón de Ingresar */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colorBotonAccion }]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        {/* Enlace Olvidé contraseña */}
        <TouchableOpacity onPress={() => navigation.navigate("RecuperarPasswordScreen")}>
          <Text style={[styles.linkText, { color: colorLink, marginTop: 25 }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Enlace Registro */}
        <TouchableOpacity onPress={() => navigation.navigate("RegistroScreen")}>
          <Text style={[styles.linkText, { color: colorLink, marginTop: 15 }]}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

      </View>

      {/* Modal de Recuperación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa tu correo para enviarte las instrucciones.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="tu.correo@ejemplo.com"
              placeholderTextColor="#999"
              value={emailRecuperacion}
              onChangeText={setEmailRecuperacion}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.grisOscuro }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colorBotonAccion }]}
                onPress={handleEnviarRecuperacion}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blanco,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logoImage: {
    width: '90%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: Colors.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 15,
  },

  // Estilos del Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay, // Fondo semitransparente
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.blanco,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10, // Sombra en Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.grisOscuro,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.grisTexto,
  },
  modalInput: {
    width: '100%',
    height: 45,
    borderColor: Colors.borde,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: Colors.blanco,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default LoginScreen;