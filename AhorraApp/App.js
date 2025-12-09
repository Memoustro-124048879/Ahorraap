import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from './Database/Database';
import { UserProvider } from './Contexts/UserContext';

// Importar pantallas
import BienvenidaScreen from './Screens/BienvenidaScreen';
import LoginScreen from './Screens/LoginScreen';
import RegistroScreen from './Screens/RegistroScreen';
import DashboardScreen from './Screens/DashboardScreen';
import TransaccionesScreen from './Screens/TransaccionesScreen';
import GraficasScreen from './Screens/GraficasScreen';
import PresupuestosScreen from './Screens/PresupuestosScreen';
import PerfilScreen from './Screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transacciones') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Graficas') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Presupuestos') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgb(90, 0, 180)', // Morado primario
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Graficas" component={GraficasScreen} />
      <Tab.Screen name="Presupuestos" component={PresupuestosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="BienvenidaScreen">
          {/* Auth Stack */}
          <Stack.Screen name="BienvenidaScreen" component={BienvenidaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegistroScreen" component={RegistroScreen} options={{ headerShown: false }} />

          {/* App Stack */}
          <Stack.Screen name="MainApp" component={AppTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
