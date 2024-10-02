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

//pega o tamanho da tela do usuário
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export function ModalReceive({ handleCloseModal, numPedido, idPedido }) {
  const { saveReceivedOrder } = useContext(AuthContext);

  function onPressItem() {
    handleCloseModal();
  }

  async function handlePrintTag() {
    const data = {
      idPedido: idPedido,
      numPedido: numPedido,
    };
    const received: number = await saveReceivedOrder(data);
    handleCloseModal();

    if (received === 201) {
      showToast(
        "success",
        "Pedido recebido com sucesso",
        "Finalizar conferência!"
      );
    } else {
      showToast("error", "Houve algum problema", "Pedido não foi recebido!");
    }
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
        <Text style={styles.item}>Receber Pedido {numPedido}?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.printButton} onPress={onPressItem}>
            <Text>Não</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printButton} onPress={handlePrintTag}>
            <Text>Sim</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 20,
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
  buttonContainer: {
    flexDirection: "row",
    width: 130,
    justifyContent: "space-between",
  },
  printButton: {
    marginRight: 12,
  },
});
