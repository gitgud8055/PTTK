// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "projectii-4f4f0.firebaseapp.com",
  projectId: "projectii-4f4f0",
  storageBucket: "projectii-4f4f0.appspot.com",
  messagingSenderId: "819125072776",
  appId: "1:819125072776:web:2accee6af88c560fec003d",
  measurementId: "G-35WJEMBRG0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);