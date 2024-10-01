import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../contexts/AuthContext";

// Pega o tamanho da tela do usuário
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export function ModalPrinter({ handleCloseModal, numPed, idPedido, onPrint }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const { printTag } = useContext(AuthContext);

  function handlePrintTag() {
    const printStatus = printTag(numPed, inputValue, idPedido);

    printStatus
      .then((response) => {
        handleCloseModal();
        handleSaveLocation();

        if (response && "success" in response && response.success) {
          showToast("success", "Etiqueta Impressa", "Finalizar conferência!");
        } else if (response && "message" in response) {
          showToast("error", "Erro", response.message);
        } else {
          showToast("error", "Erro", "Ocorreu um erro inesperado!");
        }
      })
      .catch((error) => {
        console.log("Erro ao imprimir etiqueta:", error);
        showToast("error", "Erro", "Ocorreu um erro ao imprimir etiqueta");
      });
  }

  function handleSaveLocation() {
    onPrint(true);
  }

  const showToast = (type: string, txt1: string, txt2: string) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
      <View style={styles.content}>
        <Text style={styles.item}>Quantidade de Etiquetas</Text>
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.input}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.printButton} onPress={handlePrintTag}>
          <Text style={styles.printButtonText}>Imprimir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: WIDTH - 20,
    height: HEIGHT / 3,
    backgroundColor: "#bfbaba",
    borderWidth: 1,
    borderColor: "#000", // Corrigido BorderColor para borderColor
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    margin: 18,
    fontSize: 20,
    fontWeight: "bold",
    color: "#101026",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000", // Corrigido BorderColor para borderColor
    width: 250,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10, // Adicionado padding para o texto não ficar colado nas bordas
  },
  printButton: {
    backgroundColor: "#2196F3", // Cor do botão
    padding: 10, // Espaçamento interno
    borderRadius: 5, // Bordas arredondadas
    marginTop: 10, // Espaçamento superior
    alignItems: "center", // Centralizar o texto dentro do botão
  },
  printButtonText: {
    color: "#FFF", // Cor do texto
    fontWeight: "bold", // Negrito no texto
  },
});
