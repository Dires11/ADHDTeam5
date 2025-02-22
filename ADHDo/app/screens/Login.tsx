import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { Alert } from 'react-native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigation = useNavigation();  // Access the navigation prop

    const signUp = async () => {
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            alert('Account created!');
            navigation.navigate('My Todos');  // Navigate to 'My Todos' after successful sign-up
        } catch (error: any) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async () => {
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in:', userCredential.user);
            alert('Successfully signed in!');
            navigation.navigate('My Todos');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                placeholder='Email' 
                onChangeText={(text: string) => setEmail(text)} 
                value={email} 
            />
            <TextInput 
                style={styles.input} 
                textContentType='password' 
                placeholder='Password' 
                onChangeText={(text: string) => setPassword(text)} 
                value={password} 
                secureTextEntry
            />

            {/* Show loading spinner if loading is true */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Button onPress={signUp} title='Create Account' />   
                    <Button onPress={signIn} title='Sign in' />        
                </>
            )}

            {/* Show error message if there's an error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

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
    error: {
        color: 'red',
        marginTop: 10,
    }
});
