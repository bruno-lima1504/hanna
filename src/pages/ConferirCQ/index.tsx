import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../contexts/AuthContext";

import ProductList from "../../components/ProductList";

import { colors } from "../../../constants/colors";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackControleParamList } from "../../routes/controle.routes";

type RecebeCQScreenRouteProp = RouteProp<
  RootStackControleParamList,
  "ConferirCQ"
>;

type RecebeCQScreenStackProp = NativeStackNavigationProp<
  RootStackControleParamList,
  "ConferirCQ"
>;

export default function ConferirCQ() {
  const [cardInfo, setCardInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [numPedido, setNumPedido] = useState(false);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<RecebeCQScreenRouteProp>();
  const inputRef = useRef(null);
  const { receiveProdutcsToCheckoutQualityControl, saveStatusReceivedCQ } =
    useContext(AuthContext);

  const navigation = useNavigation<RecebeCQScreenStackProp>();

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
        let responseOrders = await receiveProdutcsToCheckoutQualityControl(
          route.params.pedido
        );
        const updatedProducts = responseOrders.itens_pedido.map((product) => {
          return {
            ...product,
            recebido: false,
          };
        });

        setCardInfo(responseOrders.itens_card || []);
        setProducts(updatedProducts || []);
        setIsProductLoaded(true);        
      } catch (error) {
        console.error("Error fetching product order:", error);
      }
    }
    getOrderProducts();
  }, [route.params.pedido]);

  useEffect(() => {
    if (products.length > 0) {
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
      const completScan = products.find((product) => !product.recebido);      
      if (!completScan) {
        console.log("Todos os produtos escaneados.");
        finishSeparete(true);
      }
    }
  }, [products, isProductLoaded]);

  function finishSeparete(data: boolean) {
    setShowFinishButton(data);
  }

  async function handleFinishSeparate(): Promise<void> {
    setIsLoading(true); // Iniciar carregamento
    try {
      const status = await saveStatusReceivedCQ(products);
      setIsLoading(false);
      if (status !== 201) {
        throw new Error("Falha ao gravar conferência");
      }
      navigation.navigate("Entrada CQ", {
        toastType: "success",
        toastText1: "Pedido recebido!",
        toastText2: "Produtos recebidos no controle de qualidade!",
      });
    } catch (error) {
      setIsLoading(false);
      navigation.navigate("Entrada CQ", {
        toastType: "error",
        toastText1: "Erro",
        toastText2: "Ocorreu um erro ao receber o pedido",
      });
    }
  }

  const handleInputChange = (text) => {
    let qrValue = text.split(/[;�:]/);
    setInputValue("");
    setLeitura(qrValue);
  };

  function verifyItem() {
    let item: any;
    const verifiyCode = products.find(
      (product) =>
        product.cod_prod === leitura[0] &&
        (product.num_serie === leitura[1] || product.lote === leitura[1])
    );

    if (verifiyCode) {
      item = products.find(
        (product) =>
          product.cod_prod === leitura[0] &&
          (product.num_serie === leitura[1] || product.lote === leitura[1]) &&
          product.recebido === false
      );
    } else {
      showToast("error", "Leitura Invalida", "Item não pertence ao pedido!");
      return;
    }
    if (item) {      
      item.recebido = "1";
      setProducts([...products]);
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
      showToast("error", "Leitura Invalida", "Esse item ja foi conferido!");
      return;
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
      />
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
});
