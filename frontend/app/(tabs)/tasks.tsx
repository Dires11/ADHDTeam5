import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Text,
  TextInput,
  Modal,
} from "react-native";
import TaskCard from "@/components/TaskCard";
import { Ionicons } from "@expo/vector-icons";

const initialTasks = [
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
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // ✅ Open modal
  const openModal = () => setModalVisible(true);

  // ✅ Close modal
  const closeModal = () => {
    setModalVisible(false);
    setNewTask({ title: "", description: "", dueDate: "" }); // Reset input
  };

  // ✅ Add a new task
  // const addTask = () => {
  //   if (!newTask.title.trim()) return; // Prevent empty tasks

  //   setTasks([
  //     ...tasks,
  //     {
  //       id: (tasks.length + 1).toString(),
  //       title: newTask.title,
  //       description: newTask.description || "No description",
  //       dueDate: newTask.dueDate || "No due date",
  //     },
  //   ]);

  //   closeModal();
  // };

  //updated task function that connects to database

  const addTask = async () => {
    if (!newTask.title.trim()) return; // Prevent empty tasks

    // Add the new task to the local state immediately
    const newTaskToAdd = {
        id: (tasks.length + 1).toString(),
        title: newTask.title,
        description: newTask.description || "No description",
        dueDate: newTask.dueDate || "No due date",
    };

    setTasks([...tasks, newTaskToAdd]);

    // Send the new task to the backend API
    try {
        const response = await fetch('http://localhost:5000/api/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: "USER_ID_HERE", // Replace with actual user ID
                taskName: newTask.title,
                priority: "Medium", // Default or dynamic if needed
                dueDate: newTask.dueDate || null,
                status: "Pending",
            }),
        });

        if (!response.ok) {
            console.error('Failed to add task to the database.');
            return;
        }

        console.log('Task added to the database successfully!');

    } catch (error) {
        console.error('Error adding task:', error);
    }

    closeModal();
};


  return (
    <View style={styles.container}>
      {/* ✅ Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <TaskCard
              key={item.id}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
            />
          </View>
        )}
      />

      {/* ✅ Floating Plus Button */}
      <Pressable style={styles.fab} onPress={openModal}>
        <Ionicons name="add" size={30} color="white" />
      </Pressable>

      {/* ✅ Task Creation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Task</Text>

            {/* ✅ Task Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />

            {/* ✅ Task Description Input */}
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTask.description}
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
            />

            {/* ✅ Task Due Date Input */}
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={newTask.dueDate}
              onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
            />

            {/* ✅ Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.createButton]}
                onPress={addTask}
              >
                <Text style={styles.buttonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  /* ✅ Floating Button */
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  /* ✅ Modal Overlay */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ✅ Modal Content */
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  /* ✅ Input Fields */
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },

  /* ✅ Buttons */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    marginRight: 5,
  },
  createButton: {
    backgroundColor: "#4CD964",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
