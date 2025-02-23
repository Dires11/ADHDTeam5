import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  title: string;
  desciption?: string;
  dueDate: string;
};

export default function TaskCard({ title, desciption, dueDate }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>
        {desciption ? desciption : "No description"}
      </Text>
      <Text style={styles.due}>{dueDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    maxWidth: 500,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "red",
  },

  titleContainer: {
    borderWidth: 5,
    borderColor: "black",
    padding: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
  },

  description: {
    padding: 10,
  },

  due: {
    fontSize: 15,
    padding: 10,
    borderTopWidth: 4,
  },
});
