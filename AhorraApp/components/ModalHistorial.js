import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { obtenerTodasLasTransacciones } from "../controllers/FinanzasController";

export default function ModalHistorial({ visible, onClose }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    if (visible) {
      obtenerTodasLasTransacciones((datos) => setLista(datos));
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>Historial Completo</Text>
          
          <FlatList
            data={lista}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTexto}>{item.titulo}</Text>
                <Text style={[styles.monto, { color: item.tipo === 'ingreso' ? "green" : "red" }]}>
                   {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
                </Text>
              </View>
            )}
          />

          <TouchableOpacity style={styles.btnCerrar} onPress={onClose}>
            <Text style={styles.btnCerrarTexto}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  modal: { backgroundColor: "white", padding: 20, borderRadius: 18, maxHeight: '80%' },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: 'center' },
  item: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 0.5, borderColor: "#ccc" },
  itemTexto: { fontSize: 16 },
  monto: { fontSize: 16, fontWeight: "bold" },
  btnCerrar: { backgroundColor: "#2DA458", marginTop: 20, padding: 12, borderRadius: 10 },
  btnCerrarTexto: { color: "white", textAlign: "center", fontWeight: "bold" },
});