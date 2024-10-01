import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type FeatherIconName = keyof typeof Feather.glyphMap;

import { DrawerParamsList } from "../../routes/app.routes";

// Tipar a navegação corretamente
type NavigationProps = NavigationProp<DrawerParamsList>;

export default function DashboardCard({
  bgColor,
  title,
  textColor,
  iconColor,
  amount,
  icon,
}: {
  bgColor: string;
  title: keyof DrawerParamsList; // Assegura que o title seja uma rota válida
  textColor: string;
  iconColor: string;
  amount: number;
  icon: FeatherIconName;
}) {
  const navigation = useNavigation<NavigationProps>();

  function handleNavigation() {
    if (title === "Qualidade") {
      return;
    }
    navigation.navigate(title); // Aqui a rota será validada pelo tipo
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={handleNavigation}
    >
      <View>
        <Feather name={icon} size={30} color={iconColor} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.amount, { color: textColor }]}>
          Quantidade: {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: "85%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 5 },
    shadowRadius: 1,
    shadowOpacity: 0.95,
    elevation: 5,
    marginBottom: 15,
    flexDirection: "row",
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginLeft: 10,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "black",
  },
  amount: {
    fontSize: 16,
    marginLeft: 10,
  },
});
