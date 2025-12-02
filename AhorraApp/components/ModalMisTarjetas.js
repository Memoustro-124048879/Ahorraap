import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
  inputFondo: "#f5f5f5",
};

export default function ModalMisTarjetas({ visible, onClose }) {
  
  const [modo, setModo] = useState('lista');

  
  const [tarjetas, setTarjetas] = useState([
    { id: '1', banco: 'Bancomer', numero: '1234567812349821', tipo: 'debito' },
    { id: '2', banco: 'Santander', numero: '8765432187654432', tipo: 'credito' },
  ]);

  
  const [formBanco, setFormBanco] = useState('');
  const [formNumero, setFormNumero] = useState('');
  const [formFecha, setFormFecha] = useState('');
  const [formCVV, setFormCVV] = useState('');

  

  const getUltimos4 = (num) => num.slice(-4);

  
  const confirmarEliminar = (id) => {
    Alert.alert(
      "Eliminar Tarjeta",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => setTarjetas(tarjetas.filter(t => t.id !== id)) 
        }
      ]
    );
  };

  
  const guardarTarjeta = () => {
    if (!formBanco || formNumero.length < 16 || !formFecha || !formCVV) {
      Alert.alert("Datos incompletos", "Por favor revisa la información de tu tarjeta.");
      return;
    }

    const nuevaTarjeta = {
      id: Date.now().toString(),
      banco: formBanco,
      numero: formNumero,
      tipo: 'debito' 
    };

    setTarjetas([...tarjetas, nuevaTarjeta]);
    
    
    setFormBanco('');
    setFormNumero('');
    setFormFecha('');
    setFormCVV('');
    setModo('lista');
    Alert.alert("Éxito", "Tarjeta agregada correctamente.");
  };

  
  const renderItem = ({ item }) => (
    <View style={estilos.tarjetaRow}>
     
      <View style={estilos.infoContainer}>
        <View style={estilos.iconoCaja}>
          <Ionicons name={item.tipo === 'credito' ? "card" : "card-outline"} size={24} color={color.verde} />
        </View>
        <View>
          <Text style={estilos.bancoTexto}>{item.banco}</Text>
          <Text style={estilos.numeroTexto}>Terminación •••• {getUltimos4(item.numero)}</Text>
        </View>
      </View>

    
      <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={estilos.btnEliminar}>
        <Ionicons name="trash-outline" size={22} color={color.rojo} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>

         
          <View style={estilos.modalHeader}>
            {modo === 'formulario' ? (
              <TouchableOpacity onPress={() => setModo('lista')}>
                <Ionicons name="arrow-back" size={28} color={color.texto} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 28}} />
            )}
            
            <Text style={estilos.modalTitulo}>
              {modo === 'lista' ? 'Mis Tarjetas' : 'Nueva Tarjeta'}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          
          
          {modo === 'lista' ? (
            
            <>
              <View style={{ maxHeight: 300 }}>
                <FlatList 
                  data={tarjetas}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  ListEmptyComponent={
                    <Text style={estilos.textoVacio}>No tienes tarjetas guardadas.</Text>
                  }
                />
              </View>

              <TouchableOpacity style={estilos.botonPrincipal} onPress={() => setModo('formulario')}>
                <Text style={estilos.textoBotonPrincipal}>+ Agregar Tarjeta</Text>
              </TouchableOpacity>
            </>
          ) : (
          
            <ScrollView>
              <Text style={estilos.label}>Nombre del Banco</Text>
              <TextInput 
                style={estilos.input} 
                placeholder="Ej. Banamex" 
                value={formBanco}
                onChangeText={setFormBanco}
              />

              <Text style={estilos.label}>Número de Tarjeta</Text>
              <TextInput 
                style={estilos.input} 
                placeholder="0000 0000 0000 0000" 
                keyboardType="number-pad"
                maxLength={16}
                value={formNumero}
                onChangeText={setFormNumero}
              />

              <View style={estilos.filaDoble}>
                <View style={{flex:1, marginRight: 10}}>
                  <Text style={estilos.label}>Vencimiento</Text>
                  <TextInput 
                    style={estilos.input} 
                    placeholder="MM/AA" 
                    maxLength={5}
                    value={formFecha}
                    onChangeText={setFormFecha}
                  />
                </View>
                <View style={{flex:1}}>
                  <Text style={estilos.label}>CVV</Text>
                  <TextInput 
                    style={estilos.input} 
                    placeholder="123" 
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    value={formCVV}
                    onChangeText={setFormCVV}
                  />
                </View>
              </View>

              <TouchableOpacity style={estilos.botonPrincipal} onPress={guardarTarjeta}>
                <Text style={estilos.textoBotonPrincipal}>Guardar Tarjeta</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.texto,
  },
  
  
  tarjetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoCaja: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#f0f9f4', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bancoTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: color.texto,
  },
  numeroTexto: {
    fontSize: 13,
    color: color.textoSuave,
  },
  btnEliminar: {
    padding: 10,
  },
  textoVacio: {
    textAlign: 'center',
    color: color.textoSuave,
    marginTop: 20,
    fontStyle: 'italic',
  },

  
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textoSuave,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: color.inputFondo,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filaDoble: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  botonPrincipal: {
    backgroundColor: color.verde,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 25,
    shadowColor: color.verde,
    shadowOpacity: 0.3,
    shadowOffset: {width:0, height:4},
    elevation: 4
  },
  textoBotonPrincipal: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});