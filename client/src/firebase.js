// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmeQCKpeWNUX4yfJ4jFZNu2akSR4yjQZo",
  authDomain: "adva8-2023.firebaseapp.com",
  projectId: "adva8-2023",
  storageBucket: "adva8-2023.appspot.com",
  messagingSenderId: "1035488894149",
  appId: "1:1035488894149:web:605549698d099457ca64ac",
  measurementId: "G-FLL18PQ4Q5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
