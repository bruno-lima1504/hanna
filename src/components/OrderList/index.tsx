import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { useNavigation } from "@react-navigation/native";

export default function OrderList({ data }: any) {
  const navigation = useNavigation();
  function separeteOrders(order) {
    const status = {
      BQ: "Separar",
      RP: "Trocar",
      CF: "Conferir",
      RC: "ConferirCQ",
    };

    if (data.status_separacao !== "RCF") {
      const routeName: string = status[data.status_separacao];

      navigation.navigate(routeName, {
        pedido: order,
      });
    }
  }

  function formatarData(data) {
    const ano = data.substring(0, 4);
    const mes = data.substring(4, 6);
    const dia = data.substring(6, 8);
    return `${dia}/${mes}/${ano}`;
  }
  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        separeteOrders(data.id_pedidos);
      }}
    >
      <Text style={styles.orderNum}>Pedido: {data.num_pedido}</Text>
      <Text style={styles.bodyText}>
        Cliente: {data.cod_cliente} - Loja:{data.loja}
      </Text>
      <Text style={styles.bodyText}>
        Data Liberação: {formatarData(data.data_liberacao)}
      </Text>
      <Text style={styles.bodyText}>Quantidade: {data.quantidade_itens}</Text>
      {/* {
        (data.controle_qualidade === "1" && data.libera_cont_qual !== "0") && 
        (<Text style={styles.alertText}> 
          Existem Produtos aguardando liberação
        </Text> )} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    height: 150,
    width: 300,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginTop: 15,
    borderRadius: 4,
  },
  orderNum: {
    fontSize: 20,
    marginBottom: 5,
    padding: 5,
    fontWeight: "bold",
  },
  bodyText: {
    margin: 5,
  },
  alertText: {
    color: "red",
    fontWeight: "bold",
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
});
