import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{"\n"}ADH-Do</ThemedText>

      <ThemedView style={styles.formContainer}>
        <ThemedText style={styles.formTitle}>Sign Up</ThemedText>
        <ThemedText style={styles.formSubtitle}>Just a few things to get started</ThemedText>

        {/* Input fields with proper typing */}
        <TextInput style={styles.input} placeholder="username" autoCapitalize="none" />
        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput style={styles.input} placeholder="password" secureTextEntry autoCapitalize="none" />

        {/* Button with explicit types */}
        <TouchableOpacity style={styles.continueButton} onPress={() => console.log('Continue pressed')}>
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>

        
          <ThemedText style={styles.loginText}>
            Already have an account? 
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <ThemedText style={styles.loginLink}>Login</ThemedText>
            </TouchableOpacity>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default HomeScreen;

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
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
});
