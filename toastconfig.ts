import React from "react";
import { View, Text } from "react-native";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";

const toastConfig: ToastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  // tomatoToast: ({ text1, props }: ToastConfigParams<{ uuid: string }>) => (
  //   <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
  //     <Text>{text1}</Text>
  //     <Text>{props.uuid}</Text>
  //   </View>
  // ),
};

export default toastConfig;
