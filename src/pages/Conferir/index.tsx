import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { AuthContext } from "../../contexts/AuthContext";

import ProductList from "../../components/ProductList";
import { ModalCheckout } from "../../components/ModalCheckout";
import { RootParamConfList } from "../../routes/conferencia.routes";

import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { colors } from "../../../constants/colors";

type ConferirScreenRouteProp = RouteProp<RootParamConfList, "Conferir">;

type ConferirScreeStackProp = NativeStackNavigationProp<
  RootParamConfList,
  "Conferir"
>;

export default function Conferir() {
  const [cardInfo, setCardInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [awaitItems, setAwaitItems] = useState(false);
  const [showLocationButton, setShowLocationButton] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [numPedido, setNumPedido] = useState(false);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [modalLocationVisible, setModalLocationVisible] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<ConferirScreenRouteProp>();
  const inputRef = useRef(null);
  const { getProductsToCheckOut, saveCheckOutProducts } =
    useContext(AuthContext);

  const navigation = useNavigation<ConferirScreeStackProp>();

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
        const responseOrders = await getProductsToCheckOut(route.params.pedido);

        if (responseOrders) {
          setCardInfo(responseOrders.itens_card || []);
          setProducts(responseOrders.itens_pedido || []);
          setAwaitItems(responseOrders.awaitItems || false);
          setIsProductLoaded(true);
        }
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
      const completScan = products.find((product) => !product.conferido);
      if (!completScan) {
        console.log("Todos os produtos escaneados.");
        showContainerButton(true);
      }
    }
  }, [products, isProductLoaded]);

  function showContainerButton(data) {
    setShowLocationButton(data);
  }

  function finishSeparete() {
    setShowFinishButton(true);
  }

  async function handleFinishSeparate() {
    setIsLoading(true); // Iniciar carregamento
    try {
      const status = await saveCheckOutProducts(products, location);
      setIsLoading(false);
      if (status !== 201) {
        throw new Error("Falha ao gravar conferência");
      }
      navigation.navigate("Conferencia", {
        toastType: "success",
        toastText1: "Pedido conferido!",
        toastText2: "Conferencia finalizada, emitindo NF!",
      });
    } catch (error) {
      setIsLoading(false);
      navigation.navigate("Conferencia", {
        toastType: "error",
        toastText1: "Erro",
        toastText2: "Ocorreu um erro ao finalizar a conferência",
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
      (product) =>
        product.cod_prod === leitura[0] &&
        (product.num_serie === leitura[1] || product.lote === leitura[1])
    );

    if (verifiyCode) {
      item = products.find(
        (product) =>
          product.cod_prod === leitura[0] &&
          (product.num_serie === leitura[1] || product.lote === leitura[1]) &&
          !product.conferido
      );
    } else {
      showToast("error", "Leitura Invalida", "Item não pertence ao pedido!");
      return;
    }
    if (item) {
      item.conferido = "1";
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
  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  function handleLocation() {
    setModalLocationVisible(true);
  }

  const handleSaveLocation = (location) => {
    setLocation(location);
    showContainerButton(false);
    finishSeparete();
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
        data={cardInfo}
        renderItem={({ item }) => <ProductList data={item} />}
        keyExtractor={(item) => item.cod_prod}
      />

      {showLocationButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLocation}
            style={[styles.greenButton, styles.marginSpacing]}
          >
            <Text style={styles.textButton}>Localização</Text>
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
        visible={modalLocationVisible}
        animationType="fade"
      >
        <ModalCheckout
          handleCloseModal={() => {
            setModalLocationVisible(false);
          }}
          onSaveLocation={handleSaveLocation} // Passa a função de callback para o modal
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
  buttonContainer: {
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "red", // Cor do botão
    borderRadius: 5,
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
  hiddenInput: {
    position: "absolute",
    top: -1000, // Mantém o input fora da tela
    height: 0, // Sem altura visível
    width: 0, // Sem largura visível
    opacity: 0, // Totalmente transparente
  },
  input: {
    height: 10,
    opacity: 0,
  },
  awaitItemsText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 15,
  },
});
