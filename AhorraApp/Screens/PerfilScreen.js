// Screens/PerfilScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// IMPORTA TU FOTO AQUÍ
// Asegúrate de que la ruta sea correcta hacia tu carpeta de assets
const avatarTony = require('../assets/tony.png'); 

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
};

const OpcionMenu = ({ icono, texto, accion, esRojo = false }) => (
  <TouchableOpacity style={estilos.opcionFila} onPress={accion}>
    <View style={estilos.ladoIzquierdo}>
      <View style={[estilos.iconoContainer, {backgroundColor: esRojo ? '#fdecea' : '#f0f9f4'}]}>
        <Ionicons name={icono} size={22} color={esRojo ? color.rojo : color.verde} />
      </View>
      <Text style={[estilos.textoOpcion, esRojo && {color: color.rojo, fontWeight:'bold'}]}>{texto}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function PerfilScreen({ navigation }) {

  const handleLogOut = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => navigation.replace("Login")
        }
      ]
    );
  };

  const accionSimulada = (nombre) => {
    Alert.alert(nombre, "Esta funcionalidad estará lista pronto.");
  };

  return (
    <View style={estilos.pantalla}>
      {/* Barra de estado oscura para fondo claro */}
      <StatusBar barStyle="dark-content" backgroundColor={color.fondo} />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TARJETA DE USUARIO (Ahora es lo primero) */}
        <View style={estilos.cardUsuario}>
          <View style={estilos.avatarContainer}>
            <Image 
              source={avatarTony} // <-- USAMOS TU FOTO AQUÍ
              style={estilos.avatar} 
            />
            <View style={estilos.badgeEdit}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </View>
          
          <Text style={estilos.nombreUsuario}>Tony Developer</Text>
          <Text style={estilos.emailUsuario}>tony@ahorraapp.com</Text>
          
          <View style={estilos.badgePro}>
            <MaterialIcons name="verified" size={16} color="white" />
            <Text style={estilos.textoPro}>Cuenta Verificada</Text>
          </View>
        </View>

        {/* SECCIONES DE MENÚ */}
        <Text style={estilos.seccionTitulo}>Cuenta</Text>
        <View style={estilos.bloqueOpciones}>
          <OpcionMenu icono="person-outline" texto="Datos Personales" accion={() => accionSimulada("Datos")} />
          <OpcionMenu icono="card-outline" texto="Mis Tarjetas" accion={() => accionSimulada("Tarjetas")} />
          <OpcionMenu icono="document-text-outline" texto="Extractos Mensuales" accion={() => accionSimulada("Extractos")} />
        </View>

        <Text style={estilos.seccionTitulo}>Seguridad & Ajustes</Text>
        <View style={estilos.bloqueOpciones}>
          <OpcionMenu icono="lock-closed-outline" texto="Cambiar Contraseña" accion={() => accionSimulada("Pass")} />
          <OpcionMenu icono="notifications-outline" texto="Notificaciones" accion={() => accionSimulada("Notif")} />
          <OpcionMenu icono="shield-checkmark-outline" texto="Face ID / Touch ID" accion={() => accionSimulada("Biometria")} />
        </View>

        <View style={[estilos.bloqueOpciones, { marginTop: 20, marginBottom: 40 }]}>
          <OpcionMenu 
            icono="log-out-outline" 
            texto="Cerrar Sesión" 
            accion={handleLogOut} 
            esRojo={true} 
          />
        </View>

        <Text style={estilos.versionApp}>AhorraApp v1.0.2</Text>

      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  
  scrollContent: {
    paddingTop: 60, // Espacio superior para que no se pegue al borde
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Tarjeta Usuario (Sin margen negativo)
  cardUsuario: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25, // Un poco más de padding
    alignItems: 'center',
    elevation: 2, // Sombra más sutil
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100, // Un poco más grande
    height: 100,
    borderRadius: 50,
  },
  badgeEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: color.verde,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  nombreUsuario: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.texto,
    marginBottom: 5,
  },
  emailUsuario: {
    fontSize: 15,
    color: color.textoSuave,
    marginBottom: 15,
  },
  badgePro: {
    backgroundColor: color.verde,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  textoPro: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },

  // Estilos de Menú (Iguales)
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.textoSuave,
    marginBottom: 10,
    marginLeft: 10,
  },
  bloqueOpciones: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 5,
    marginBottom: 15,
  },
  opcionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  ladoIzquierdo: { flexDirection: 'row', alignItems: 'center' },
  iconoContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textoOpcion: { fontSize: 15, color: color.texto, fontWeight: '500' },
  versionApp: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10
  }
});