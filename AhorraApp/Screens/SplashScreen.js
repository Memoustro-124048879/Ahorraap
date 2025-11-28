import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  Dimensions 
} from 'react-native';


const cerditoImg = require('../assets/cerditoverde.jpeg'); 

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {

  // --- TIEMPO ---
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar barStyle="light-content" backgroundColor="#2f8a4f" />

    
      <View style={styles.logoContainer}>
        <Image 
          source={cerditoImg} 
          style={styles.logo} 
        />
      </View>

      
      <View style={styles.textContainer}>
        <Text style={styles.textNormal}>Cuida de tu dinero con</Text>
        <Text style={styles.textBold}>AHORRA APP+</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DA458', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logo: {
    width: 150,  
    height: 150, 
    resizeMode: 'contain', 
  },
  textContainer: {
    position: 'absolute', 
    bottom: 50, 
    alignItems: 'center',
  },
  textNormal: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },
  textBold: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
});