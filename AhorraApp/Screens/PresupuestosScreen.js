import React, { useState, useCallback } from "react";
import {
    Alert,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { PresupuestoController } from '../Controllers/PresupuestoController';
import { useUser } from '../Contexts/UserContext';
import Colors from '../constants/colors';

export default function PresupuestosScreen({ navigation }) {
    const { usuario } = useUser();
    const [presupuestos, setPresupuestos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Formulario
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [mes, setMes] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
    const [editandoId, setEditandoId] = useState(null); // ID del presupuesto en edición

    // Filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroMes, setFiltroMes] = useState('');

    const cargarPresupuestos = async () => {
        if (usuario) {
            try {
                let datos;
                if (filtroCategoria || filtroMes) {
                    datos = await PresupuestoController.filtrarPresupuestos(usuario.id, filtroCategoria, filtroMes);
                } else {
                    datos = await PresupuestoController.obtenerPresupuestos(usuario.id);
                }
                setPresupuestos(Array.isArray(datos) ? datos : []);
            } catch (error) {
                console.error(error);
                setPresupuestos([]);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarPresupuestos();
        }, [usuario, filtroCategoria, filtroMes])
    );

    const handleGuardar = async () => {
        if (!monto || !categoria || !mes) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            if (editandoId) {
                await PresupuestoController.editarPresupuesto(
                    editandoId,
                    monto,
                    categoria,
                    mes
                );
                Alert.alert("Éxito", "Presupuesto actualizado correctamente");
            } else {
                await PresupuestoController.crearPresupuesto(
                    usuario.id,
                    monto,
                    categoria,
                    mes
                );
                Alert.alert("Éxito", "Presupuesto guardado correctamente");
            }

            setModalVisible(false);
            limpiarFormulario();
            cargarPresupuestos();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleEditar = (item) => {
        setMonto(item.monto.toString());
        setCategoria(item.categoria);
        setMes(item.mes);
        setEditandoId(item.id);
        setModalVisible(true);
    };

    const handleEliminar = (id) => {
        Alert.alert(
            "Eliminar Presupuesto",
            "¿Estás seguro de que deseas eliminar este presupuesto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await PresupuestoController.eliminarPresupuesto(id);
                            cargarPresupuestos();
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const limpiarFormulario = () => {
        setMonto('');
        setCategoria('');
        setMes(new Date().toISOString().substring(0, 7));
        setEditandoId(null);
    };

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
        if (mostrarFiltros) {
            setFiltroCategoria('');
            setFiltroMes('');
        }
    }

    const renderItem = ({ item }) => {
        if (!item) return null;
        return (
            <View style={estilos.fila}>
                <View style={{ flex: 1 }}>
                    <Text style={estilos.textoCategoria}>{item.categoria}</Text>
                    <Text style={estilos.textoMes}>{item.mes}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 10 }}>
                    <Text style={estilos.textoMonto}>${Number(item.monto).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => handleEditar(item)}>
                        <Ionicons name="pencil" size={20} color={Colors.grisOscuro} style={{ marginTop: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.error} style={{ marginTop: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={estilos.pantalla}>
            <View style={estilos.encabezado}>
                <Text style={estilos.titulo}>Mis Presupuestos</Text>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <TouchableOpacity onPress={toggleFiltros}>
                        <Ionicons name={mostrarFiltros ? "filter" : "filter-outline"} size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        limpiarFormulario();
                        setModalVisible(true);
                    }}>
                        <Ionicons name="add-circle" size={32} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

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
                            placeholder="Mes (YYYY-MM)"
                            value={filtroMes}
                            onChangeText={setFiltroMes}
                        />
                    </View>
                </View>
            )}

            <View style={estilos.cuerpo}>
                <View style={estilos.cajaBlanca}>
                    <FlatList
                        data={presupuestos}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <View style={estilos.vacio}>
                                <Text style={estilos.textoSuave}>No hay presupuestos registrados.</Text>
                            </View>
                        }
                    />
                </View>
            </View>

            {/* Modal Nuevo Presupuesto */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={estilos.modalContainer}>
                    <View style={estilos.modalContent}>
                        <Text style={estilos.modalTitle}>{editandoId ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</Text>

                        <TextInput
                            style={estilos.input}
                            placeholder="Monto Límite"
                            keyboardType="numeric"
                            value={monto}
                            onChangeText={setMonto}
                        />
                        <TextInput
                            style={estilos.input}
                            placeholder="Categoría (ej. Comida)"
                            value={categoria}
                            onChangeText={setCategoria}
                        />
                        <TextInput
                            style={estilos.input}
                            placeholder="Mes (YYYY-MM)"
                            value={mes}
                            onChangeText={setMes}
                        />

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
                                <Text style={estilos.textoBoton}>Guardar</Text>
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
    textoMes: { fontSize: 14, color: Colors.grisTexto },
    textoMonto: { fontWeight: 'bold', fontSize: 16, color: Colors.moradoPrimario },
    vacio: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    textoSuave: { color: Colors.grisTexto },

    // Filtros
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

    // Modal
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
});