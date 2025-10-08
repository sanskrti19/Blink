// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
 const firebaseConfig = {

  authDomain: "blink-9b158.firebaseapp.com",
  projectId: "blink-9b158",
  storageBucket: "blink-9b158.firebasestorage.app",
  messagingSenderId: "1015973393721",
  appId: "1:1015973393721:web:48f0a15f52f90161a3a4e8",
  measurementId: "G-S7ZKD7606E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth;
export {auth};
 