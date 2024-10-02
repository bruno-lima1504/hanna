import React, { useContext, useEffect, useState, useCallback } from "react";
import { FlatList, SafeAreaView, Text, StyleSheet } from "react-native";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootReprovadosStackParamList } from "../../routes/reprovados.routes";
import { AuthContext } from "../../contexts/AuthContext";

import OrderList from "../../components/OrderList";

import Toast from "react-native-toast-message";
import { colors } from "../../../constants/colors";

type ReprovadosScreenRouteProp = RouteProp<
  RootReprovadosStackParamList,
  "ReprovadosStack"
>;
type ReprovadosScreenStackProp = NativeStackNavigationProp<
  RootReprovadosStackParamList,
  "ReprovadosStack"
>;

export default function Reprovados() {
  const [orders, setOrders] = useState([]);
  const { getOrdersForExchange } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ReprovadosScreenStackProp>();
  const route = useRoute<ReprovadosScreenRouteProp>();

  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getOrdersList() {
        if (isActive) {
          setLoading(true);
          try {
            let responseOrders = await getOrdersForExchange();
            setOrders(responseOrders || []);
          } catch (error) {
            console.error("Error fetching orders:", error);
          } finally {
            if (isActive) {
              setLoading(false);
            }
          }
        }
      }
      getOrdersList();
      return () => {
        isActive = false; // Cleanup function to prevent state updates if component is unmounted
      };
    }, [])
  );

  useEffect(() => {
    if (route.params?.toastType) {
      showToast(
        route.params.toastType,
        route.params.toastText1,
        route.params.toastText2
      );

      // Limpar os parâmetros após exibir o toast
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
          Não existem pedidos para trocar.
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
    backgroundColor: colors.light.backgroudEmptyMsg,
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
