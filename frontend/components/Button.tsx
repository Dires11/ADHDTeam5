import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
  label: string;
  filled: boolean;
  theme?: string;
  onPress?: () => void;
};

export default function Button({ label, filled, theme, onPress }: Props) {
  return (
    <View>
      <Pressable
        style={{
          backgroundColor: "black",
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: "white",
            padding: "10px",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
