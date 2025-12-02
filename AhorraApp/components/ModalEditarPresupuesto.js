import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  fondoInput: "#f5f5f5"
};

export default function ModalEditarPresupuesto({ visible, onClose, presupuesto, onGuardar }) {
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if(presupuesto){
      setCategoria(presupuesto.categoria);
      setMonto(presupuesto.monto.toString());
      setFecha(presupuesto.fecha || new Date().toISOString().split('T')[0]);
    }
  }, [presupuesto]);

  const handleGuardar = () => {
    if(categoria && monto && fecha){
      onGuardar({ ...presupuesto, categoria, monto, fecha });
      onClose();
    } else {
      alert("Completa todos los campos");
    }
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <View style={styles.header}>
            <Text style={styles.titulo}>Editar Presupuesto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#ccc" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.label}>Categoría</Text>
            <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />

            <Text style={styles.label}>Monto</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={monto} onChangeText={setMonto} />

            <Text style={styles.label}>Fecha</Text>
            <TextInput style={styles.input} value={fecha} onChangeText={setFecha} placeholder="YYYY-MM-DD" />

            <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
              <Text style={styles.textoBoton}>Guardar Cambios</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modal: { width: "90%", backgroundColor: "white", borderRadius: 20, padding: 20, elevation: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", color: color.texto },
  label: { fontSize: 13, marginBottom: 5, color: color.textoSuave, marginTop: 10 },
  input: { backgroundColor: color.fondoInput, borderRadius: 10, paddingHorizontal: 15, height: 45 },
  boton: { backgroundColor: color.verde, paddingVertical: 12, borderRadius: 15, alignItems: "center", marginTop: 25 },
  textoBoton: { color: "white", fontSize: 16, fontWeight: "bold" },
});