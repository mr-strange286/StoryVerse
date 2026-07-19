// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfMpoF0BF0IU29AtNZkSt4XRAjhn6M_zM",
  authDomain: "storyverse-274ba.firebaseapp.com",
  projectId: "storyverse-274ba",
  storageBucket: "storyverse-274ba.firebasestorage.app",
  messagingSenderId: "643989842145",
  appId: "1:643989842145:web:1c920e58e92ff203e16fa0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);