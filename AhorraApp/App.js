import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- IMPORTAMOS TODAS TUS PANTALLAS ---
import MenuScreen from './Screens/MenuScreen'; // El menú antiguo (por si acaso)
import UnoScreen from './Screens/Unoscreen'; 
import Dosscreen from './Screens/Dosscreen';
import Tresscreen from './Screens/Tresscreen';
import Cuatroscreen from './Screens/Cuatroscreen';
import Cincoscreen from './Screens/Cincoscreen';
import Seisscreen from './Screens/Seisscreen';
import Sietescreen from './Screens/Sietescreen';
import Ochoscreen from './Screens/Ochoscreen';
import Nuevescreen from './Screens/Nuevescreen';
import Diezscreen from './Screens/Diezscreen';
import Oncescreen from './Screens/Oncescreen';
import Docescreen from './Screens/Docescreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Bienvenida"  // <--- AQUÍ DECIMOS QUE ARRANQUE EN LA 1
        screenOptions={{ headerShown: false }} // Ocultamos la barra de arriba en TODAS
      >
        
        {/* === ZONA DE ACCESO === */}
        <Stack.Screen name="Bienvenida" component={UnoScreen} />
        <Stack.Screen name="Login" component={Dosscreen} />
        <Stack.Screen name="Registro" component={Tresscreen} />

        {/* === ZONA PRINCIPAL (Dashboard) === */}
        <Stack.Screen name="Transacciones" component={Cuatroscreen} />
        
        {/* === ZONA DE SECCIONES === */}
        <Stack.Screen name="Graficas" component={Cincoscreen} />
        <Stack.Screen name="Presupuestos" component={Seisscreen} />
        <Stack.Screen name="Notificaciones" component={Sietescreen} />
        <Stack.Screen name="Historial" component={Ochoscreen} />
        <Stack.Screen name="NuevaTransferencia" component={Nuevescreen} />
        <Stack.Screen name="AgregarPresupuesto" component={Diezscreen} />
        <Stack.Screen name="EditarTransferencias" component={Oncescreen} />
        <Stack.Screen name="ListaFiltrada" component={Docescreen} />

        {/* Menú de desarrollo (Opcional) */}
        <Stack.Screen name="MenuSecreto" component={MenuScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}