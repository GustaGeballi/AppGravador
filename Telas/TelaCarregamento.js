import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

//==================================================================

export default function TelaCarregamento() {
  const [carregando, setCarregando] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
      navigation.navigate('Gravador');
    }, 4000);

    // Limpa o timer quando o componente é desmontado ou atualizado
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {carregando ? (
        <LottieView
          style={styles.animacao}
          source={require('../assets/carregando-animacao.json')}
          autoPlay
          loop
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  animacao: {
    width: 200,
    height: 200,
  },
});