import React, { useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet 
} from "react-native";

export default function ModalNuevaTransaccion({ visible, onClose, onSave }) {

  const [titular, setTitular] = useState("");
  const [banco, setBanco] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleGuardar = () => {
    if (!titular || !banco || !tarjeta || !monto || !motivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevaTransaccion = {
      id: Date.now().toString(),
      titular,
      banco,
      tarjeta,
      monto: parseFloat(monto),
      motivo,
      fecha: new Date().toISOString()
    };

    onSave(nuevaTransaccion);

    // limpiar
    setTitular("");
    setBanco("");
    setTarjeta("");
    setMonto("");
    setMotivo("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>

          <Text style={styles.titulo}>Datos</Text>

          {/* INPUTS */}
          <TextInput 
            placeholder="Titular de la tarjeta"
            style={styles.input}
            value={titular}
            onChangeText={setTitular}
          />

          <TextInput 
            placeholder="Banco (receptor)"
            style={styles.input}
            value={banco}
            onChangeText={setBanco}
          />

          <TextInput 
            placeholder="Número de la tarjeta"
            keyboardType="numeric"
            style={styles.input}
            value={tarjeta}
            onChangeText={setTarjeta}
          />

          <TextInput 
            placeholder="Monto"
            keyboardType="numeric"
            style={styles.input}
            value={monto}
            onChangeText={setMonto}
          />

          <TextInput 
            placeholder="Motivo"
            style={styles.input}
            value={motivo}
            onChangeText={setMotivo}
          />

          {/* BOTONES */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnAceptar} onPress={handleGuardar}>
              <Text style={styles.btnAceptarTexto}>Aceptar transacción</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.btnCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#d9a3c96b", // rosita como la imagen
    borderRadius: 14,
    padding: 20
  },
  titulo: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#090808ff"
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },
  footer: {
    marginTop: 10,
    alignItems: "flex-end"
  },
  btnAceptar: {
    backgroundColor: "#c5eddc", // verde muy clarito como la imagen
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8
  },
  btnAceptarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a3d2c"
  },
  btnCancelar: {
    color: "#6b0000",
    fontSize: 14,
    marginTop: 4
  }
});
