import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { obtenerTodasLasTransacciones } from "../controllers/FinanzasController";

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
  fondoFiltro: "#f0f0f0",
};

export default function ModalListadoTransacciones({ visible, onClose }) {
  
  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [listaVisual, setListaVisual] = useState([]);
  const [modoVista, setModoVista] = useState('lista'); 
  const [filtroActivo, setFiltroActivo] = useState(null);

  useEffect(() => {
    if (visible) {
      obtenerTodasLasTransacciones((datos) => {
        setHistorialCompleto(datos);
        setListaVisual(datos);
        setModoVista('lista');
        setFiltroActivo(null);
      });
    }
  }, [visible]);

  
  const fechasUnicas = [...new Set(historialCompleto.map(item => item.fecha))];
  const categoriasUnicas = [...new Set(historialCompleto.map(item => item.categoria))];

  const aplicarFiltro = (tipo, valor) => {
    const filtrados = historialCompleto.filter(item => item[tipo] === valor);
    setListaVisual(filtrados);
    setFiltroActivo(`${tipo === 'fecha' ? '📅' : '🏷️'} ${valor}`);
    setModoVista('lista');
  };

  const limpiarFiltros = () => {
    setListaVisual(historialCompleto);
    setFiltroActivo(null);
    setModoVista('lista');
  };

  const renderContenido = () => {
    
    // MODO SELECCIÓN FECHA
    if (modoVista === 'seleccionFecha') {
      return (
        <View style={estilos.selectorContainer}>
          <Text style={estilos.tituloSelector}>Selecciona una Fecha</Text>
          <ScrollView style={{maxHeight: 300}}>
            {fechasUnicas.map(fecha => (
              <TouchableOpacity key={fecha} style={estilos.opcionSelector} onPress={() => aplicarFiltro('fecha', fecha)}>
                <Text style={estilos.textoSelector}>{fecha}</Text>
                <Ionicons name="chevron-forward" size={18} color={color.textoSuave} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={estilos.btnCancelar} onPress={() => setModoVista('lista')}>
            <Text style={{color: '#666'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // MODO SELECCIÓN CATEGORÍA
    if (modoVista === 'seleccionCategoria') {
      return (
        <View style={estilos.selectorContainer}>
          <Text style={estilos.tituloSelector}>Selecciona una Categoría</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            {categoriasUnicas.map(cat => (
              <TouchableOpacity key={cat} style={estilos.chipCategoria} onPress={() => aplicarFiltro('categoria', cat)}>
                <Text style={estilos.textoChip}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={estilos.btnCancelar} onPress={() => setModoVista('lista')}>
            <Text style={{color: '#666'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // MODO LISTA
    return (
      <>
        <View style={estilos.filterRow}>
          <TouchableOpacity style={[estilos.filterButton, { backgroundColor: "#f5e0e0" }]} onPress={() => setModoVista('seleccionFecha')}>
            <Text style={[estilos.filterText, {color: "#c0392b"}]}>📅 Por Fecha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.filterButton, { backgroundColor: "#e0f5e0" }]} onPress={() => setModoVista('seleccionCategoria')}>
            <Text style={[estilos.filterText, {color: "#27ae60"}]}>🏷️ Por Categoría</Text>
          </TouchableOpacity>
        </View>

        {filtroActivo && (
          <View style={estilos.avisoFiltro}>
            <Text style={estilos.textoFiltroActivo}>Filtro: {filtroActivo}</Text>
            <TouchableOpacity onPress={limpiarFiltros}>
              <Text style={estilos.limpiarTexto}>Ver todos</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={listaVisual}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: "100%", maxHeight: 350 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20, color:'#999'}}>No hay resultados</Text>}
          renderItem={({ item }) => (
            <View style={estilos.item}>
              <View>
                <Text style={estilos.itemTexto}>{item.titulo}</Text>
                <Text style={estilos.itemSub}>{item.fecha} • {item.categoria}</Text>
              </View>
              <Text style={[estilos.monto, { color: item.tipo === 'ingreso' ? color.verde : color.rojo }]}>
                {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
              </Text>
            </View>
          )}
        />
      </>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalContainer}>
        <View style={estilos.modalContent}>
          <Text style={estilos.modalTitle}>Listado Filtrado</Text>
          
          {renderContenido()}

          {modoVista === 'lista' && (
            <TouchableOpacity style={estilos.modalButton} onPress={onClose}>
              <Text style={estilos.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "90%", backgroundColor: "white", borderRadius: 15, padding: 25, alignItems: "center", elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  filterRow: { flexDirection: "row", justifyContent: "center", width: "100%", marginBottom: 15 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginHorizontal: 5 },
  filterText: { fontSize: 13, fontWeight: "bold" },
  avisoFiltro: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10, paddingHorizontal: 5 },
  textoFiltroActivo: { fontSize: 14, fontWeight: '600', color: color.texto },
  limpiarTexto: { fontSize: 14, color: color.verde, fontWeight: 'bold', textDecorationLine: 'underline' },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, marginBottom: 8, backgroundColor: "#f9f9f9", borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#ddd' },
  itemTexto: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  monto: { fontSize: 16, fontWeight: "bold" },
  selectorContainer: { width: '100%', alignItems: 'center', paddingVertical: 10 },
  tituloSelector: { fontSize: 16, fontWeight: 'bold', color: color.texto, marginBottom: 15 },
  opcionSelector: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  textoSelector: { fontSize: 16, color: '#333' },
  chipCategoria: { backgroundColor: color.fondoFiltro, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, margin: 5, borderWidth: 1, borderColor: '#ddd' },
  textoChip: { color: '#333', fontWeight: '500' },
  btnCancelar: { marginTop: 20, padding: 10 },
  modalButton: { width: "100%", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 15, backgroundColor: "#6c757d" },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});