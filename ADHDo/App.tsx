import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import List from './app/screens/List';
import Login from './app/screens/Login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  //--------------------------Sample Login Page-----------------------------

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="My Todos" component={List} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


