import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

import DashboardCard from "../../components/DashboardCard";

import { colors } from "../../../constants/colors";

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
        icon="x-octagon"
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
  header: {
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: colors.light.background,
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  welcomeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
