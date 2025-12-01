import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import ProyectoScreen from './Screens/Unoscreen';
import LoginScreen from './Screens/Dosscreen';
import TransaccionesScreen from './Screens/Cuatroscreen';
import RegistroTransferenciasScreen from './Screens/Ochoscreen';
import Tresscreen from './Screens/Tresscreen';
import GraficasScreen from './Screens/Cincoscreen';
import Docescreen from './Screens/Docescreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProyectoScreen">
        <Stack.Screen name="ProyectoScreen" component={ProyectoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TransaccionesScreen" component={TransaccionesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistroTransferenciasScreen" component={RegistroTransferenciasScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tresscreen" component={Tresscreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cincoscreen" component={GraficasScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Docescreen" component={Docescreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
