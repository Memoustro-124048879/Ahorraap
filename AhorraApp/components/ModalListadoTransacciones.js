import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
  fondoFiltro: "#f0f0f0",
};

export default function ModalListadoTransacciones({ visible, onClose }) {
  
  // 1. BASE DE DATOS SIMULADA (Más variada para probar filtros)
  const historialGlobal = [
    { id: "1", descripcion: "Pago Oxxo", monto: -150, fecha: "2025-11-01", categoria: "Comida" },
    { id: "2", descripcion: "Uber a casa", monto: -220, fecha: "2025-11-01", categoria: "Transporte" },
    { id: "3", descripcion: "Spotify", monto: -129, fecha: "2025-11-03", categoria: "Entretenimiento" },
    { id: "4", descripcion: "Cena Tacos", monto: -450, fecha: "2025-11-03", categoria: "Comida" },
    { id: "5", descripcion: "Depósito Nómina", monto: 3500, fecha: "2025-11-05", categoria: "Ingreso" },
    { id: "6", descripcion: "Gasolina", monto: -800, fecha: "2025-11-05", categoria: "Transporte" },
  ];

  // 2. ESTADOS
  const [listaVisual, setListaVisual] = useState(historialGlobal);
  const [modoVista, setModoVista] = useState('lista'); // 'lista', 'seleccionFecha', 'seleccionCategoria'
  const [filtroActivo, setFiltroActivo] = useState(null); // Para saber qué estamos filtrando

  // Reiniciar cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setListaVisual(historialGlobal);
      setModoVista('lista');
      setFiltroActivo(null);
    }
  }, [visible]);

  // --- LÓGICA DE FILTRADO ---

  // Obtener opciones únicas
  const fechasUnicas = [...new Set(historialGlobal.map(item => item.fecha))];
  const categoriasUnicas = [...new Set(historialGlobal.map(item => item.categoria))];

  const aplicarFiltro = (tipo, valor) => {
    const filtrados = historialGlobal.filter(item => item[tipo] === valor);
    setListaVisual(filtrados);
    setFiltroActivo(`${tipo === 'fecha' ? '📅' : '🏷️'} ${valor}`); // Texto visual del filtro
    setModoVista('lista'); // Volvemos a la lista
  };

  const limpiarFiltros = () => {
    setListaVisual(historialGlobal);
    setFiltroActivo(null);
    setModoVista('lista');
  };

  // --- RENDERIZADO DE CONTENIDO DINÁMICO ---
  const renderContenido = () => {
    
    // CASO A: SELECCIONANDO FECHA
    if (modoVista === 'seleccionFecha') {
      return (
        <View style={estilos.selectorContainer}>
          <Text style={estilos.tituloSelector}>Selecciona una Fecha</Text>
          {fechasUnicas.map(fecha => (
            <TouchableOpacity key={fecha} style={estilos.opcionSelector} onPress={() => aplicarFiltro('fecha', fecha)}>
              <Text style={estilos.textoSelector}>{fecha}</Text>
              <Ionicons name="chevron-forward" size={18} color={color.textoSuave} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={estilos.btnCancelar} onPress={() => setModoVista('lista')}>
            <Text style={{color: '#666'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // CASO B: SELECCIONANDO CATEGORÍA
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

    // CASO C: LISTA NORMAL (Default)
    return (
      <>
        {/* Filtros Botones */}
        <View style={estilos.filterRow}>
          <TouchableOpacity 
            style={[estilos.filterButton, { backgroundColor: "#f5e0e0" }]} 
            onPress={() => setModoVista('seleccionFecha')}
          >
            <Ionicons name="calendar-outline" size={16} color="#c0392b" style={{marginRight:5}}/>
            <Text style={[estilos.filterText, {color: "#c0392b"}]}>Por Fecha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.filterButton, { backgroundColor: "#e0f5e0" }]} 
            onPress={() => setModoVista('seleccionCategoria')}
          >
            <Ionicons name="pricetag-outline" size={16} color="#27ae60" style={{marginRight:5}}/>
            <Text style={[estilos.filterText, {color: "#27ae60"}]}>Por Categoría</Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de filtro activo */}
        {filtroActivo && (
          <View style={estilos.avisoFiltro}>
            <Text style={estilos.textoFiltroActivo}>Filtro: {filtroActivo}</Text>
            <TouchableOpacity onPress={limpiarFiltros}>
              <Text style={estilos.limpiarTexto}>Ver todos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Items */}
        <FlatList
          data={listaVisual}
          keyExtractor={(item) => item.id}
          style={{ width: "100%", maxHeight: 300 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20, color:'#999'}}>No hay resultados</Text>}
          renderItem={({ item }) => (
            <View style={estilos.item}>
              <View>
                <Text style={estilos.itemTexto}>{item.descripcion}</Text>
                <Text style={estilos.itemSub}>{item.fecha} • {item.categoria}</Text>
              </View>
              <Text style={[estilos.monto, { color: item.monto > 0 ? color.verde : color.rojo }]}>
                {item.monto > 0 ? `+${item.monto}` : item.monto} MXN
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
          
          {/* TÍTULO CORREGIDO */}
          <Text style={estilos.modalTitle}>Listado de Transacciones</Text>
          
          {modoVista === 'lista' && (
            <Text style={estilos.modalSubtitle}>
              Filtrar movimientos
            </Text>
          )}

          {renderContenido()}

          {modoVista === 'lista' && (
            <TouchableOpacity
              style={[estilos.modalButton, { backgroundColor: "#6c757d", marginTop: 15 }]}
              onPress={onClose}
            >
              <Text style={estilos.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  // FILTROS
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  avisoFiltro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 5
  },
  textoFiltroActivo: {
    fontSize: 14,
    fontWeight: '600',
    color: color.texto
  },
  limpiarTexto: {
    fontSize: 14,
    color: color.verde,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  // LISTA
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd' // Decorativo
  },
  itemTexto: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  monto: { fontSize: 16, fontWeight: "bold" },
  
  // SELECTORES INTERNOS
  selectorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10
  },
  tituloSelector: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.texto,
    marginBottom: 15
  },
  opcionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  textoSelector: { fontSize: 16, color: '#333' },
  chipCategoria: {
    backgroundColor: color.fondoFiltro,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  textoChip: { color: '#333', fontWeight: '500' },
  btnCancelar: { marginTop: 20, padding: 10 },

  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});