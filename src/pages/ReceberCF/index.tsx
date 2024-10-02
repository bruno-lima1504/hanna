import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { DrawerParamsList } from "../../routes/app.routes";
import { AuthContext } from "../../contexts/AuthContext";

import OrderList from "../../components/OrderList";
import { ModalReceive } from "../../components/ModalReceiveCheckout";

import Toast from "react-native-toast-message";
import { colors } from "../../../constants/colors";

type RecebeCFScreenRouteProp = RouteProp<
  DrawerParamsList,
  "Entrada Conferência"
>;
type RecebeCFScreenStackProp = NativeStackNavigationProp<
  DrawerParamsList,
  "Entrada Conferência"
>;

export default function RecebeCF() {
  const [orders, setOrders] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { receiveOrdersToCheckout } = useContext(AuthContext);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigation<RecebeCFScreenStackProp>();
  const route = useRoute<RecebeCFScreenRouteProp>();

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      if (inputRef.current && inputRef.current.isFocused() === false) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (type, txt1, txt2) => {
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
      let responseOrders = await receiveOrdersToCheckout();
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
    setReceiveModalVisible(true);
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
            showSoftInputOnFocus={Platform.OS === "android" ? false : undefined} // Desabilitar o teclado no Android
          />
          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id_pedidos)}
            renderItem={({ item }) => <OrderList data={item} />}
          />
        </>
      )}
      <Modal
        transparent={true}
        visible={receiveModalVisible}
        animationType="fade"
      >
        <ModalReceive
          handleCloseModal={() => {
            setReceiveModalVisible(false);
          }}
          idPedido={leitura[0]}
          numPedido={leitura[1]}
        />
      </Modal>
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
    backgroundColor: colors.light.backgroudEmptyMsg,
    borderRadius: 50,
    padding: 10,
    textAlign: "center",
    width: 300,
    marginTop: 20,
  },
  input: {
    height: 10,
    opacity: 0,
  },
});
