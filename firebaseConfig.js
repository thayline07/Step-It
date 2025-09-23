// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWcKZKNHPG-MkTns7fHdzQHzarPXYpOjM",
  authDomain: "step-it-22584.firebaseapp.com",
  projectId: "step-it-22584",
  storageBucket: "step-it-22584.firebasestorage.app",
  messagingSenderId: "1037994429746",
  appId: "1:1037994429746:web:3773f2962dd9f80a065b2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
