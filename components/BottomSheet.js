import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnUI,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = React.forwardRef(({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, { damping: 20 });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => { //O método onStart() é chamado quando o gesto de pan começa, e neste caso ele armazena a posição atual do translateY em context.value.y.
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {//O método onUpdate() é chamado durante o gesto de pan e atualiza o valor de translateY com base no movimento do usuário. A nova posição translateY é definida como a soma da posição anterior context.value.y e o valor de event.translationY (a quantia pela qual o usuário arrastou o dedo). Além disso, o valor de translateY é limitado a MAX_TRANSLATE_Y usando o método Math.max().
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {//O método onEnd() é chamado quando o usuário para de arrastar e determina se a folha de fundo deve ser rolada para cima ou para baixo. Se a posição atual de translateY for maior que -SCREEN_HEIGHT / 2, a folha de fundo será rolada para a posição inicial (0). Se a posição atual de translateY for menor que -SCREEN_HEIGHT / 5, a folha de fundo será rolada para a posição máxima MAX_TRANSLATE_Y.
        if (translateY.value > -SCREEN_HEIGHT / 1.5) {
          scrollTo(0);
        } else if (translateY.value < -SCREEN_HEIGHT / 2) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });


      //Aqui traduz e transforma os gestos do usuário, podendo mexer a BottomSheet
      //Worklet foi utilizado para transformar esse const em um 'trabalho externo', para funcionar melhor. Também foi testado runOnUI(), porém não deu certo
      const rBottomSheetStyle = useAnimatedStyle(() => {
        'worklet'; 
        const borderRadius = interpolate(
          translateY.value,
          [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
          [25, 5],
          Extrapolate.CLAMP
        );
      
        return {
          borderRadius,
          transform: [{ translateY: translateY.value }],
        };
      });
      
      

    return ( //Esse código serve para 'captar' os gestos do usuário, utilizando o Gesture 
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle, styles.common]}>
          <View style={styles.line} />
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  common:{
    shadowColor: "#000",
    shadowOffset:{
      width: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheetContainer: {
    height: (SCREEN_HEIGHT-5),
    width: '100%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: (SCREEN_HEIGHT+0),
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 7,
    backgroundColor: '#5907d6',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 15,
  },
});

export default BottomSheet;