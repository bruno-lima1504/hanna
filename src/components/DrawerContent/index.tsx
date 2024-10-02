import React, { useContext } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";

const { height } = Dimensions.get("window");

export default function CustomDrawerContent(props: any) {
  const { signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../../assets/images/HannaLogoBlue-small.png")}
        />
      </View>
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Feather name="log-out" color={"#FF0000"} size={size} />
          )}
          onPress={signOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  containerLogo: {
    height: height * 0.2,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  logoutContainer: {
    marginTop: 5,
  },
});
