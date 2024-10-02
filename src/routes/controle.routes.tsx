import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RecebeCQ from "../pages/RecebeCQ";
import ConferirCQ from "../pages/ConferirCQ";

export type RootStackControleParamList = {
  "Entrada CQ": {
    toastType?: string | undefined;
    toastText1?: string | undefined;
    toastText2?: string | undefined;
  };
  ConferirCQ: {
    pedido: string;
  };
};

const Stack = createNativeStackNavigator<RootStackControleParamList>();

export default function ControleQualidadeRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Entrada CQ"
        component={RecebeCQ}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConferirCQ"
        component={ConferirCQ}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
