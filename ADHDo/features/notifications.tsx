import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Must use a physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Function to schedule a reminder notification
export async function scheduleTodoReminder(timeInSeconds: number): Promise<void> {
    console.log(`Scheduling notification in ${timeInSeconds} seconds...`);  // Debugging line
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder!',
          body: 'You have unfinished tasks in your To-Do list. 📋',
          sound: true,
        },
        trigger: {
          seconds: timeInSeconds,  // Time in seconds after which the notification will fire
          repeats: false, // Only once
        } as Notifications.TimeIntervalTriggerInput, // Ensure the right trigger type
      });
      console.log('Notification scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }
  
  
