import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Controlador (Solo lectura)
import { obtenerTodasLasTransacciones } from '../controllers/FinanzasController';

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c", 
  hoy: "#e8f5e9", 
};

// --- ENCABEZADO ---
function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity><Text style={{fontSize:24}}>🏦</Text></TouchableOpacity>
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
  
  const [anio, setAnio] = useState(2025); 
  const [mes, setMes] = useState(0); 
  const [diaSeleccionado, setDiaSeleccionado] = useState(15); 

  const [todasTransacciones, setTodasTransacciones] = useState([]);
  const [listaDelDia, setListaDelDia] = useState([]);
  
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = () => {
    obtenerTodasLasTransacciones((datos) => {
      setTodasTransacciones(datos);
      filtrarPorDia(datos, diaSeleccionado, mes, anio);
    });
  };

  const filtrarPorDia = (datos, dia, mesActual, anioActual) => {
    const fechaString = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const filtradas = datos.filter(t => t.fecha === fechaString);
    setListaDelDia(filtradas);
  };

  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);
    filtrarPorDia(todasTransacciones, dia, mes, anio);
  };

  const cambiarMes = (direccion) => {
    let nuevoMes = mes + direccion;
    if (nuevoMes > 11) { setMes(0); setAnio(anio + 1); }
    else if (nuevoMes < 0) { setMes(11); setAnio(anio - 1); }
    else { setMes(nuevoMes); }
    setDiaSeleccionado(1); 
  };

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const diasArray = Array.from({length: diasEnMes}, (_, i) => i + 1);

  const tieneEvento = (dia) => {
    const fechaCheck = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const transaccion = todasTransacciones.find(t => t.fecha === fechaCheck);
    if (!transaccion) return null;
    return transaccion.tipo === 'ingreso' ? 'verde' : 'rojo';
  };

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={color.verde} />
      
      <Encabezado titulo="Agenda Financiera" />

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CALENDARIO */}
        <View style={estilos.cardCalendario}>
          <View style={estilos.headerCalendario}>
            <TouchableOpacity onPress={() => cambiarMes(-1)}>
               <Ionicons name="chevron-back" size={24} color={color.texto} />
            </TouchableOpacity>
            <Text style={estilos.mesTexto}>{nombresMeses[mes]} {anio}</Text>
            <TouchableOpacity onPress={() => cambiarMes(1)}>
               <Ionicons name="chevron-forward" size={24} color={color.texto} />
            </TouchableOpacity>
          </View>

          <View style={estilos.filaSemana}>
            {["D","L","M","M","J","V","S"].map((d, i) => <Text key={i} style={estilos.textoDiaSemana}>{d}</Text>)}
          </View>

          <View style={estilos.gridDias}>
            {diasArray.map((dia) => {
              const esSeleccionado = dia === diaSeleccionado;
              const tipoPunto = tieneEvento(dia);
              return (
                <TouchableOpacity 
                  key={dia} 
                  style={[estilos.celdaDia, esSeleccionado && estilos.celdaHoy]}
                  onPress={() => seleccionarDia(dia)}
                >
                  <Text style={[estilos.textoDia, esSeleccionado && estilos.textoDiaHoy]}>{dia}</Text>
                  {tipoPunto && (
                    <View style={[
                      estilos.puntoEvento, 
                      { backgroundColor: tipoPunto === 'verde' ? color.verde : color.rojo }
                    ]} />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* LISTA DE MOVIMIENTOS */}
        <Text style={estilos.subtitulo}>
            Movimientos del {diaSeleccionado} de {nombresMeses[mes]}
        </Text>

        {listaDelDia.length === 0 ? (
            <View style={estilos.vacioContainer}>
                <Ionicons name="calendar-clear-outline" size={40} color="#ccc" />
                <Text style={{color:'#999', marginTop:5}}>Sin movimientos este día</Text>
            </View>
        ) : (
            <View style={estilos.listaEventos}>
            {listaDelDia.map((item) => (
                <View key={item.id} style={estilos.cardEvento}>
                  <View style={[
                      estilos.iconoContainer, 
                      { backgroundColor: item.tipo === 'gasto' ? '#fdecea' : '#e8f5e9' }
                  ]}>
                      <MaterialCommunityIcons 
                      name={item.tipo === 'gasto' ? "arrow-down" : "arrow-up"} 
                      size={24} 
                      color={item.tipo === 'gasto' ? color.rojo : color.verde} 
                      />
                  </View>
                  <View style={{flex:1, paddingHorizontal: 15}}>
                      <Text style={estilos.tituloEvento}>{item.titulo}</Text>
                      <Text style={estilos.categoriaEvento}>{item.categoria}</Text>
                  </View>
                  <View>
                      <Text style={[
                      estilos.montoEvento, 
                      { color: item.tipo === 'gasto' ? color.texto : color.verde }
                      ]}>
                      {item.tipo === 'gasto' ? '-' : '+'}${item.monto}
                      </Text>
                  </View>
                </View>
            ))}
            </View>
        )}

      </ScrollView>

    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  encabezado: { backgroundColor: color.verde, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 16, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, zIndex: 1 },
  titulo: { color: "white", fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: 'center' },
  saldoTarjeta: { backgroundColor: color.tarjeta, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", elevation: 5 },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: '600' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  cardCalendario: { backgroundColor: 'white', borderRadius: 20, padding: 15, elevation: 3, marginBottom: 25 },
  headerCalendario: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 10 },
  mesTexto: { fontSize: 18, fontWeight: 'bold', color: color.texto },
  filaSemana: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  textoDiaSemana: { width: 35, textAlign: 'center', color: color.textoSuave, fontWeight: '600', fontSize: 12 },
  gridDias: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  celdaDia: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderRadius: 17.5 },
  celdaHoy: { backgroundColor: color.verde, elevation: 2 },
  textoDia: { fontSize: 14, color: color.texto },
  textoDiaHoy: { color: 'white', fontWeight: 'bold' },
  puntoEvento: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 4 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', color: color.texto, marginBottom: 15 },
  vacioContainer: { alignItems: 'center', padding: 20 },
  listaEventos: { gap: 15 },
  cardEvento: { backgroundColor: 'white', borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  iconoContainer: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tituloEvento: { fontSize: 16, fontWeight: '600', color: color.texto },
  categoriaEvento: { fontSize: 12, color: color.textoSuave },
  montoEvento: { fontSize: 16, fontWeight: 'bold' },
});