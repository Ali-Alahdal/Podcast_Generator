// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCusN7nJ0NRx87fw2HMka_212UQd3pJWCk",
    authDomain: "podcast-ai-b8a6a.firebaseapp.com",
    projectId: "podcast-ai-b8a6a",
    storageBucket: "podcast-ai-b8a6a.firebasestorage.app",
    messagingSenderId: "257818287151",
    appId: "1:257818287151:web:41a74526733c4e35af3ada",
    measurementId: "G-29GB247BY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
