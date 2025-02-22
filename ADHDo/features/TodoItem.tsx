import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

export interface Todo {
  title: string;
  done: boolean;
  id: string;
}

interface TodoItemProps {
  item: Todo;
  toggleDone: () => void;
  deleteItem: () => void;
}

const TodoItem = ({ item, toggleDone, deleteItem }: TodoItemProps) => {
  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity onPress={toggleDone} style={styles.todo}>
        {item.done && <Ionicons name='checkmark-circle' size={32} color='green' />}
        {!item.done && <Entypo name="circle" size={32} color='black' />}
        <Text style={styles.todoText}>{item.title}</Text>
      </TouchableOpacity>
      <Ionicons name='trash-bin-outline' size={24} color='red' onPress={deleteItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
  },
  todoText: {
    flex: 1,
  },
  todo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodoItem;
