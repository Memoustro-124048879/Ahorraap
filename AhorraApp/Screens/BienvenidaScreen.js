import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import Colors from '../constants/colors';

const logoCerdito = require('../assets/ahorra_app_logo.png');

export default function BienvenidaScreen({ navigation }) {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>

        <Image source={logoCerdito} style={styles.logoImage} />

        <Text style={[styles.subtitle, { color: Colors.grisTexto }]}>
          Cuida de tu dinero con
        </Text>

        <Text style={[styles.title, { color: Colors.moradoPrimario }]}>
          Ahorra+
        </Text>

        <Text style={[styles.title, { color: Colors.moradoPrimario }]}>
          App
        </Text>

        <Pressable
          style={[styles.loginButton, { backgroundColor: Colors.moradoPrimario }]}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable
          style={[styles.registerButton, { borderColor: Colors.moradoPrimario }]}
          onPress={() => navigation.navigate('RegistroScreen')}
        >
          <Text style={[styles.registerButtonText, { color: Colors.moradoPrimario }]}>Crear cuenta</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blanco,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 55,
  },
  loginButton: {
    marginTop: 50,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    borderWidth: 2,
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});