// Screens/MainTabs.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen'; 


const PlaceholderScreen = ({ route }) => (
  <View style={{flex:1, backgroundColor:'#fff', justifyContent:'center', alignItems:'center'}}>
    <Text style={{color: '#666', fontSize: 16}}>Sección {route.name} en construcción 🚧</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const verdeOficial = '#2DA458';

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          position: 'absolute',
        },
      }}
    >
      
      <Tab.Screen 
        name="Perfil" 
        component={PlaceholderScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-outline" size={28} color={focused ? verdeOficial : "gray"} />
          )
        }}
      />

      
      <Tab.Screen 
        name="Presupuestos" 
        component={PlaceholderScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="document-text-outline" size={28} color={focused ? verdeOficial : "gray"} />
          )
        }}
      />

     
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={estilos.botonFlotante}>
              <Ionicons name="home" size={32} color="white" />
            </View>
          ),
        }}
      />

      
      <Tab.Screen 
        name="Graficas" 
        component={PlaceholderScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="stats-chart-outline" size={28} color={focused ? verdeOficial : "gray"} />
          )
        }}
      />

     
      <Tab.Screen 
        name="Calendario" 
        component={PlaceholderScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="calendar-outline" size={28} color={focused ? verdeOficial : "gray"} />
          )
        }}
      />

    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  botonFlotante: {
    top: -20, 
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#2DA458',
    shadowColor: '#2DA458',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#f2f2f2' 
  }
});