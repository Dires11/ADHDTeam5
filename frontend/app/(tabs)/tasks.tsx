import { StyleSheet, View, Pressable, Text } from "react-native";
import TaskCard from "@/components/TaskCard";
import { FlatList } from "react-native";

const tasks = [
  {
    id: "1",
    title: "Meeting with Client",
    description: "Discuss project details and finalize requirements.",
    dueDate: "2024-04-24T10:05:00Z",
  },
  {
    id: "2",
    title: "Design Cards",
    description: "Create and finalize business card designs for the event.",
    dueDate: "2024-04-24T11:20:00Z",
  },
  {
    id: "3",
    title: "Go for a Meeting",
    description: "Attend the weekly team meeting and discuss progress.",
    dueDate: "2024-04-24T12:30:00Z",
  },
  {
    id: "4",
    title: "Send Project to Client",
    description: "Finalize the design and send project files to the client.",
    dueDate: "2024-04-24T13:00:00Z",
  },
  {
    id: "5",
    title: "Scrum Meeting",
    description: "Daily standup to discuss tasks and blockers.",
    dueDate: "2024-04-24T14:30:00Z",
  },
  {
    id: "6",
    title: "Review PRs",
    description: "Check and approve pending pull requests on GitHub.",
    dueDate: "2024-04-25T09:00:00Z",
  },
  {
    id: "7",
    title: "Write Documentation",
    description: "Update API documentation for the latest features.",
    dueDate: "2024-04-25T11:30:00Z",
  },
  {
    id: "8",
    title: "Client Feedback Session",
    description: "Meet with the client to get feedback on the latest release.",
    dueDate: "2024-04-25T15:00:00Z",
  },
];

export default function Tasks() {
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <TaskCard
              key={item.id}
              title={item.title}
              desciption={item.description}
              dueDate={item.dueDate}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
  },

  task: {
    flexGrow: 1,
    margin: 10,
    flexDirection: "column",
  },
});
