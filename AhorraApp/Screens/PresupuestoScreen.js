import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458", 
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
  itemVerde: '#d4edda', 
};


function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>
           <Text style={{fontSize:24}}>🏦</Text> 
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={24} color={color.verde} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={color.verde} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PresupuestoScreen({ navigation }) {
  
  
  const presupuestos = [
    { id: 1, categoria: "Ropa para bebé", monto: "1,500" },
    { id: 2, categoria: "Gimnasio", monto: "500" },
    { id: 3, categoria: "Supermercado", monto: "2,500" },
  ];

  const handleAction = (accion) => {
    Alert.alert(accion, "Funcionalidad próximamente");
  };

  return (
    <View style={estilos.pantalla}>
     
      <Encabezado titulo="Mis Presupuestos" />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <View style={estilos.headerSection}>
          <Text style={estilos.subtitulo}>Presupuestos Mensuales</Text>
          <TouchableOpacity onPress={() => handleAction("Filtros")}>
             <Ionicons name="filter" size={20} color={color.verde} />
          </TouchableOpacity>
        </View>

        
        <View style={estilos.listaContainer}>
          {presupuestos.map((item) => (
            <View key={item.id} style={estilos.cardPresupuesto}>
              
             
              <View style={estilos.barraLateral} />

              <View style={estilos.cardContent}>
                <View>
                  <Text style={estilos.categoriaTexto}>{item.categoria}</Text>
                  <Text style={estilos.montoTexto}>${item.monto} <Text style={{fontSize:12, color:'#999'}}>MXN</Text></Text>
                </View>

              
                <View style={estilos.acciones}>
                  <TouchableOpacity onPress={() => handleAction("Editar")} style={estilos.btnIcono}>
                    <MaterialIcons name="edit" size={22} color={color.verde} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAction("Eliminar")} style={estilos.btnIcono}>
                    <MaterialIcons name="delete-outline" size={22} color={color.rojo} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          ))}
        </View>

     
        <TouchableOpacity 
          style={estilos.botonAgregar}
          onPress={() => navigation.navigate("AgregarPresupuesto")} 
        >
          <Ionicons name="add-circle-outline" size={24} color="white" style={{marginRight: 8}}/>
          <Text style={estilos.textoBoton}>Nuevo Presupuesto</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  
  
  encabezado: {
    backgroundColor: color.verde,
    paddingTop: 50, 
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    zIndex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: {
    backgroundColor: color.tarjeta,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4}
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: '600' },

  
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
 
  listaContainer: {
    gap: 15, 
  },
  cardPresupuesto: {
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    overflow: 'hidden', 
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    height: 80,
  },
  barraLateral: {
    width: 6,
    backgroundColor: color.verde,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  montoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.verde,
  },
  acciones: {
    flexDirection: 'row',
    gap: 15,
  },
  btnIcono: {
    padding: 5,
  },

  
  botonAgregar: {
    backgroundColor: color.verde,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    elevation: 4,
    shadowColor: color.verde,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});