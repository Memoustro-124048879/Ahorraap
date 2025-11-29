import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";

const ModalListadoTransacciones = ({ visible, onClose }) => {
  const historialFalso = [
    { id: "1", descripcion: "Pago Oxxo", monto: -150, fecha: "2025-11-01", categoria: "Comida" },
    { id: "2", descripcion: "Depósito Nómina", monto: 3500, fecha: "2025-11-05", categoria: "Ingreso" },
    { id: "3", descripcion: "Spotify", monto: -129, fecha: "2025-11-03", categoria: "Entretenimiento" },
    { id: "4", descripcion: "Uber", monto: -220, fecha: "2025-11-05", categoria: "Transporte" },
  ];

  const [listaFiltrada, setListaFiltrada] = useState(historialFalso);

  const handleFilter = (type) => {
    let filtradas = historialFalso;
    if (type === "fecha") {
      filtradas = historialFalso.filter(item => item.fecha === "2025-11-05"); // ejemplo
    } else if (type === "categoria") {
      filtradas = historialFalso.filter(item => item.categoria.toLowerCase() === "comida"); // ejemplo
    }
    setListaFiltrada(filtradas);
  };

  useEffect(() => {
    if (visible) {
      setListaFiltrada(historialFalso); // resetear lista al abrir
    }
  }, [visible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Listado de las transferencias</Text>
          <Text style={styles.modalSubtitle}>
            Puedes filtrar tus movimientos por fecha o categoría.
          </Text>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: "#f5e0e0" }]}
              onPress={() => handleFilter("fecha")}
            >
              <Text style={styles.filterText}>Filtrar por fecha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: "#e0f5e0" }]}
              onPress={() => handleFilter("categoria")}
            >
              <Text style={styles.filterText}>Filtrar por categoría</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={listaFiltrada}
            keyExtractor={(item) => item.id}
            style={{ width: "100%", maxHeight: 250 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTexto}>{item.descripcion}</Text>
                <Text style={[styles.monto, { color: item.monto > 0 ? "green" : "red" }]}>
                  {item.monto} MXN
                </Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: "#6c757d", marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
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
    marginBottom: 10,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  itemTexto: { fontSize: 16 },
  monto: { fontSize: 16, fontWeight: "bold" },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalListadoTransacciones;
