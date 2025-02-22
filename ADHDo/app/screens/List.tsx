// screens/List.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useTodos } from '../../hooks/useTodos';
import { scheduleTodoReminder } from '../../features/notifications';
import TodoItem from '../../features/TodoItem';

const List = () => {
  const [todo, setTodo] = useState('');
  const { todos, addTodo, toggleDone, deleteTodo } = useTodos();
  const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));


  const handleAddTodo = async () => {
    if (todo) {
      await addTodo(todo);
      setTodo('');
      scheduleTodoReminder(10); // Schedule a reminder in 10 seconds
    }
  };

  const renderTodo = ({ item }: { item: Todo }) => {
    return (
      <TodoItem
        item={item}
        toggleDone={() => toggleDone(item.id, item.done)}
        deleteItem={() => deleteTodo(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <Button onPress={handleAddTodo} title="Add Todo" disabled={todo === ''} />
      </View>

      {todos.length > 0 && (
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(todo) => todo.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default List;
