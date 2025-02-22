import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

    const signUp = async() => {
        const after = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Check your emails!')
    }

    const signIn = async() => {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log('signin')
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder='Email' onChangeText={(text: string) => setEmail(text)} value={email} />
            <TextInput style={styles.input} textContentType='password' placeholder='Password' onChangeText={(text: string) => setPassword(text)} value={password} />

            <Button onPress={signUp} title='Create Account' />   
            <Button onPress={signIn} title='Sign in' />        
     
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flexDirection: 'column',
        paddingVertical: 20,
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
})