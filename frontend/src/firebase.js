import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

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
// and we're not in development mode (to prevent extension conflicts)
let analytics = null;

const initializeAnalytics = async () => {
  try {
    // Only use analytics in production to avoid extension conflicts
    if (process.env.NODE_ENV === 'production') {
      // Check if analytics is supported first
      const analyticsSupported = await isSupported();
      if (analyticsSupported) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized");
      } else {
        console.log("Firebase Analytics not supported in this environment");
      }
    } else {
      console.log("Firebase Analytics disabled in development mode");
    }
  } catch (error) {
    console.log("Analytics initialization error:", error.message);
    // Don't throw the error further - just log it
  }
};

// Initialize analytics asynchronously to avoid blocking
initializeAnalytics().catch(err => {
  console.warn("Failed to initialize Firebase Analytics:", err);
});

export { analytics }; 