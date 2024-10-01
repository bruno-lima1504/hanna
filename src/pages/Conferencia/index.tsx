import React, { useContext, useEffect, useState, useRef } from "react";
import { FlatList, SafeAreaView, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { colors } from "../../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";
import OrderList from "../../components/OrderList";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootParamConfList } from "../../routes/conferencia.routes";

type ConferenciaScreenRouteProp = RouteProp<RootParamConfList, "Conferencia">;

type ConferenciaScreenStackProp = NativeStackNavigationProp<
  RootParamConfList,
  "Conferencia"
>;

export default function Conferencia() {
  const [orders, setOrders] = useState([]);
  const { getOrdersToCheckOut, cleanRespOrder } = useContext(AuthContext);
  const inputRef = useRef(null);
  const navigation = useNavigation<ConferenciaScreenStackProp>();
  const route = useRoute<ConferenciaScreenRouteProp>();

  const showToast = (type: string, txt1: string, txt2: string) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  useEffect(() => {
    async function getOrdersList() {
      await cleanRespOrder();
      let responseOrders = await getOrdersToCheckOut();
      setOrders(responseOrders || []);
    }
    getOrdersList();
  }, []);

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
          Não existem pedidos para separar.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id_pedidos)}
          renderItem={({ item }) => <OrderList data={item} />}
        />
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
    backgroundColor: "#D3D3D3", // Cor de fundo equivalente a "bg-slate-200"
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
});
