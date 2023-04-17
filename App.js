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