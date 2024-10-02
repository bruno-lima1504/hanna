import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { colors } from "../../../constants/colors";

import DashboardCard from "../../components/DashboardCard";

export default function Dashboard() {
  const [separacao, setSeparacao] = useState(0);
  const [conferencia, setConferencia] = useState(0);
  const [controle, setControle] = useState(0);
  const [troca, setTroca] = useState(0);
  const { user, updateOrderList, cleanRespOrder, getDataDashBoard } =
    useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function uploadDashBoard() {
        if (isActive) {
          try {
            await cleanRespOrder();

            await updateOrderList();

            let data = await getDataDashBoard();
            if (data.separacao.length != 0) {
              setSeparacao(Number(data.separacao[0].qtd_pedidos));
            } else {
              setSeparacao(0);
            }
            if (data.conferencia.length != 0) {
              setConferencia(Number(data.conferencia[0].qtd_pedidos));
            } else {
              setConferencia(0);
            }
            if (data.controle.length != 0) {
              setControle(Number(data.controle[0].qtd_pedidos));
            } else {
              setControle(0);
            }
            if (data.troca.length != 0) {
              setTroca(Number(data.troca[0].qtd_pedidos));
            } else {
              setTroca(0);
            }
          } catch (error) {
            console.error("Error fetching clean", error);
          }
        }
      }
      uploadDashBoard();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem vindo, {user.name}!</Text>
      </View>
      <DashboardCard
        bgColor="#1E90FF"
        title="Separação"
        textColor="white"
        iconColor="white"
        amount={separacao}
        icon="clipboard"
      />
      <DashboardCard
        bgColor="#17C434"
        title="Conferência"
        textColor="white"
        iconColor="white"
        amount={conferencia}
        icon="check-circle"
      />
      <DashboardCard
        bgColor="#F3EF0E"
        title="Qualidade"
        textColor="black"
        iconColor="black"
        amount={controle}
        icon="search"
      />
      <DashboardCard
        bgColor="#E94834"
        title="Reprovados"
        textColor="white"
        iconColor="white"
        amount={troca}
        icon="refresh-cw"
      />
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
  header: {
    height: 48, // 12 in Tailwind would be 48px
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: colors.light.background, // Tailwind's bg-blue-500
    marginBottom: 12, // Tailwind's mb-3
    padding: 8, // Tailwind's p-2
    borderRadius: 8, // Tailwind's rounded-md
  },
  welcomeText: {
    color: "white", // Tailwind's text-white
    fontSize: 16, // Tailwind's text-base (16px)
    fontWeight: "bold", // Tailwind's font-bold
  },
});
