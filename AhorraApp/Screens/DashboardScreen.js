import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../Contexts/UserContext';
import { TransaccionController } from '../Controllers/TransaccionController';
import Colors from '../constants/colors';

export default function DashboardScreen({ navigation }) {
  const { usuario } = useUser();
  const [balance, setBalance] = useState({ ingresos: 0, gastos: 0, total: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = async () => {
    if (usuario) {
      try {
        const datos = await TransaccionController.obtenerResumenFinanciero(usuario.id);
        setBalance(datos);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [usuario])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Encabezado con Saldo */}
        <View style={estilos.header}>
          <Text style={estilos.saludo}>Hola, {usuario?.nombre || 'Usuario'}</Text>
          <Text style={estilos.tituloSaldo}>Balance Total</Text>
          <Text style={estilos.saldo}>${balance.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</Text>
        </View>

        {/* Tarjetas de Resumen */}
        <View style={estilos.resumenContainer}>
          <View style={[estilos.tarjetaResumen, { borderLeftColor: Colors.moradoSecundario }]}>
            <View style={estilos.iconoContainer}>
              <Ionicons name="arrow-up-circle" size={24} color={Colors.moradoSecundario} />
            </View>
            <View>
              <Text style={estilos.etiquetaResumen}>Ingresos</Text>
              <Text style={[estilos.valorResumen, { color: Colors.moradoSecundario }]}>
                +${balance.ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View style={[estilos.tarjetaResumen, { borderLeftColor: Colors.error }]}>
            <View style={estilos.iconoContainer}>
              <Ionicons name="arrow-down-circle" size={24} color={Colors.error} />
            </View>
            <View>
              <Text style={estilos.etiquetaResumen}>Gastos</Text>
              <Text style={[estilos.valorResumen, { color: Colors.error }]}>
                -${balance.gastos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <Text style={estilos.seccionTitulo}>Accesos Rápidos</Text>
        <View style={estilos.accesosContainer}>
          <TouchableOpacity
            style={estilos.botonAcceso}
            onPress={() => navigation.navigate('Transacciones')}
          >
            <View style={[estilos.iconoAcceso, { backgroundColor: Colors.moradoTransparente }]}>
              <Ionicons name="list" size={28} color={Colors.moradoPrimario} />
            </View>
            <Text style={estilos.textoAcceso}>Movimientos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botonAcceso}
            onPress={() => navigation.navigate('Presupuestos')}
          >
            <View style={[estilos.iconoAcceso, { backgroundColor: Colors.cianTransparente }]}>
              <Ionicons name="wallet" size={28} color={Colors.cianAccion} />
            </View>
            <Text style={estilos.textoAcceso}>Presupuestos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botonAcceso}
            onPress={() => navigation.navigate('Graficas')}
          >
            <View style={[estilos.iconoAcceso, { backgroundColor: Colors.moradoSecundarioClaro }]}>
              <Ionicons name="pie-chart" size={28} color={Colors.moradoSecundario} />
            </View>
            <Text style={estilos.textoAcceso}>Reportes</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Promocional o Consejo */}
        <View style={estilos.banner}>
          <Ionicons name="bulb-outline" size={30} color="white" style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.bannerTitulo}>Tip Financiero</Text>
            <Text style={estilos.bannerTexto}>
              Revisa tus gastos hormiga, ¡pueden sumar mucho a fin de mes!
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondoPrincipal,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: Colors.moradoPrimario,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  saludo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 5,
  },
  tituloSaldo: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  saldo: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 5,
  },
  resumenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -25,
  },
  tarjetaResumen: {
    backgroundColor: Colors.blanco,
    borderRadius: 15,
    padding: 15,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconoContainer: {
    marginRight: 10,
  },
  etiquetaResumen: {
    fontSize: 12,
    color: Colors.grisTexto,
  },
  valorResumen: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.grisOscuro,
    marginTop: 25,
    marginLeft: 20,
    marginBottom: 15,
  },
  accesosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  botonAcceso: {
    alignItems: 'center',
    width: 100,
  },
  iconoAcceso: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textoAcceso: {
    color: Colors.grisOscuro,
    fontWeight: '500',
    fontSize: 14,
  },
  banner: {
    backgroundColor: Colors.grisOscuro,
    margin: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  bannerTitulo: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  bannerTexto: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
});