import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';

const AHORRA_APP_LOGO = require('../assets/ahorra_app_logo.jpg');

const handleRegister = () => {
  console.log('Botón Listo presionado (Simulado)');
};
const CustomInput = ({ 
  placeholder, 
  secureTextEntry,
  keyboardType = 'default'
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  </View>
);

export default function Tresscreen() {
  return (
    <SafeAreaView style={styles.fullScreenContainer}>
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
        />
        <CustomInput 
          placeholder="✉️ Correo electrónico" 
          keyboardType="email-address" 
        />
        <CustomInput 
          placeholder="📞 Número de teléfono" 
          keyboardType="phone-pad" 
        />
        <CustomInput 
          placeholder="🔐 Contraseña" 
          secureTextEntry={true} 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister} 
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Listo</Text>
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
  formContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 50,
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
});