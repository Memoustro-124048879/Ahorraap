import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { TransaccionController } from '../Controllers/TransaccionController';
import { useUser } from '../Contexts/UserContext';
import Colors from '../constants/colors';

// Pantalla principal para visualizar y gestionar transacciones (gastos e ingresos)
export default function TransaccionesScreen({ navigation }) {
  // Obtenemos el usuario autenticado desde el contexto global
  const { usuario } = useUser();

  // --- Estados de la Pantalla ---
  const [transacciones, setTransacciones] = useState([]); // Lista de datos
  const [transaccionEditando, setTransaccionEditando] = useState(null); // Transacción seleccionada para editar
  const [modalVisible, setModalVisible] = useState(false); // Visibilidad del modal

  // --- Estados del Formulario (Modal) ---
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy por defecto

  // --- Estados de Filtros ---
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Función para obtener las transacciones desde la base de datos
  const cargarTransacciones = async () => {
    if (usuario) {
      try {
        let datos;
        // Aplicamos filtros si el usuario ha escrito algo
        if (filtroCategoria || filtroFecha) {
          datos = await TransaccionController.filtrarTransacciones(usuario.id, filtroCategoria, filtroFecha);
        } else {
          datos = await TransaccionController.obtenerTransacciones(usuario.id);
        }
        setTransacciones(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error(error);
        setTransacciones([]);
      }
    }
  };

  // Ejecuta la carga de datos cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      cargarTransacciones();
    }, [usuario, filtroCategoria, filtroFecha]) // Dependencias que disparan la recarga
  );

  // Prepara el modal para editar una transacción existente
  const abrirModalEditar = (item) => {
    setTransaccionEditando(item);
    setMonto(item.monto.toString());
    setTipo(item.tipo);
    setCategoria(item.categoria);
    setFecha(item.fecha);
    setDescripcion(item.descripcion || '');
    setModalVisible(true);
  };

  // Guarda nueva transacción o actualiza una existente
  const handleGuardar = async () => {
    // Validaciones básicas de campos obligatorios
    if (!monto || !categoria || !fecha) {
      Alert.alert("Error", "Monto, categoría y fecha son obligatorios");
      return;
    }

    try {
      if (transaccionEditando) {
        // Modo Edición
        await TransaccionController.editarTransaccion(
          transaccionEditando.id,
          monto,
          tipo,
          categoria,
          fecha,
          descripcion
        );
        Alert.alert("Éxito", "Transacción actualizada correctamente");
      } else {
        // Modo Creación
        // Función auxiliar para llamar al controller con opción de ignorar validación
        const crearConValidacion = async (ignorar = false) => {
          return await TransaccionController.agregarTransaccion(
            usuario.id,
            monto,
            tipo,
            categoria,
            fecha,
            descripcion,
            ignorar // flag para saltar chequeo
          );
        };

        try {
          const resultado = await crearConValidacion(false);
          if (resultado.alerta) Alert.alert("Aviso", resultado.alerta);
          else Alert.alert("Éxito", "Transacción guardada correctamente");
        } catch (err) {
          if (err.isBudgetWarning) {
            // Es una advertencia de presupuesto
            Alert.alert(
              "Presupuesto Excedido",
              `${err.message}\n¿Deseas continuar de todas formas?`,
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Continuar",
                  onPress: async () => {
                    try {
                      await crearConValidacion(true); // Reintentar ignorando presupuesto
                      Alert.alert("Éxito", "Transacción guardada (Presupuesto Excedido)");
                      setModalVisible(false);
                      limpiarFormulario();
                      cargarTransacciones();
                    } catch (retryErr) {
                      Alert.alert("Error", retryErr.message);
                    }
                  }
                }
              ]
            );
            return; // Salimos para no ejecutar el código de éxito/cierre de abajo todavía
          } else {
            // Error normal
            throw err;
          }
        }
      }

      setModalVisible(false);
      limpiarFormulario();
      cargarTransacciones(); // Actualizamos la lista
    } catch (error) {
      // Capturamos errores generales
      Alert.alert("Error", error.message);
    }
  };

  // Elimina una transacción solicitando confirmación
  const handleEliminar = (id) => {
    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro de que deseas eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await TransaccionController.eliminarTransaccion(id);
              cargarTransacciones();
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  const limpiarFormulario = () => {
    setTransaccionEditando(null);
    setMonto('');
    setTipo('gasto');
    setCategoria('');
    setDescripcion('');
    setFecha(new Date().toISOString().split('T')[0]);
  };

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
    if (mostrarFiltros) {
      // Al ocultar filtros, limpiamos los valores para mostrar todo
      setFiltroCategoria('');
      setFiltroFecha('');
    }
  }

  // Renderiza cada fila de la lista de transacciones
  const renderItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={estilos.fila}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.textoCategoria}>{item.categoria || 'Sin categoría'}</Text>
          <Text style={estilos.textoDescripcion}>{item.descripcion || ''}</Text>
          <Text style={estilos.textoFecha}>{item.fecha || ''}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 10 }}>
          <View>
            <Text style={[estilos.textoMonto, { color: item.tipo === 'ingreso' ? Colors.exito : Colors.error }]}>
              {item.tipo === 'ingreso' ? '+' : '-'}${Number(item.monto || 0).toFixed(2)}
            </Text>
            <Text style={estilos.textoTipo}>{(item.tipo || '').toUpperCase()}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity onPress={() => abrirModalEditar(item)}>
              <Ionicons name="pencil" size={20} color={Colors.moradoPrimario} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={estilos.pantalla}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Mis Transacciones</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={toggleFiltros}>
            <Ionicons name={mostrarFiltros ? "filter" : "filter-outline"} size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección de Filtros */}
      {mostrarFiltros && (
        <View style={estilos.filtroContainer}>
          <Text style={estilos.filtroTitulo}>Filtrar por:</Text>
          <View style={estilos.filtroInputs}>
            <TextInput
              style={[estilos.input, estilos.filtroInput]}
              placeholder="Categoría"
              value={filtroCategoria}
              onChangeText={setFiltroCategoria}
            />
            <TextInput
              style={[estilos.input, estilos.filtroInput]}
              placeholder="Fecha (YYYY-MM-DD)"
              value={filtroFecha}
              onChangeText={setFiltroFecha}
            />
          </View>
        </View>
      )}

      {/* Lista Principal */}
      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <FlatList
            data={transacciones}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={estilos.vacio}>
                <Text style={estilos.textoSuave}>No hay transacciones registradas.</Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Ventana Modal (Crear/Editar) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitle}>{transaccionEditando ? 'Editar Transacción' : 'Nueva Transacción'}</Text>

            {/* Selector Tipo */}
            <View style={estilos.selectorTipo}>
              <TouchableOpacity
                style={[estilos.botonTipo, tipo === 'ingreso' && estilos.botonTipoActivoVerde]}
                onPress={() => setTipo('ingreso')}
              >
                <Text style={[estilos.textoTipoBoton, tipo === 'ingreso' && estilos.textoTipoActivo]}>Ingreso</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botonTipo, tipo === 'gasto' && estilos.botonTipoActivoRojo]}
                onPress={() => setTipo('gasto')}
              >
                <Text style={[estilos.textoTipoBoton, tipo === 'gasto' && estilos.textoTipoActivo]}>Gasto</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs del Formulario */}
            <TextInput
              style={estilos.input}
              placeholder="Monto"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />
            <TextInput
              style={estilos.input}
              placeholder="Categoría (ej. Comida, Salario)"
              value={categoria}
              onChangeText={setCategoria}
            />
            <TextInput
              style={estilos.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={fecha}
              onChangeText={setFecha}
            />
            <TextInput
              style={estilos.input}
              placeholder="Descripción (Opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            {/* Botones del Modal */}
            <View style={estilos.modalBotones}>
              <TouchableOpacity
                style={[estilos.botonModal, { backgroundColor: '#999' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={estilos.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botonModal, { backgroundColor: Colors.moradoPrimario }]}
                onPress={handleGuardar}
              >
                <Text style={estilos.textoBoton}>{transaccionEditando ? 'Actualizar' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Colors.fondoPrincipal },
  encabezado: {
    backgroundColor: Colors.moradoPrimario,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: { color: "white", fontSize: 20, fontWeight: "bold" },
  cuerpo: { flex: 1, padding: 16 },
  cajaBlanca: {
    flex: 1,
    backgroundColor: Colors.blanco,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  fila: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borde,
    alignItems: 'center',
  },
  textoCategoria: { fontWeight: 'bold', fontSize: 16, color: Colors.grisOscuro },
  textoDescripcion: { fontSize: 14, color: Colors.grisTexto },
  textoFecha: { fontSize: 12, color: '#999' },
  textoMonto: { fontWeight: 'bold', fontSize: 16 },
  textoTipo: { fontSize: 10, color: '#999', textAlign: 'right' },
  vacio: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  textoSuave: { color: Colors.grisTexto },

  filtroContainer: {
    backgroundColor: Colors.moradoPrimario,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filtroTitulo: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filtroInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  filtroInput: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 0,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonModal: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  textoBoton: { color: 'white', fontWeight: 'bold' },

  selectorTipo: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botonTipo: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  botonTipoActivoVerde: {
    backgroundColor: Colors.exito,
  },
  botonTipoActivoRojo: {
    backgroundColor: Colors.error,
  },
  textoTipoBoton: {
    color: '#333',
    fontWeight: '600',
  },
  textoTipoActivo: {
    color: 'white',
  },
});