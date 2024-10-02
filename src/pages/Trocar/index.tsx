import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../contexts/AuthContext";

import ReprovedProductList from "../../components/ReprovedProductList";

import { colors } from "../../../constants/colors";

import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootReprovadosStackParamList } from "../../routes/reprovados.routes";

type TrocarScreenRouteProp = RouteProp<RootReprovadosStackParamList, "Trocar">;

type TrocarScreenStackProp = NativeStackNavigationProp<
  RootReprovadosStackParamList,
  "Trocar"
>;

export default function Trocar() {
  const [products, setProducts] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [numPedido, setNumPedido] = useState(false);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<TrocarScreenRouteProp>();
  const inputRef = useRef(null);
  const { getProductsForExchange, saveExchangeProducts } =
    useContext(AuthContext);

  const navigation = useNavigation<TrocarScreenStackProp>();

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
        let responseOrders = await getProductsForExchange(route.params.pedido);

        const updatedProducts = responseOrders.itens_pedido.map((product) => {
          return {
            ...product,
            lote: "",
            num_serie: "",
            troca: product.status_produto_atual !== "RP" ? "1" : false,
          };
        });
        setProducts(updatedProducts);
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
      const completScan = products.find((product) => !product.troca);
      if (!completScan) {
        console.log("Todos os produtos escaneados.");
        finishSeparete();
      }
    }
  }, [products, isProductLoaded]);

  function finishSeparete() {
    setShowFinishButton(true);
  }

  async function handleFinishSeparate() {
    setIsLoading(true); // Iniciar carregamento
    try {
      const status = await saveExchangeProducts(products);
      setIsLoading(false);
      if (status !== 200) {
        throw new Error("Status diferente de 200");
      }
      navigation.navigate("ReprovadosStack", {
        toastType: "success",
        toastText1: "Troca realizada!",
        toastText2: "Controle de qualidade aguardando novo produto!",
      });
    } catch (error) {
      setIsLoading(false);
      navigation.navigate("ReprovadosStack", {
        toastType: "error",
        toastText1: "Erro",
        toastText2: "Ocorreu um erro durante a troca",
      });
    }
  }

  const handleInputChange = (text) => {
    let qrValue = text.split(/[;�:]/);
    setInputValue("");
    setLeitura(qrValue);
  };

  function verifyItem() {
    let item;
    const verifiyCode = products.find(
      (product) => product.cod_prod === leitura[0]
    );

    if (verifiyCode) {
      item = products.find(
        (product) => product.cod_prod === leitura[0] && !product.troca
      );
    } else {
      showToast("error", "Leitura Invalida", "Item não pertence ao pedido!");
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
      item.troca = "1";
      item.status_produto_atual = "CQ";

      setProducts([...products]);
      console.log(products);
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
        showSoftInputOnFocus={Platform.OS === "android" ? false : undefined} // Desabilitar o teclado no Android
      />
      <FlatList
        data={products}
        renderItem={({ item }) => {
          return <ReprovedProductList data={item} />;
        }}
        keyExtractor={(item) => item.id_produtos_pedido}
      />

      {showFinishButton && (
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity
              style={[styles.greenButton, styles.marginSpacing]}
              onPress={handleFinishSeparate}
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
  flatList: {
    marginBottom: 12,
  },
});
