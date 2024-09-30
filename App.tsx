import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/contexts/AuthContext";
import toastConfig from "./src/toastconfig";

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <Toast config={toastConfig} />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

registerRootComponent(App);
