import React, { useState, useEffect } from "react";
import { 
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Platform, ScrollView, Alert, KeyboardAvoidingView, 
  TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  verde: "#2DA458", rojo: "#e74c3c", texto: "#101010",
  textoSuave: "#666", fondoInput: "#f5f5f5"
};

const categoriasComunes = [
  { id: '1', nombre: 'Comida', icono: 'fast-food-outline' },
  { id: '2', nombre: 'Transporte', icono: 'bus-outline' },
  { id: '3', nombre: 'Ocio', icono: 'game-controller-outline' },
  { id: '4', nombre: 'Salud', icono: 'medkit-outline' },
  { id: '5', nombre: 'Salario', icono: 'cash-outline' },
  { id: '6', nombre: 'Hogar', icono: 'home-outline' },
];

// RECIBIMOS LA PROP 'saldoDisponible'
export default function ModalNuevaTransaccion({ visible, onClose, onSave, saldoDisponible }) {
  
  const [tipo, setTipo] = useState('gasto');
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const cerrar = () => {
    setMonto(""); setDescripcion(""); setCategoria("");
    onClose();
  };

  const handleGuardar = () => {
    // 1. Validar campos
    if (!monto || !categoria || !descripcion) {
      Alert.alert("Faltan datos", "Por favor completa todos los campos.");
      return;
    }

    const montoNum = parseFloat(monto);

    // 2. VALIDACIÓN DE FONDOS (El Candado 🔒)
    if (tipo === 'gasto' && montoNum > saldoDisponible) {
      Alert.alert(
        "Fondos Insuficientes 🚫", 
        `No tienes suficiente saldo para este gasto.\n\nSaldo actual: $${saldoDisponible.toLocaleString()}\nIntento de gasto: $${montoNum.toLocaleString()}`
      );
      return; // ¡No dejamos pasar!
    }

    // 3. Guardar
    onSave({ tipo, monto: montoNum, categoria, descripcion, fecha, metodoPago });
    cerrar();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrar}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.tituloModal}>Nueva Transacción</Text>
              <TouchableOpacity onPress={cerrar}><Ionicons name="close-circle" size={28} color="#ccc" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* SELECTOR TIPO */}
              <View style={styles.selectorTipoContainer}>
                <TouchableOpacity style={[styles.botonTipo, tipo === 'ingreso' && { backgroundColor: '#e8f5e9', borderColor: color.verde }]} onPress={() => setTipo('ingreso')}>
                  <Ionicons name="arrow-up-circle" size={20} color={tipo === 'ingreso' ? color.verde : '#999'} />
                  <Text style={[styles.textoTipo, tipo === 'ingreso' && { color: color.verde, fontWeight: 'bold' }]}>Ingreso</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.botonTipo, tipo === 'gasto' && { backgroundColor: '#fdecea', borderColor: color.rojo }]} onPress={() => setTipo('gasto')}>
                  <Ionicons name="arrow-down-circle" size={20} color={tipo === 'gasto' ? color.rojo : '#999'} />
                  <Text style={[styles.textoTipo, tipo === 'gasto' && { color: color.rojo, fontWeight: 'bold' }]}>Gasto</Text>
                </TouchableOpacity>
              </View>

              {/* MONTO */}
              <Text style={styles.label}>Monto</Text>
              <View style={styles.inputMontoContainer}>
                <Text style={[styles.simboloMonto, { color: tipo === 'ingreso' ? color.verde : color.rojo }]}>$</Text>
                <TextInput style={[styles.inputMonto, { color: tipo === 'ingreso' ? color.verde : color.rojo }]} placeholder="0.00" placeholderTextColor="#ccc" keyboardType="numeric" value={monto} onChangeText={setMonto} />
              </View>

              {/* CATEGORÍA */}
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.categoriasContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categoriasComunes.map((cat) => (
                    <TouchableOpacity key={cat.id} style={[styles.chipCategoria, categoria === cat.nombre && { backgroundColor: color.verde }]} onPress={() => setCategoria(cat.nombre)}>
                      <Ionicons name={cat.icono} size={16} color={categoria === cat.nombre ? 'white' : '#555'} style={{marginRight:5}} />
                      <Text style={{color: categoria === cat.nombre ? 'white' : '#555'}}>{cat.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TextInput style={styles.input} placeholder="O escribe otra categoría..." value={categoria} onChangeText={setCategoria} />

              {/* DESCRIPCIÓN */}
              <Text style={styles.label}>Descripción</Text>
              <TextInput style={styles.input} placeholder="Ej. Cena con amigos" value={descripcion} onChangeText={setDescripcion} />

              {/* FECHA Y MÉTODO */}
              <View style={styles.filaDoble}>
                <View style={{flex:1, marginRight:10}}>
                  <Text style={styles.label}>Fecha</Text>
                  <View style={styles.inputConIcono}>
                    <Ionicons name="calendar-outline" size={20} color="#999" />
                    <TextInput style={styles.inputSinBorde} value={fecha} onChangeText={setFecha} placeholder="YYYY-MM-DD" />
                  </View>
                </View>
                <View style={{flex:1}}>
                  <Text style={styles.label}>Método</Text>
                  <View style={styles.inputConIcono}>
                    <Ionicons name="card-outline" size={20} color="#999" />
                    <TextInput style={styles.inputSinBorde} value={metodoPago} onChangeText={setMetodoPago} />
                  </View>
                </View>
              </View>

              {/* BOTÓN GUARDAR */}
              <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
                <Text style={styles.textoBoton}>Guardar Transacción</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, height: '90%', width: '100%', elevation: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tituloModal: { fontSize: 22, fontWeight: 'bold', color: color.texto },
  selectorTipoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  botonTipo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginHorizontal: 5 },
  textoTipo: { marginLeft: 8, fontSize: 16, color: '#666' },
  label: { fontSize: 14, fontWeight: '600', color: color.textoSuave, marginBottom: 8, marginTop: 10 },
  inputMontoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 10 },
  simboloMonto: { fontSize: 30, fontWeight: 'bold', marginRight: 5 },
  inputMonto: { fontSize: 40, fontWeight: 'bold', minWidth: 100, textAlign: 'center' },
  categoriasContainer: { flexDirection: 'row', marginBottom: 10 },
  chipCategoria: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  input: { backgroundColor: color.fondoInput, borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 16, color: color.texto },
  filaDoble: { flexDirection: 'row', justifyContent: 'space-between' },
  inputConIcono: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.fondoInput, borderRadius: 12, paddingHorizontal: 12, height: 50 },
  inputSinBorde: { flex: 1, marginLeft: 8, fontSize: 16, color: color.texto },
  botonGuardar: { backgroundColor: color.verde, paddingVertical: 16, borderRadius: 15, alignItems: 'center', marginTop: 30, marginBottom: 50, elevation: 5 },
  textoBoton: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});