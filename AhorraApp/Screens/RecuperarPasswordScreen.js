import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView
} from 'react-native';
import { AuthController } from '../Controllers/AuthController';
import Colors from '../constants/colors';

export default function RecuperarPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [palabraClave, setPalabraClave] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');

    const handleRecuperar = async () => {
        if (!email || !palabraClave || !nuevaPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        try {
            // 1. Verificar credenciales
            const userId = await AuthController.verificarCredencialesRecuperacion(email, palabraClave);

            // 2. Si todo OK, cambiar contraseña
            await AuthController.resetearPassword(userId, nuevaPassword);

            Alert.alert(
                '¡Éxito!',
                'Tu contraseña ha sido restablecida correctamente.',
                [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('LoginScreen') }]
            );
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingresa tu correo y la palabra clave que definiste al registrarte.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Palabra Clave (ej. Comida favorita)"
                    value={palabraClave}
                    onChangeText={setPalabraClave}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nueva Contraseña"
                    secureTextEntry
                    value={nuevaPassword}
                    onChangeText={setNuevaPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
                    <Text style={styles.buttonText}>Restablecer Contraseña</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.linkText}>Cancelar / Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.fondoPrincipal,
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.moradoPrimario,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.grisTexto,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    button: {
        backgroundColor: Colors.moradoPrimario,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: Colors.grisTexto,
        fontSize: 14,
    },
});
