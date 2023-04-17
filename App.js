// //========================= import 1
// import { StatusBar } from 'expo-status-bar';
// import React, { useState, useCallback, useRef } from 'react';
// import { Button, Text, StyleSheet, View, TouchableOpacity, Alert, Animated, ScrollView, ScrollViewBase } from 'react-native';
// import { Audio } from 'expo-av';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import BottomSheet from './components/BottomSheet';


// // ==================================================================
 

// export default function App(){
//   const [gravacao, setGravacao] = React.useState();
//   const [gravacoes, setGravacoes] = React.useState([]);
//   const [mensagem, setMensagem] = React.useState("");

// //-----------------------------------------------
//     const ref = useRef(null);

//     const onPress = useCallback(() => {
//         const isActive = ref?.current?.isActive();
//         if (isActive) {
//           ref?.current?.scrollTo(0);
//         } else {
//           ref?.current?.scrollTo(-200);
//         }
//       }, []);
// //-----------------------------------------------

//   async function iniciarGravacao() {
//   try {
//   const permissao = await Audio.requestPermissionsAsync();
//   if (permissao.status === "granted") {
//   await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       playsInSilentModeIOS: true
//   });
  
//   const { recording } = await Audio.Recording.createAsync(
//       Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//   );

//   setGravacao(recording)
//   } else {
//   setMensagem("Por favor, conceda permissão para o aplicativo acessar o microfone");
//   }
//   } catch (err) {
//   console.error('Falha ao iniciar gravação', err);
//   }
//   }

//   async function pararGravacao() {
//   setGravacao(undefined);
//   await gravacao.stopAndUnloadAsync();
//   let gravacoesAtualizadas = [...gravacoes]; //faz uma copia do Array 'gravacoes'
//   const { sound, status } = await gravacao.createNewLoadedSoundAsync(); //'carregar' a gravação e obter um objeto 'sound'
//   gravacoesAtualizadas.push({
//   som: sound,
//   duracao: getDuracaoFormatada(status.durationMillis), //obter duração formatada
//   arquivo: gravacao.getURI() 
//   });
//   setGravacoes(gravacoesAtualizadas); //atualiza a lista de gravações usando o método 'setGravacoes'
//   }
    

//   function getDuracaoFormatada(millis) { //esse código realiza a formatação da duração
//   const minutos = millis / 1000 / 60;
//   const minutosDisplay = Math.floor(minutos);
//   const segundos = Math.round((minutos - minutosDisplay) * 60);
//   const segundosDisplay = segundos < 10 ? `0${segundos}` : segundos;
//   return `${minutosDisplay}:${segundosDisplay}`;
//   }

  
//     function getLinhasDeGravacao() {

//         const [reproduzindo, setReproduzindo] = useState(false);
//         return gravacoes.map((linhaDeGravacao, index) => {
//           return (
//             <View key={index} style={estilos.lista}>
//                 <Text style={estilos.preencher}>Gravação {index + 1} - {linhaDeGravacao.duracao}</Text>
//                 <TouchableOpacity onPress={() => {
//                     if (reproduzindo) {
//                         linhaDeGravacao.som.pauseAsync();
//                     } else{
//                         linhaDeGravacao.som.playAsync();
//                         linhaDeGravacao.som.setOnPlaybackStatusUpdate(async (status) => {
//                             if (status.didJustFinish) {
//                                 await linhaDeGravacao.som.setPositionAsync(0);
//                                 linhaDeGravacao.som.pauseAsync();
//                                 setReproduzindo(reproduzindo);
//                             }});
//                     }
//                     setReproduzindo(!reproduzindo);
//                     }}>
//                     <Icon name={reproduzindo ? 'pause' : 'play'} size={30} color="black"/>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => {
//                     const novasGravacoes = [...gravacoes];
//                     novasGravacoes.splice(index, 1);
//                     setGravacoes(novasGravacoes);
//                 }}>
//                     <Icon name="delete" size={30} color="black" marginHorizontal={30} />
//                 </TouchableOpacity>
//               </View> 
//     );
//   });
// }
      
//     const icone = gravacao ? 'microphone-off' : 'microphone'; //Seleciona a Imagem conforme a função
//     const texto = gravacao ? 'Toque no Microfone para parar!' : 'Toque no Microfone para gravar!'; //seleciona o texto conforme a função

// return (
//     <GestureHandlerRootView style={{ flex: 1 }}>


//     <View style={estilos.container}>

//     <Text>{mensagem}</Text>

//     <TouchableOpacity onPress={gravacao ? pararGravacao : iniciarGravacao}>
//           <Icon name={icone} size={100} style={estilos.botaoMic}/>
//         </TouchableOpacity>

//         <Text>{texto}</Text>

//         <StatusBar style="auto" />
//         <BottomSheet ref={ref}>

//           <View style={estilos.fundo}>
//             {getLinhasDeGravacao()}
//           </View>

//       </BottomSheet>



//     </View>


//   </GestureHandlerRootView>
// );
// }

import React from "react";
import { View, Text, _View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaCarregamento from './Telas/TelaCarregamento';
import Gravador from './Telas/Gravador';



const Stack = createStackNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        options={{headerTransparent: true, title: '',}}
        name="TelaCarregamento" component={TelaCarregamento}/>
        <Stack.Screen options={{headerShown: false, headerTransparent: true, title: '',}}name="Gravador" component={Gravador}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}