import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function Nuevescreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Screen numero 9</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  texto: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});