import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
  azul: "#3498db",
  hoy: "#e8f5e9", 
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

export default function CalendarioScreen({ navigation }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(28); 

  
  const eventos = [
    { id: 1, titulo: "Pago Netflix", monto: "-$199", fecha: "29 Nov", tipo: "gasto", icono: "movie-open-outline" },
    { id: 2, titulo: "Pago Internet", monto: "-$599", fecha: "01 Dic", tipo: "gasto", icono: "wifi" },
    { id: 3, titulo: "Nómina Quincenal", monto: "+$8,500", fecha: "30 Nov", tipo: "ingreso", icono: "cash-multiple" },
  ];

  
  const diasSemana = ["D", "L", "M", "M", "J", "V", "S"];
  
  const diasMes = Array.from({length: 30}, (_, i) => i + 1);

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado titulo="Agenda Financiera" />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <View style={estilos.cardCalendario}>
          <View style={estilos.headerCalendario}>
            <Text style={estilos.mesTexto}>Noviembre 2025</Text>
            <Ionicons name="chevron-forward" size={20} color={color.texto} />
          </View>

         
          <View style={estilos.filaSemana}>
            {diasSemana.map((dia, index) => (
              <Text key={index} style={estilos.textoDiaSemana}>{dia}</Text>
            ))}
          </View>

          
          <View style={estilos.gridDias}>
            {diasMes.map((dia) => {
              const esHoy = dia === diaSeleccionado;
              const tieneEvento = dia === 29 || dia === 30 || dia === 1; // Días con puntito
              
              return (
                <TouchableOpacity 
                  key={dia} 
                  style={[estilos.celdaDia, esHoy && estilos.celdaHoy]}
                  onPress={() => setDiaSeleccionado(dia)}
                >
                  <Text style={[estilos.textoDia, esHoy && estilos.textoDiaHoy]}>{dia}</Text>
                  {tieneEvento && <View style={estilos.puntoEvento} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

       
        <Text style={estilos.subtitulo}>Próximos Vencimientos</Text>

        <View style={estilos.listaEventos}>
          {eventos.map((evento) => (
            <View key={evento.id} style={estilos.cardEvento}>
              
              
              <View style={[
                estilos.iconoContainer, 
                { backgroundColor: evento.tipo === 'gasto' ? '#fdecea' : '#e8f5e9' }
              ]}>
                <MaterialCommunityIcons 
                  name={evento.icono} 
                  size={24} 
                  color={evento.tipo === 'gasto' ? color.rojo : color.verde} 
                />
              </View>

             
              <View style={{flex:1, paddingHorizontal: 15}}>
                <Text style={estilos.tituloEvento}>{evento.titulo}</Text>
                <Text style={estilos.fechaEvento}>{evento.fecha}</Text>
              </View>

              <View>
                <Text style={[
                  estilos.montoEvento, 
                  { color: evento.tipo === 'gasto' ? color.texto : color.verde }
                ]}>
                  {evento.monto}
                </Text>
              </View>

            </View>
          ))}
        </View>

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

  cardCalendario: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    marginBottom: 25,
  },
  headerCalendario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  mesTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.texto
  },
  filaSemana: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textoDiaSemana: {
    width: 35,
    textAlign: 'center',
    color: color.textoSuave,
    fontWeight: '600',
    fontSize: 12,
  },
  gridDias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  celdaDia: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 17.5,
  },
  celdaHoy: {
    backgroundColor: color.verde,
    elevation: 2,
  },
  textoDia: {
    fontSize: 14,
    color: color.texto,
  },
  textoDiaHoy: {
    color: 'white',
    fontWeight: 'bold',
  },
  puntoEvento: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.rojo,
    position: 'absolute',
    bottom: 4,
  },

  
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.texto,
    marginBottom: 15,
  },
  listaEventos: {
    gap: 15,
  },
  cardEvento: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1}
  },
  iconoContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: '600',
    color: color.texto,
    marginBottom: 2,
  },
  fechaEvento: {
    fontSize: 12,
    color: color.textoSuave,
  },
  montoEvento: {
    fontSize: 16,
    fontWeight: 'bold',
  },

 
  fabAgregar: {
    position: 'absolute',
    bottom: 90, 
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: color.verde,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: color.verde,
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 4}
  }
});