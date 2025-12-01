import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- BASE DE DATOS MODERNA ---
import { initDB } from './database/db'; 

// --- PANTALLAS ---
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import MainTabs from './screens/MainTabs'; 

const Stack = createStackNavigator();

export default function App() {
  
  useEffect(() => {
    // Inicializar DB de forma asíncrona
    const setup = async () => {
      await initDB();
    };
    setup();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="MainApp" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}