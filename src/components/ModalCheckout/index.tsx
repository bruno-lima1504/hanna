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

//pega o tamanho da tela do usuário
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export function ModalCheckout({ handleCloseModal, onSaveLocation }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  //   function onPressItem(item) {
  //     // selectedItem(item);
  //     handleCloseModal();
  //   }

  function handleSaveLocation() {
    onSaveLocation(inputValue);
    handleCloseModal();
    showToast("success", "Localização Salva!", "Finalizar conferencia!");
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
        <Text style={styles.item}>Digite o Local de armazenamento</Text>
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.input}
          keyboardType="default"
        />
        <TouchableOpacity
          style={styles.printButton}
          onPress={handleSaveLocation}
        >
          <Text style={styles.printButtonText}>Gravar Local</Text>
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
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    margin: 18,
    fontSize: 18,
    fontWeight: "bold",
    color: "#101026",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    // BorderColor: "#000",
    width: 250,
    height: 50,
    marginBottom: 10,
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
