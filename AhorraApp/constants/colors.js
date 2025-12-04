/**
 * Paleta de colores de AhorraApp
 * 
 * Esta paleta centraliza todos los colores utilizados en la aplicación
 * para mantener consistencia visual y facilitar actualizaciones futuras.
 */

const Colors = {
    // Morado Primario - Color de la marca
    // RGB(90, 0, 180) - Tono profundo índigo/bermellón
    moradoPrimario: 'rgb(90, 0, 180)',

    // Morado Secundario - Variación pastel para fondos
    // Versión más suave y clara del morado primario
    moradoSecundario: 'rgb(180, 140, 230)',
    moradoSecundarioClaro: 'rgb(230, 220, 245)',

    // Blanco Puro - Fondo principal y texto que resalta
    blanco: '#FFFFFF',

    // Gris Oscuro - Texto secundario y estabilidad
    grisOscuro: '#2C3E50',
    grisTexto: '#666666',

    // Cian/Turquesa - Color de acción para botones importantes
    // Para botones de "Pagar", "Transferir", "Confirmar"
    cianAccion: '#00CED1',
    cianAccionOscuro: '#008B8D',

    // Colores adicionales para estados y feedback
    exito: '#4CAF50',        // Verde para indicar éxito
    error: '#E74C3C',        // Rojo para errores
    advertencia: '#FF9800',  // Naranja para advertencias
    info: '#2196F3',         // Azul para información

    // Fondos y bordes
    fondoPrincipal: '#F5F5F5',
    fondoSecundario: '#EAEAEA',
    borde: '#DDDDDD',

    // Transparencias útiles
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayClaro: 'rgba(0, 0, 0, 0.2)',
    blancoTransparente: 'rgba(255, 255, 255, 0.8)',
    moradoTransparente: 'rgba(90, 0, 180, 0.1)',
    cianTransparente: 'rgba(0, 206, 209, 0.1)',
};

export default Colors;
