import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/themes/Colors";

type Props = {
  title: string;
  description?: string;
  dueDate: string;
};

export default function TaskCard({ title, description, dueDate }: Props) {
  const translateX = useSharedValue(0); // ✅ Track horizontal movement
  const backgroundColor = useSharedValue(Colors.light.primary); // ✅ Background color

  // Swipe Gesture Handler
  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        // ✅ Only swipe left
        translateX.value = event.translationX;
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        backgroundColor.value = Colors.light.success;
        translateX.value = withSpring(0); // ✅ Keep moved to left
      } else {
        backgroundColor.value = Colors.light.primary;
        translateX.value = withSpring(0); // ✅ Snap back to original position
      }
    });

  // Animated Styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.max(-150, Math.min(translateX.value, 150)) }, // ✅ Limit the movement
    ], // ✅ Move the card
    backgroundColor: withTiming(backgroundColor.value, { duration: 25 }), // ✅ Smooth color transition
  }));

  return (
    <View style={styles.wrapper}>
      {/* ✅ Swipable Card */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.container, animatedCardStyle]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.description}>
            {description ? description : "No description"}
          </Text>
          <Text style={styles.due}>{dueDate}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    maxWidth: 500,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    padding: 15,
  },
  titleContainer: {
    paddingBottom: 5,
  },
  title: {
    color: Colors.light.onPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    color: Colors.light.onPrimary,
    marginBottom: 5,
  },
  due: {
    fontSize: 14,
    color: Colors.light.onPrimary,
    borderTopWidth: 1,
    borderColor: Colors.light.secondary,
    paddingTop: 5,
  },
});
