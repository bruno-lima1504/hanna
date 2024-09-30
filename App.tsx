import { registerRootComponent } from "expo";
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Adicione essa linha
import Routes from "./src/routes";

import { AuthProvider } from "./src/contexts/AuthContext";

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

registerRootComponent(App);
