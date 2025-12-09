import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Image,
    Modal,
    TextInput,
    Switch,
    ScrollView
} from 'react-native';
import { useUser } from '../Contexts/UserContext';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { UsuarioModel } from '../Models/UsuarioModel';

const PerfilScreen = ({ navigation }) => {
    const { usuario, setUsuario } = useUser();

    // Estados para modales
    const [modalDatosVisible, setModalDatosVisible] = useState(false);
    const [modalPasswordVisible, setModalPasswordVisible] = useState(false);

    // Estados para edición de datos
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [email, setEmail] = useState(usuario?.email || '');

    // Estados para cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estado para notificaciones
    const [notificacionesEnabled, setNotificacionesEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: () => {
                        setUsuario(null);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'BienvenidaScreen' }],
                        });
                    }
                }
            ]
        );
    };

    const pickImage = async () => {
        // Pedir permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            try {
                const newUri = result.assets[0].uri;
                await UsuarioModel.actualizarFoto(usuario.id, newUri);
                setUsuario({ ...usuario, foto_perfil: newUri });
                Alert.alert('Éxito', 'Foto de perfil actualizada');
            } catch (error) {
                Alert.alert('Error', 'No se pudo actualizar la foto');
            }
        }
    };

    const handleUpdateProfile = async () => {
        if (!nombre.trim() || !email.trim()) {
            Alert.alert('Error', 'Nombre y correo son obligatorios');
            return;
        }

        try {
            await UsuarioModel.actualizarPerfil(usuario.id, nombre, email);
            setUsuario({ ...usuario, nombre, email });
            setModalDatosVisible(false);
            Alert.alert('Éxito', 'Datos actualizados correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudieron actualizar los datos');
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }

        if (usuario.password !== currentPassword) {
            Alert.alert('Error', 'La contraseña actual es incorrecta');
            return;
        }

        try {
            await UsuarioModel.actualizarPassword(usuario.id, newPassword);
            // Actualizar contraseña en contexto para futuras validaciones sin reloguear
            setUsuario({ ...usuario, password: newPassword });
            setModalPasswordVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Éxito', 'Contraseña actualizada correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la contraseña');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileCard}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {usuario?.foto_perfil ? (
                            <Image source={{ uri: usuario.foto_perfil }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        )}
                        <View style={styles.editIconContainer}>
                            <Ionicons name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.userName}>{usuario?.nombre || 'Usuario'}</Text>
                    <Text style={styles.userEmail}>{usuario?.email || 'correo@ejemplo.com'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Configuración</Text>

                    <TouchableOpacity style={styles.optionItem} onPress={() => {
                        setNombre(usuario?.nombre || '');
                        setEmail(usuario?.email || '');
                        setModalDatosVisible(true);
                    }}>
                        <Ionicons name="person-outline" size={24} color={Colors.grisOscuro} />
                        <Text style={styles.optionText}>Editar Datos Personales</Text>
                        <Ionicons name="chevron-forward" size={24} color={Colors.grisTexto} />
                    </TouchableOpacity>

                    <View style={styles.optionItem}>
                        <Ionicons name="notifications-outline" size={24} color={Colors.grisOscuro} />
                        <Text style={styles.optionText}>Notificaciones</Text>
                        <Switch
                            value={notificacionesEnabled}
                            onValueChange={setNotificacionesEnabled}
                            trackColor={{ false: "#767577", true: Colors.moradoSecundario }}
                            thumbColor={notificacionesEnabled ? Colors.moradoPrimario : "#f4f3f4"}
                        />
                    </View>

                    <TouchableOpacity style={styles.optionItem} onPress={() => setModalPasswordVisible(true)}>
                        <Ionicons name="lock-closed-outline" size={24} color={Colors.grisOscuro} />
                        <Text style={styles.optionText}>Seguridad (Cambiar Contraseña)</Text>
                        <Ionicons name="chevron-forward" size={24} color={Colors.grisTexto} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.error} style={{ marginRight: 10 }} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>

            {/* Modal Editar Datos */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDatosVisible}
                onRequestClose={() => setModalDatosVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Datos</Text>

                        <Text style={styles.label}>Nombre Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={nombre}
                            onChangeText={setNombre}
                        />

                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#999' }]}
                                onPress={() => setModalDatosVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.moradoPrimario }]}
                                onPress={handleUpdateProfile}
                            >
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Cambiar Contraseña */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPasswordVisible}
                onRequestClose={() => setModalPasswordVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña Actual"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Nueva Contraseña"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Nueva Contraseña"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#999' }]}
                                onPress={() => setModalPasswordVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.moradoPrimario }]}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.modalButtonText}>Actualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.fondoPrincipal,
    },
    header: {
        backgroundColor: Colors.moradoPrimario,
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.moradoSecundario,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.moradoPrimario,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.moradoPrimario,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.grisOscuro,
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: Colors.grisTexto,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.grisOscuro,
        marginBottom: 15,
        marginLeft: 5,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
    },
    optionText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: Colors.grisOscuro,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFEBEB',
    },
    logoutText: {
        color: Colors.error,
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Estilos Modales
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
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.grisOscuro,
    },
    label: {
        fontSize: 14,
        color: Colors.grisTexto,
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PerfilScreen;
