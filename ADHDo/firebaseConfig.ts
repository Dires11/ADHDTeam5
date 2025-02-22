import { initializeApp } from 'firebase/app';
//import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCX06RrawVk5ZSEpRU84JI7v6ceiAZKrxE",
    authDomain: "adhdo-4175d.firebaseapp.com",
    projectId: "adhdo-4175d",
    storageBucket: "adhdo-4175d.firebasestorage.app",
    messagingSenderId: "332201500397",
    appId: "1:332201500397:web:38a79cbd5b57a3ed4cb6e4",
    measurementId: "G-HZMZKW1XKK"
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
