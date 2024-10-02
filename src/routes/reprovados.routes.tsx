import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Reprovados from "../pages/Reprovados";
import Trocar from "../pages/Trocar";

export type RootReprovadosStackParamList = {
  ReprovadosStack: {
    toastType?: string | undefined;
    toastText1?: string | undefined;
    toastText2?: string | undefined;
  };
  Trocar: {
    pedido: string;
  };
};

const Stack = createNativeStackNavigator<RootReprovadosStackParamList>();

export default function ReprovadosRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReprovadosStack"
        component={Reprovados}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Trocar"
        component={Trocar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
