import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  fondo: "#fff",
  gris: "#f0f0f0"
};

export default function ModalFiltroPresupuesto({ visible, onClose, datos, onAplicar }) {
  
  const [vista, setVista] = useState('menu'); 

  
  const categoriasUnicas = [...new Set(datos.map(item => item.categoria))];

  const mesesUnicos = [...new Set(datos.map(item => item.fecha.substring(0, 7)))];

  useEffect(() => {
    if (visible) setVista('menu');
  }, [visible]);

  const renderOpciones = () => {
    if (vista === 'menu') {
      return (
        <>
          <TouchableOpacity style={estilos.opcionBtn} onPress={() => setVista('categorias')}>
            <Ionicons name="pricetag-outline" size={22} color={color.verde} />
            <Text style={estilos.textoBtn}>Filtrar por Categoría</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={estilos.opcionBtn} onPress={() => setVista('fechas')}>
            <Ionicons name="calendar-outline" size={22} color={color.verde} />
            <Text style={estilos.textoBtn}>Filtrar por Mes/Fecha</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[estilos.opcionBtn, {borderBottomWidth:0}]} onPress={() => { onAplicar(null); onClose(); }}>
            <Ionicons name="close-circle-outline" size={22} color="red" />
            <Text style={[estilos.textoBtn, {color:'red'}]}>Borrar Filtros</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (vista === 'categorias') {
      return (
        <View>
          <Text style={estilos.subtitulo}>Selecciona Categoría:</Text>
          <View style={estilos.wrapContainer}>
            {categoriasUnicas.map((cat, index) => (
              <TouchableOpacity key={index} style={estilos.chip} onPress={() => { onAplicar({ tipo: 'categoria', valor: cat }); onClose(); }}>
                <Text style={estilos.textoChip}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={estilos.btnVolver} onPress={() => setVista('menu')}>
            <Text style={{color:'#666'}}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (vista === 'fechas') {
      return (
        <View>
          <Text style={estilos.subtitulo}>Selecciona Mes:</Text>
          <View style={estilos.wrapContainer}>
            {mesesUnicos.map((mes, index) => (
              <TouchableOpacity key={index} style={estilos.chip} onPress={() => { onAplicar({ tipo: 'fecha', valor: mes }); onClose(); }}>
                <Text style={estilos.textoChip}>{mes}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={estilos.btnVolver} onPress={() => setVista('menu')}>
            <Text style={{color:'#666'}}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.overlay}>
        <View style={estilos.modal}>
          <View style={estilos.header}>
            <Text style={estilos.titulo}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderOpciones()}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: color.texto },
  opcionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  textoBtn: { flex: 1, marginLeft: 15, fontSize: 16, color: color.texto },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 10 },
  wrapContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: color.gris, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  textoChip: { fontSize: 14, color: '#333' },
  btnVolver: { marginTop: 10, alignSelf: 'center', padding: 10 }
});