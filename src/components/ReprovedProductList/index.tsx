import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ReprovedProductList({ data }) {
  console.log(data);
  if (!data) {
    return null;
  }

  const backgroundColor = data.troca === "1" ? "#00FF7F" : "#FF6347";
  const textColor = data.troca === "1" ? "#000" : "#FFF";

  return (
    <TouchableOpacity style={[styles.orderCard, { backgroundColor }]}>
      <Text style={[styles.orderNum, { color: textColor }]}>
        Cod. Produto: {data.cod_prod}
      </Text>
      <Text style={[styles.orderDescProd, { color: textColor }]}>
        Desc. Produto: {data.prod_desc}
      </Text>
      <Text style={[styles.bodyText, { color: textColor }]}>
        Localização: {data.localizacao}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderCard: {
    height: 150,
    width: 300,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 4,
  },
  orderNum: {
    fontSize: 22,
    marginBottom: 5,
    padding: 5,
    fontWeight: "bold",
  },
  orderDescProd: {
    fontSize: 13,
    marginBottom: 5,
    padding: 5,
  },
  bodyText: {
    fontSize: 15,
    margin: 5,
  },
});
