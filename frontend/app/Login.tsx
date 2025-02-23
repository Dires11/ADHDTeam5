import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for navigation
type AuthStackParamList = {
  SignUpScreen: undefined;
};

const Login: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{"\n"}ADH-Do</ThemedText>

      <ThemedView style={styles.formContainer}>
        <ThemedText style={styles.formTitle}>Login</ThemedText>
        <ThemedText style={styles.formSubtitle}>Enter your information to login</ThemedText>

        <TextInput 
          style={styles.input} 
          placeholder="username" 
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput 
          style={styles.input} 
          placeholder="password" 
          secureTextEntry 
        />

        <TouchableOpacity style={styles.continueButton}>
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.signupText}>
          Don’t have an account?       
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <ThemedText style={styles.signupLink}>Sign up</ThemedText>
          </TouchableOpacity>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
  },
  signupLink: {
    fontSize: 14,
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
});
