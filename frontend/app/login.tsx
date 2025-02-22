import { Alert, Text, View } from "react-native";
import Button from "@/components/Button";

export default function Index() {
  const LoginPress = () => {
    Alert.alert("Hello!", "This is an alert message.", [{ text: "OK" }]);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button label="Login" filled theme="black" onPress={LoginPress}></Button>
    </View>
  );
}
