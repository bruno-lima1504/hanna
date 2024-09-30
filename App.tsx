import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import { AuthProvider } from "./src/contexts/AuthContext";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { StatusBar } from "react-native";

const toastConfig: ToastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar
          backgroundColor="#39BDF8"
          barStyle="light-content"
          translucent={false}
        />
        <Routes />
        <Toast config={toastConfig} />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

registerRootComponent(App);
