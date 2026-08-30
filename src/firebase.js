// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgq9IK0NdeaVxRRUiB29SCNQPnQvaFQbQ",
  authDomain: "notify-42908.firebaseapp.com",
  databaseURL: "https://notify-42908-default-rtdb.firebaseio.com",
  projectId: "notify-42908",
  storageBucket: "notify-42908.firebasestorage.app",
  messagingSenderId: "599752528225",
  appId: "1:599752528225:web:b32351e30d2a28f1913520",
  measurementId: "G-NN6HGGRW0N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
