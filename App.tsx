import { registerRootComponent } from "expo";
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Adicione essa linha
import Routes from "./src/routes";

function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

export default App;

registerRootComponent(App);
