import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Conferencia from "../pages/Conferencia";
import Conferir from "../pages/Conferir";

export type RootParamConfList = {
  Conferencia: {
    toastType?: string | undefined;
    toastText1?: string | undefined;
    toastText2?: string | undefined;
  };
  Conferir: {
    pedido: string;
  };
};

const Stack = createNativeStackNavigator<RootParamConfList>();

export default function ConferenciaRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conferencia"
        component={Conferencia}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Conferir"
        component={Conferir}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
