import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import UnoScreen from './Unoscreen';
import Dosscreen from './Dosscreen';
import Tresscreen from './Tresscreen';
import Cuatroscreen from './Cuatroscreen';
import Cincoscreen from './Cincoscreen';
import Seisscreen from './Seisscreen';
import Sietescreen from './Sietescreen';
import Ochoscreen from './Ochoscreen';
import Nuevescreen from './Nuevescreen';
import Diezscreen from './Diezscreen';
import OnceScreen from './Oncescreen';
import DoceScreen from './Docescreen';


export default function MenuScreen() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'uno':
      return <UnoScreen />;
    case 'dos':     
        return <Dosscreen />;
    case 'tres':
      return <Tresscreen />;
    case 'cuatro':
      return <Cuatroscreen />;
    case 'cinco':   
        return <Cincoscreen />;
    case 'seis':
      return <Seisscreen />;
    case 'siete':
      return <Sietescreen />;
    case 'ocho':
      return <Ochoscreen />;
    case 'nueve':
      return <Nuevescreen />;
    case 'diez':
      return <Diezscreen />;
    case 'once':
      return <OnceScreen />;
    case 'doce':
      return <DoceScreen />;
    default:
      return (
        <View style={styles.botonesContainer}>
          <Text style={styles.menuTitle}>Menú de Screens</Text>
          <Button title="ScreenUno" onPress={() => setScreen('uno')} />
            <Button title="ScreenDos" onPress={() => setScreen('dos')} />
            <Button title="ScreenTres" onPress={() => setScreen('tres')} />
            <Button title="ScreenCuatro" onPress={() => setScreen('cuatro')} />
            <Button title="ScreenCinco" onPress={() => setScreen('cinco')} />
            <Button title="ScreenSeis" onPress={() => setScreen('seis')} />
            <Button title="ScreenSiete" onPress={() => setScreen('siete')} />
            <Button title="ScreenOcho" onPress={() => setScreen('ocho')} />
            <Button title="ScreenNueve" onPress={() => setScreen('nueve')} />
            <Button title="ScreenDiez" onPress={() => setScreen('diez')} />
            <Button title="ScreenOnce" onPress={() => setScreen('once')} />
            <Button title="ScreenDoce" onPress={() => setScreen('doce')} />        
        </View>
      );
  }
}

const styles = StyleSheet.create({
  botonesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
    borderColor: '#7bd1ff',
    borderWidth: 2,
    backgroundColor: '#36434f',
    gap: 8,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#7bd1ff',
  },
});
