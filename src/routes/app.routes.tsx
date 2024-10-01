import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Dashboard from "../pages/Dashboard";
import CustomDrawerContent from "../components/DrawerContent";
import SeparacaoRoutes from "./separacao.routes";
import ConferenciaRoute from "./conferencia.routes";

export type DrawerParamsList = {
  Dashboard: undefined;
  Separação: undefined;
  Conferência: undefined;
  Troca: undefined;
  Qualidade: undefined;
  Reprovados: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamsList>();

function AppRoutes() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Separação"
        component={SeparacaoRoutes}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Conferência"
        component={ConferenciaRoute}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppRoutes;
