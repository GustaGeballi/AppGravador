import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useRef } from 'react';
import { ImageBackground, Button, Text, StyleSheet, View, TouchableOpacity, Alert, Animated, ScrollView, ScrollViewBase } from 'react-native';
import { Audio } from 'expo-av';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BorderlessButton, GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';


// ==================================================================
 

export default function Gravador(){
  const [gravacao, setGravacao] = React.useState();
  const [gravacoes, setGravacoes] = React.useState([]);
  const [mensagem, setMensagem] = React.useState("");

//-----------------------------------------------
    const ref = useRef(null);

    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
          ref?.current?.scrollTo(0);
        } else {
          ref?.current?.scrollTo(-200);
        }
      }, []);
//-----------------------------------------------

  async function iniciarGravacao() {
  try {
  const permissao = await Audio.requestPermissionsAsync();
  if (permissao.status === "granted") {
  await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true
  });
  
  const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  );

  setGravacao(recording)
  } else {
  setMensagem("Por favor, conceda permissão para o aplicativo acessar o microfone");
  }
  } catch (err) {
  console.error('Falha ao iniciar gravação', err);
  }
  }

  async function pararGravacao() {
  setGravacao(undefined);
  await gravacao.stopAndUnloadAsync();
  let gravacoesAtualizadas = [...gravacoes]; //faz uma copia do Array 'gravacoes'
  const { sound, status } = await gravacao.createNewLoadedSoundAsync(); //'carregar' a gravação e obter um objeto 'sound'
  gravacoesAtualizadas.push({
  som: sound,
  duracao: getDuracaoFormatada(status.durationMillis), //obter duração formatada
  arquivo: gravacao.getURI() 
  });
  setGravacoes(gravacoesAtualizadas); //atualiza a lista de gravações usando o método 'setGravacoes'
  }
    

  function getDuracaoFormatada(millis) { //esse código realiza a formatação da duração
  const minutos = millis / 1000 / 60;
  const minutosDisplay = Math.floor(minutos);
  const segundos = Math.round((minutos - minutosDisplay) * 60);
  const segundosDisplay = segundos < 10 ? `0${segundos}` : segundos;
  return `${minutosDisplay}:${segundosDisplay}`;
  }

  
    function getLinhasDeGravacao() {

        const [reproduzindo, setReproduzindo] = useState(false);
        return gravacoes.map((linhaDeGravacao, index) => {
          return (
            <View key={index} style={estilos.lista}>
                <Text style={estilos.preencher}>Gravação {index + 1} - {linhaDeGravacao.duracao}</Text>
                <TouchableOpacity onPress={() => {
                    if (reproduzindo) {
                        linhaDeGravacao.som.pauseAsync();
                    } else{
                        linhaDeGravacao.som.playAsync();
                        linhaDeGravacao.som.setOnPlaybackStatusUpdate(async (status) => {
                            if (status.didJustFinish) {
                                await linhaDeGravacao.som.setPositionAsync(0);
                                linhaDeGravacao.som.pauseAsync();
                                setReproduzindo(reproduzindo);
                            }});
                    }
                    setReproduzindo(!reproduzindo);
                    }}>
                    <Icon name={reproduzindo ? 'pause' : 'play'} size={30} color="#5907d6"/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => {
                    const novasGravacoes = [...gravacoes];
                    novasGravacoes.splice(index, 1);
                    setGravacoes(novasGravacoes);
                }}>
                    <Icon name="delete" size={30} color="#cc0707" marginHorizontal={30} />
                </TouchableOpacity>
              </View> 
    );
  });
}
      
    const icone = gravacao ? 'microphone-off' : 'microphone'; //Seleciona a Imagem conforme a função
    const texto = gravacao ? 'Toque no Microfone para parar de Gravar!' : 'Toque no Microfone para gravar!'; //seleciona o texto conforme a função

return (
    <GestureHandlerRootView style={{ flex: 1 }}>


    <View style={estilos.container}>

    <Text>{mensagem}</Text>

    <TouchableOpacity onPress={gravacao ? pararGravacao : iniciarGravacao}>
          <Icon name={icone} size={100} style={estilos.botaoMic}/>
        </TouchableOpacity>

        <Text style={estilos.texto}>{texto}</Text>
        
        <StatusBar style="auto" />
        <BottomSheet ref={ref}>
          <View style={estilos.fundo}>
            {getLinhasDeGravacao()}
          </View>
          
        </BottomSheet>



    </View>

  </GestureHandlerRootView>
  
);
}

const estilos = StyleSheet.create({
    fundo:{
      flex: 1,
      backgroundColor: "#ffffff",
      
    },
    container:{
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems:"center",
    },
    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lista: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginVertical: 5,
        backgroundColor: '#5307c621',
        borderRadius: 20,
    },
    preencher: {
        flex: 1,
        margin: 16,
        fontWeight: '900',
        fontSize: 15,
    },
    botaoMic: {
        color: "#5907d6",
    },
    texto: {
      color: "#363636",
      fontWeight: '300',
      fontSize: 15,
  },
    button: {
        height: 50,
        borderRadius: 25,
        aspectRatio: 1,
        backgroundColor: '#d6d6d6',
        opacity: 0.6,
      },
})