import React, { useContext, useEffect, useState, useCallback } from "react";
import { FlatList, SafeAreaView, Text, StyleSheet, View } from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { AuthContext, OrderProps } from "../../contexts/AuthContext";
import OrderList from "../../components/OrderList";
import { colors } from "../../../constants/colors";

import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../../routes/separacao.routes";

type SeparacaoScreenRouteProp = RouteProp<RootStackParamList, "Separacao">;

type SeparacaScreenStackProp = NativeStackNavigationProp<
  RootStackParamList,
  "Separacao"
>;

export default function Separacao() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { getOrders, cleanRespOrder } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<SeparacaScreenStackProp>();
  const route = useRoute<SeparacaoScreenRouteProp>();

  // Função para exibir os toasts
  const showToast = (type: string, text1: string, text2: string) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getOrdersList() {
        if (isActive) {
          setLoading(true);
          try {
            await cleanRespOrder(); // Limpar os pedidos anteriores
            const responseOrders = await getOrders();
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
        isActive = false; // Limpar o efeito quando o componente for desmontado
      };
    }, [cleanRespOrder, getOrders])
  );

  // Exibir o toast ao receber parâmetros da rota
  // Exibir o toast ao receber parâmetros da rota
  useEffect(() => {
    if (route.params?.toastType) {
      showToast(
        route.params.toastType,
        route.params.toastText1 || "",
        route.params.toastText2 || ""
      );
      navigation.setParams({
        toastType: undefined,
        toastText1: undefined,
        toastText2: undefined,
      });
    }
  }, [route.params, navigation]);

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
