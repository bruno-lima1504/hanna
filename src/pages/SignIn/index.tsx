import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { AuthContext } from "../../contexts/AuthContext";

export default function SignIn() {
  const { signIn, loadingAuth, credentialsMsg } = useContext(AuthContext);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (usuario === "" || password === "") {
      return;
    }
    await signIn({ usuario, password });
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/HannaLogoBlue-small.png")}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite seu usuário"
          placeholderTextColor="#101026"
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
        />
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#101026"
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>
        {credentialsMsg ? (
          <Text style={styles.credenditalMsg}>Usuário ou senha inválidos</Text>
        ) : (
          <Text />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    color: "#101026",
  },
  logo: {
    marginBottom: 18,
  },
  inputContainer: {
    width: "95%",
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 14,
  },
  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#FFF",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: "#101026",
  },
  button: {
    width: "95%",
    height: 40,
    backgroundColor: "#007bff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  credenditalMsg: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});
