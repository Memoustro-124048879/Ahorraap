import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import RegistroScreen from './Screens/RegistroScreen';
import MainTabs from './Screens/MainTabs'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* 1. ENTRADA */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        
        {/* 2. DASHBOARD CON BARRA */}
        <Stack.Screen name="MainApp" component={MainTabs} />

       

      </Stack.Navigator>
    </NavigationContainer>
  );
}