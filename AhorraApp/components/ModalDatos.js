// components/ModalDatos.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const color = {
  verde: "#2DA458",
  texto: "#101010",
  textoSuave: "#666",
};

// Componente de Fila (Detecta si es input o texto)
const DatoFila = ({ label, valor, icono, editable, onChangeText, isLocked }) => (
  <View style={estilos.datoFila}>
    <View style={estilos.datoIcono}>
      <Ionicons name={icono} size={20} color={color.verde} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={estilos.datoLabel}>{label}</Text>
      
      {editable && !isLocked ? (
        <TextInput 
          style={estilos.inputEdit} 
          value={valor} 
          onChangeText={onChangeText}
          autoFocus={true}
        />
      ) : (
        <Text style={[estilos.datoValor, isLocked && {color: '#999'}]}>{valor}</Text>
      )}
    </View>
    
    {/* Icono de lápiz pequeño si es editable */}
    {editable && !isLocked && (
      <Ionicons name="pencil" size={16} color={color.verde} />
    )}
  </View>
);

export default function ModalDatos({ visible, onClose, datosActuales, onGuardar }) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(datosActuales);

  // Cada vez que se abre el modal, cargamos los datos actuales
  useEffect(() => {
    if (visible) {
      setTempData(datosActuales);
      setIsEditing(false); // Siempre empieza en modo lectura
    }
  }, [visible, datosActuales]);

  const handleAccion = () => {
    if (isEditing) {
      // Si estaba editando, ahora GUARDAMOS
      onGuardar(tempData);
    } else {
      // Si estaba leyendo, ahora EDITAMOS
      setIsEditing(true);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContent}>
          
          {/* Header */}
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>
              {isEditing ? "Editando Perfil" : "Mis Datos"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Cuerpo */}
          <View style={estilos.modalBody}>
            <DatoFila 
              label="Nombre Completo" 
              valor={tempData.nombre} 
              icono="person" 
              editable={isEditing}
              onChangeText={(text) => setTempData({...tempData, nombre: text})}
            />
            <DatoFila 
              label="Correo Electrónico" 
              valor={tempData.email} 
              icono="mail" 
              editable={isEditing}
              onChangeText={(text) => setTempData({...tempData, email: text})}
            />
            <DatoFila 
              label="Teléfono" 
              valor={tempData.telefono} 
              icono="call" 
              editable={isEditing}
              onChangeText={(text) => setTempData({...tempData, telefono: text})}
            />
            
            {/* El ID no se debe editar nunca */}
            <DatoFila 
              label="ID de Usuario" 
              valor={tempData.idUsuario} 
              icono="finger-print" 
              editable={isEditing}
              isLocked={true} 
            />
          </View>

          {/* Botón Dinámico */}
          <TouchableOpacity 
            style={[estilos.botonModal, isEditing && { backgroundColor: '#34495e' }]} 
            onPress={handleAccion}
          >
            <Text style={estilos.textoBotonModal}>
              {isEditing ? "Guardar Cambios" : "Editar Información"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 4},
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.texto,
  },
  modalBody: {
    marginBottom: 20,
  },
  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  datoIcono: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f9f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  datoLabel: {
    fontSize: 12,
    color: color.textoSuave,
    fontWeight: '600',
  },
  datoValor: {
    fontSize: 16,
    color: color.texto,
    fontWeight: '500',
  },
  // Estilo para cuando es Input
  inputEdit: {
    fontSize: 16,
    color: color.texto,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: color.verde,
    paddingVertical: 2,
  },
  botonModal: {
    backgroundColor: color.verde,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotonModal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});