import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../contexts/AuthContext";
import OrderList from "../../components/OrderList";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { colors } from "../../../constants/colors";
import { RootStackControleParamList } from "../../routes/controle.routes";

type RecebeCQScreenRouteProp = RouteProp<
  RootStackControleParamList,
  "Entrada CQ"
>;

type RecebeCQScreenStackProp = NativeStackNavigationProp<
  RootStackControleParamList,
  "Entrada CQ"
>;

export default function RecebeCQ() {
  const [orders, setOrders] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { receiveOrdersQualityControle } = useContext(AuthContext);
  const inputRef = useRef(null);
  const navigation = useNavigation<RecebeCQScreenStackProp>();
  const route = useRoute<RecebeCQScreenRouteProp>();

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      if (inputRef.current && inputRef.current.isFocused() === false) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (type: string, txt1: string, txt2: string) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  useEffect(() => {
    if (route.params?.toastType) {
      showToast(
        route.params.toastType,
        route.params.toastText1,
        route.params.toastText2
      );

      // Clear the parameters after showing the toast
      navigation.setParams({
        toastType: undefined,
        toastText1: undefined,
        toastText2: undefined,
      });
    }

    async function getOrdersList() {
      let responseOrders = await receiveOrdersQualityControle();
      setOrders(responseOrders || []);
    }
    getOrdersList();
  }, [route.params]);

  const handleInputChange = (text) => {
    let qrValue = text.split(/[;�:]/);
    setInputValue("");
    setLeitura(qrValue);
  };

  useEffect(() => {
    if (leitura.length > 0) {
      verifyItem();
    }
  }, [leitura]);

  const verifyItem = () => {
    let nPedido = leitura[0];
    navigation.navigate("ConferirCQ", {
      pedido: nPedido,
    });
  };

  useEffect(() => {
    if (route.params?.toastType) {
      showToast(
        route.params.toastType,
        route.params.toastText1,
        route.params.toastText2
      );

      // Clear the parameters after showing the toast
      navigation.setParams({
        toastType: undefined,
        toastText1: undefined,
        toastText2: undefined,
      });
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>
          Não existem pedidos para receber.
        </Text>
      ) : (
        <>
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
            data={orders}
            keyExtractor={(item) => String(item.id_pedidos)}
            renderItem={({ item }) => <OrderList data={item} />}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },
  noOrdersText: {
    fontSize: 18,
    backgroundColor: "#FFF", // Cor de fundo equivalente a "bg-slate-200"
    borderRadius: 50,
    padding: 10,
    textAlign: "center",
    width: 300,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 5,
    backgroundColor: "blue",
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
});
