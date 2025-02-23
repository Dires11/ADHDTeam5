import { useEffect } from 'react';
import AppNavigator from './navigation';
import { registerForPushNotificationsAsync } from './features/notifications';
import { FIREBASE_AUTH } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user ? 'User logged in' : 'User not logged in');
    });

    // Register for push notifications
    registerForPushNotificationsAsync();

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return <AppNavigator />;
}
