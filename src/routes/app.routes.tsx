import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Dashboard from "../pages/Dashboard";
import RecebeCF from "../pages/ReceberCF";
import SeparacaoRoutes from "./separacao.routes";
import ConferenciaRoute from "./conferencia.routes";
import ControleQualidadeRoute from "./controle.routes";
import ReprovadosRoute from "./reprovados.routes";

import CustomDrawerContent from "../components/DrawerContent";
import { Feather } from "@expo/vector-icons";

export type DrawerParamsList = {
  Dashboard: undefined;
  Separação: undefined;
  Conferência: undefined;
  Troca: undefined;
  "Entrada Qualidade": undefined;
  Qualidade: undefined;
  Reprovados: undefined;
  "Entrada Conferência": {
    toastType?: string | undefined;
    toastText1?: string | undefined;
    toastText2?: string | undefined;
  };
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
          drawerIcon: ({ color, size }) => (
            <Feather name="home" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Separação"
        component={SeparacaoRoutes}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="clipboard" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Entrada Qualidade"
        component={ControleQualidadeRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="arrow-right-circle" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Reprovados"
        component={ReprovadosRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="x-octagon" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Entrada Conferência"
        component={RecebeCF}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="arrow-right-circle" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Conferência"
        component={ConferenciaRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="check-circle" color={"#000"} size={25} />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppRoutes;
