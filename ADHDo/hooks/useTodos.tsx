import { useState, useEffect } from 'react';
import { FIRESTORE_DB } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export interface Todo {
  title: string;
  done: boolean;
  id: string;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const todos: Todo[] = [];
        snapshot.docs.forEach((doc) => {
          todos.push({ id: doc.id, ...doc.data() } as Todo);
        });
        setTodos(todos);
      },
    });

    return () => subscriber();
  }, []);

  const addTodo = async (todo: string) => {
    await addDoc(collection(FIRESTORE_DB, 'todos'), { title: todo, done: false });
  };

  const toggleDone = async (id: string, done: boolean) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await updateDoc(ref, { done: !done });
  };

  const deleteTodo = async (id: string) => {
    const ref = doc(FIRESTORE_DB, `todos/${id}`);
    await deleteDoc(ref);
  };

  return {
    todos,
    addTodo,
    toggleDone,
    deleteTodo,
  };
};
