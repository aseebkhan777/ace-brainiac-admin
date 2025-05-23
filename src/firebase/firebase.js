// src/firebase/firebase.js
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3r-0JnH7LoPsl1tPjzpRLNPTiz9tafu8",
    authDomain: "ace-brainiac.firebaseapp.com",
    projectId: "ace-brainiac",
    storageBucket: "ace-brainiac.firebasestorage.app",
    messagingSenderId: "935961889255",
    appId: "1:935961889255:web:dccad130da2cc5fedd1542",
    measurementId: "G-05MYNT3HC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };