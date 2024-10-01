import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Separacao from "../pages/separacao";
import Separar from "../pages/separar";

import { NativeStackNavigatorProps } from "react-native-screens/lib/typescript/native-stack/types";

export type RootStackParamList = {
  Separacao: {
    toastType?: string | undefined;
    toastText1?: string | undefined;
    toastText2?: string | undefined;
  };
  Separar: {
    pedido: string;
  };
};

export type RootStackParamProducts = {
  Separar: { pedido: string };
  Trocar: { pedido: string };
  Conferir: { pedido: string };
  ConferirCQ: { pedido: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function SeparacaoRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Separacao"
        component={Separacao}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Separar"
        component={Separar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
