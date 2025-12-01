import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import ModalNuevoPresupuesto from "../components/ModalNuevoPresupuesto";
import ModalEditarPresupuesto from "../components/ModalEditarPresupuesto";
import ModalNotificacionesGeneral from "../components/ModalNotificacionesGeneral";
import ModalConfiguracion from "../components/ModalConfiguracion";

import { initDB, getDB } from "../database/db";

const color = {
  fondo: "#f1f2f3",
  verde: "#2DA458",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  rojo: "#e74c3c",
};

function Encabezado({
  titulo,
  abrirNotificaciones,
  abrirConfiguraciones,
  saldo = 9638.35,
  moneda = "MXN",
}) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>

      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>🏦</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={estilos.saldo}>
            {saldo.toLocaleString("es-MX")}
          </Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        <View style={estilos.iconosAccion}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={abrirNotificaciones}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={color.verde}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={abrirConfiguraciones}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={color.verde}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PresupuestoScreen({ navigation }) {
  const [notiVisible, setNotiVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);

  const [presupuestos, setPresupuestos] = useState([]);

  const [modalNuevoVisible, setModalNuevoVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [presupuestoEditar, setPresupuestoEditar] = useState(null);

  const notificaciones = [
    "Nuevo ingreso registrado",
    "Presupuesto superado en Supermercado",
  ];

  // 🔥 Inicializar BD + cargar presupuestos
  useEffect(() => {
    (async () => {
      initDB();
      cargarPresupuestos();
    })();
  }, []);

  // 📌 CARGAR PRESUPUESTOS
  const cargarPresupuestos = async () => {
    try {
      const db = getDB();
      const result = await db.getAllAsync(
        "SELECT * FROM presupuestos ORDER BY id DESC"
      );

      setPresupuestos(result || []);
    } catch (error) {
      console.log("Error cargando presupuestos:", error);
    }
  };

  // 📌 ELIMINAR PRESUPUESTO
  const eliminarPresupuesto = (id) => {
    Alert.alert("Eliminar", "¿Deseas eliminar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const db = getDB();
            await db.runAsync(
              "DELETE FROM presupuestos WHERE id = ?",
              [id]
            );

            cargarPresupuestos();
          } catch (error) {
            console.log("Error eliminando presupuesto:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado
        titulo="Mis Presupuestos"
        abrirNotificaciones={() => setNotiVisible(true)}
        abrirConfiguraciones={() => setConfigVisible(true)}
      />

      <ScrollView
        contentContainerStyle={estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.headerSection}>
          <Text style={estilos.subtitulo}>Presupuestos Mensuales</Text>
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color={color.verde} />
          </TouchableOpacity>
        </View>

        <View style={estilos.listaContainer}>
          {presupuestos.map((item) => (
            <View key={item.id} style={estilos.cardPresupuesto}>
              <View style={estilos.barraLateral} />

              <View style={estilos.cardContent}>
                <View>
                  <Text style={estilos.categoriaTexto}>
                    {item.categoria}
                  </Text>
                  <Text style={estilos.montoTexto}>
                    ${item.monto}{" "}
                    <Text style={{ fontSize: 12, color: "#999" }}>
                      MXN
                    </Text>
                  </Text>
                </View>

                <View style={estilos.acciones}>
                  {/* EDITAR */}
                  <TouchableOpacity
                    style={estilos.btnIcono}
                    onPress={() => {
                      setPresupuestoEditar(item);
                      setModalEditarVisible(true);
                    }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={22}
                      color={color.verde}
                    />
                  </TouchableOpacity>

                  {/* ELIMINAR */}
                  <TouchableOpacity
                    style={estilos.btnIcono}
                    onPress={() => eliminarPresupuesto(item.id)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={22}
                      color={color.rojo}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* BOTÓN NUEVO */}
        <TouchableOpacity
          style={estilos.botonAgregar}
          onPress={() => setModalNuevoVisible(true)}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={estilos.textoBoton}>Nuevo Presupuesto</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal NUEVO */}
      <ModalNuevoPresupuesto
        visible={modalNuevoVisible}
        onClose={() => setModalNuevoVisible(false)}
        recargarPresupuestos={cargarPresupuestos}
      />

      {/* Modal EDITAR */}
      <ModalEditarPresupuesto
        visible={modalEditarVisible}
        presupuesto={presupuestoEditar}
        onClose={() => setModalEditarVisible(false)}
        recargarPresupuestos={cargarPresupuestos}
      />

      {/* Notificaciones */}
      <ModalNotificacionesGeneral
        visible={notiVisible}
        onClose={() => setNotiVisible(false)}
        notificaciones={notificaciones}
      />

      {/* Configuración */}
      <ModalConfiguracion
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        navigation={navigation}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },

  encabezado: {
    backgroundColor: color.verde,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    zIndex: 1,
  },
  titulo: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  saldoTarjeta: {
    backgroundColor: color.tarjeta,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 14, color: color.textoSuave, fontWeight: "600" },

  scrollContent: { padding: 20, paddingBottom: 100 },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  subtitulo: { fontSize: 18, fontWeight: "bold", color: "#333" },

  listaContainer: { gap: 15 },

  cardPresupuesto: {
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    height: 80,
  },
  barraLateral: { width: 6, backgroundColor: color.verde, height: "100%" },

  cardContent: {
    flex: 1,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoriaTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  montoTexto: { fontSize: 18, fontWeight: "bold", color: color.verde },

  acciones: { flexDirection: "row", gap: 15 },

  btnIcono: { padding: 5 },

  botonAgregar: {
    backgroundColor: color.verde,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
