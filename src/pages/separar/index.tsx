import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  Platform,
} from "react-native";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../../routes/separacao.routes";
import { AuthContext } from "../../contexts/AuthContext";

import { ModalPrinter } from "../../components/ModalPrinter";
import ProductList from "../../components/ProductList";

import { colors } from "../../../constants/colors";
import Toast from "react-native-toast-message";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

type SepararScreenRouteProp = RouteProp<RootStackParamList, "Separar">;

type SeparararScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Separar"
>;

export default function Separar() {
  const [cardInfo, setCardInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [idPedido, setIdPedido] = useState("");
  const [numPedido, setNumPedido] = useState("");
  const [modalPrintVisible, setModalPrintVisible] = useState(false);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null); // Ref tipado corretamente
  const { getProductOrder, saveSeparateProducts } = useContext(AuthContext);

  const navigation = useNavigation<SeparararScreenProp>();
  const route = useRoute<SepararScreenRouteProp>();

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      if (inputRef.current && inputRef.current.isFocused() === false) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getOrderProducts() {
      try {
        let responseOrders = await getProductOrder(route.params.pedido);
        setCardInfo(responseOrders.itens_card || []);
        setProducts(responseOrders.itens_pedido || []);
        setIsProductLoaded(true);
      } catch (error) {
        console.error("Error fetching product order:", error);
      }
    }
    getOrderProducts();
  }, [route.params.pedido]);

  useEffect(() => {
    if (products.length > 0) {
      setIdPedido(products[0].id_pedidos);
      setNumPedido(products[0].num_pedido);
    }
  }, [products]);

  useEffect(() => {
    if (leitura.length > 0) {
      verifyItem();
    }
  }, [leitura]);

  useEffect(() => {
    if (isProductLoaded) {
      const completScan = products.find(
        (product) => !product.num_serie && !product.lote
      );
      if (!completScan) {
        console.log("Todos os produtos escaneados.");
        showPrintCotainer(true);
      }
    }
  }, [products, isProductLoaded]);

  function showPrintCotainer(data: boolean) {
    setShowPrintButton(data);
  }

  function handleSaveSeparete() {
    showPrintCotainer(false);
    setShowFinishButton(true);
  }

  async function handleFinishSeparate(): Promise<void> {
    setIsLoading(true); // Iniciar carregamento
    try {
      const status = await saveSeparateProducts(products);
      typeof status;
      setIsLoading(false);
      if (status !== 201) {
        throw new Error("Erro ao separar pedido!");
      }
      // Navegar de volta para a tela 'Separacao' com parâmetros de toast
      navigation.navigate("Separacao", {
        toastType: "success",
        toastText1: "Pedido separado!",
        toastText2: "Separação finalizada com sucesso",
      });
    } catch (error) {
      // Se houve erro, exibir o toast de erro
      navigation.navigate("Separacao", {
        toastType: "error",
        toastText1: "Erro",
        toastText2: "Ocorreu um erro ao finalizar a separação",
      });
    }
  }

  const handleInputChange = (text: string) => {
    if (text) {
      const qrValue = text.split(/[;�:]/);
      setLeitura(qrValue);
      setInputValue(""); // Limpa o input após a leitura
    }
  };

  function verifyItem() {
    let item;
    const verifiyCode = products.find(
      (product) =>
        product.cod_prod === leitura[0] && product.num_serie === leitura[1]
    );
    if (!verifiyCode) {
      item = products.find(
        (product) =>
          product.cod_prod === leitura[0] && !product.num_serie && !product.lote
      );
    } else {
      showToast("error", "Leitura Invalida", "Leitura já realizada!");
      return;
    }

    if (item) {
      let infosQrcode = item.seqcb.split(";");
      let campoMap = {
        C: "cod_prod",
        L: "lote",
        S: "num_serie",
        O: "origem",
        V: "validade",
        D: "prod_desc",
      };

      // Atualizando os campos do objeto item com base na leitura e no infosQrcode
      for (let i = 0; i < infosQrcode.length; i++) {
        let letra = infosQrcode[i];
        if (campoMap[letra]) {
          item[campoMap[letra]] = leitura[i];
        }
      }

      setProducts([...products]); // Forçar re-renderização

      setCardInfo((prevCardInfo) =>
        prevCardInfo.map((card) =>
          card.cod_prod === item.cod_prod
            ? {
                ...card,
                qtd_leituras: (parseInt(card.qtd_leituras) + 1).toString(),
              }
            : card
        )
      );
    } else {
      showToast(
        "error",
        "Leitura Invalida",
        "Item não pertence a esse pedido!"
      );
      return;
    }
  }

  function handlePrinter() {
    setModalPrintVisible(true);
  }

  const showToast = (type: string, text1: string, text2: string) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        ref={inputRef}
        value={inputValue}
        style={styles.input}
        onChangeText={(text) => {
          setInputValue(text);
          handleInputChange(text);
        }}
        autoFocus={true}
        keyboardType="default"
        showSoftInputOnFocus={Platform.OS === "android" ? false : undefined}
      />
      <FlatList
        data={cardInfo}
        renderItem={({ item }) => <ProductList data={item} />}
        keyExtractor={(item) => item.cod_prod}
        style={styles.flatList}
      />
      {showPrintButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePrinter}
            style={[styles.greenButton, styles.marginSpacing]}
          >
            <Text style={styles.textButton}>Imprimir Etiqueta</Text>
          </TouchableOpacity>
        </View>
      )}
      {showFinishButton && (
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity
              onPress={handleFinishSeparate}
              style={[styles.greenButton, styles.marginSpacing]}
            >
              <Text style={styles.textButton}>Finalizar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalPrintVisible}
        animationType="fade"
      >
        <ModalPrinter
          handleCloseModal={() => setModalPrintVisible(false)}
          onPrint={handleSaveSeparete}
          numPed={numPedido}
          idPedido={idPedido}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },
  input: {
    height: 10,
    opacity: 0,
  },
  greenButton: {
    backgroundColor: "green",
    borderRadius: 24,
    width: 200,
    height: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  marginSpacing: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  flatList: {
    marginBottom: 12,
  },
});
