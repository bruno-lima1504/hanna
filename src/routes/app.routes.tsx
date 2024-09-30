import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Dashboard from "../pages/Dashboard";
import Separacao from "../pages/separacao";
import CustomDrawerContent from "../components/DrawerContent";

export type DrawerParamsList = {
  Dashboard: undefined;
  Separacao: undefined;
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
        name="Separacao"
        component={Separacao}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppRoutes;
