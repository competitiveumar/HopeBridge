import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Define the Firebase configuration directly (no env variables)
const firebaseConfig = {
  apiKey: "AIzaSyCtAqtIE-t0zOXQm-m-oMadpmhIxasVoko",
  authDomain: "hopebridge-577fe.firebaseapp.com",
  projectId: "hopebridge-577fe",
  storageBucket: "hopebridge-577fe.appspot.com", // Note: Fixed the storage bucket URL
  messagingSenderId: "88326241530",
  appId: "1:88326241530:web:b7a230839795e9df2c9d43",
  measurementId: "G-8GE8RESD4J"
};

// Log the configuration for debugging
console.log("Firebase configuration:", {
  apiKey: firebaseConfig.apiKey ? "Exists" : "Missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Only initialize analytics if we're in a browser environment with the function available
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log("Analytics not initialized:", error.message);
}

export { analytics }; 