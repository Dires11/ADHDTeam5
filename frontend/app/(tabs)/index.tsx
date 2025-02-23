import React from "react";
import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

// Type for the social button props
interface SocialButtonProps {
  source: ImageSourcePropType;
  text: string;
}

// Social Button Component with Props
const SocialButton: React.FC<SocialButtonProps> = ({ source, text }) => (
  <ThemedView style={styles.socialButton}>
    <Image source={source} style={styles.socialIcon} />
    <ThemedText style={styles.socialButtonText}>{text}</ThemedText>
  </ThemedView>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook for navigation

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>{"\n\n\n"}ADH-Do</ThemedText>

        <ThemedView style={styles.getStartedContainer}>
          <ThemedText style={styles.getStartedTitle}>Get Started</ThemedText>
          <ThemedText style={styles.getStartedSubtitle}>
            Start with a sign up or login
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Sign Up")}
          >
            <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  getStartedContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  getStartedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  getStartedSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
});
