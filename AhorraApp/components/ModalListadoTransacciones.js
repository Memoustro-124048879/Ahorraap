import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Importamos el controlador para leer datos reales
import { obtenerTodasLasTransacciones } from "../controllers/FinanzasController";

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
  fondoFiltro: "#f0f0f0",
};

export default function ModalListadoTransacciones({ visible, onClose }) {
  
  const [listaVisual, setListaVisual] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales al abrir el modal
  useEffect(() => {
    if (visible) {
      setLoading(true);
      obtenerTodasLasTransacciones((datos) => {
        setListaVisual(datos);
        setLoading(false);
      });
    }
  }, [visible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalContainer}>
        <View style={estilos.modalContent}>
          
          <Text style={estilos.modalTitle}>Historial Real (SQLite)</Text>
          
          <FlatList
            data={listaVisual}
            keyExtractor={(item) => item.id.toString()}
            style={{ width: "100%", maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{textAlign:'center', marginTop:20, color:'#999'}}>
                No hay transacciones registradas.
              </Text>
            }
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

          <TouchableOpacity
            style={[estilos.modalButton, { backgroundColor: "#6c757d", marginTop: 15 }]}
            onPress={onClose}
          >
            <Text style={estilos.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "90%", backgroundColor: "white", borderRadius: 15, padding: 25, alignItems: "center", elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, marginBottom: 8, backgroundColor: "#f9f9f9", borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#ddd' },
  itemTexto: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  monto: { fontSize: 16, fontWeight: "bold" },
  modalButton: { width: "100%", padding: 12, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});