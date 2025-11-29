import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

const ModalListadoTransacciones = ({ visible, onClose }) => {
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Aquí se mostraría la lista de transferencias filtradas."
  );

  const handleFilter = (type) => {
    const msg =
      type === "fecha"
        ? "Filtro por fecha aplicado."
        : "Filtro por categoría aplicado.";

    setFeedbackMessage(msg);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>

        <View style={styles.modalContent}>

          {/* TITULO */}
          <Text style={styles.modalTitle}>Listado de las transferencias</Text>

          {/* SUBTÍTULO */}
          <Text style={styles.modalSubtitle}>
            Puedes filtrar tus movimientos por fecha o categoría.
          </Text>

          {/* BOTONES DE FILTRO */}
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

          {/* MENSAJE CENTRAL */}
          <View style={styles.centerBox}>
            <Text style={styles.centerText}>{feedbackMessage}</Text>
          </View>

          {/* BOTÓN CERRAR */}
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

  // FILTROS
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

  // MENSAJE CENTRAL
  centerBox: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
  },

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

