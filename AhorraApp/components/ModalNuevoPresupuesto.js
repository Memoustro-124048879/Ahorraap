import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  fondoInput: "#f5f5f5"
};

const categoriasComunes = [
  { id: '1', nombre: 'Comida', icono: 'fast-food-outline' },
  { id: '2', nombre: 'Transporte', icono: 'bus-outline' },
  { id: '3', nombre: 'Ocio', icono: 'game-controller-outline' },
  { id: '4', nombre: 'Hogar', icono: 'home-outline' },
  { id: '5', nombre: 'Ropa', icono: 'shirt-outline' },
  { id: '6', nombre: 'Educación', icono: 'school-outline' },
];

export default function ModalNuevoPresupuesto({ visible, onClose, onGuardar }) {
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha hoy

  const handleGuardar = () => {
    if(categoria && monto && fecha){
      onGuardar({ categoria, monto, fecha });
      setCategoria("");
      setMonto("");
      setFecha(new Date().toISOString().split('T')[0]);
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
            <Text style={styles.titulo}>Nuevo Presupuesto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#ccc" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* CATEGORÍA (CHIPS) */}
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
                {categoriasComunes.map((cat) => (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={[styles.chip, categoria === cat.nombre && { backgroundColor: color.verde }]}
                    onPress={() => setCategoria(cat.nombre)}
                  >
                    <Ionicons name={cat.icono} size={16} color={categoria === cat.nombre ? 'white' : '#555'} style={{marginRight:5}} />
                    <Text style={{color: categoria === cat.nombre ? 'white' : '#555'}}>{cat.nombre}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TextInput 
                style={styles.input} 
                placeholder="O escribe otra..." 
                value={categoria} 
                onChangeText={setCategoria} 
            />

            {/* MONTO */}
            <Text style={styles.label}>Monto Límite</Text>
            <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="$0.00"
                value={monto} 
                onChangeText={setMonto} 
            />

            {/* FECHA */}
            <Text style={styles.label}>Fecha Vencimiento (Mensual)</Text>
            <View style={styles.inputConIcono}>
                <Ionicons name="calendar-outline" size={20} color="#999" />
                <TextInput 
                    style={styles.inputSinBorde} 
                    placeholder="YYYY-MM-DD" 
                    value={fecha} 
                    onChangeText={setFecha} 
                />
            </View>

            <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
              <Text style={styles.textoBoton}>Crear Presupuesto</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modal: { width: "90%", backgroundColor: "white", borderRadius: 20, padding: 20, elevation: 10, maxHeight: '80%' },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", color: color.texto },
  label: { fontSize: 14, marginBottom: 8, color: color.textoSuave, marginTop: 10, fontWeight: '600' },
  input: { backgroundColor: color.fondoInput, borderRadius: 10, paddingHorizontal: 15, height: 50, fontSize: 16 },
  inputConIcono: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.fondoInput, borderRadius: 10, paddingHorizontal: 15, height: 50 },
  inputSinBorde: { flex: 1, marginLeft: 10, fontSize: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  boton: { backgroundColor: color.verde, paddingVertical: 15, borderRadius: 15, alignItems: "center", marginTop: 30 },
  textoBoton: { color: "white", fontSize: 16, fontWeight: "bold" },
});