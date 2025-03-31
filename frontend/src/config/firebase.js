// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtAqtIE-t0zOXQm-m-oMadpmhIxasVoko",
  authDomain: "hopebridge-577fe.firebaseapp.com",
  projectId: "hopebridge-577fe",
  storageBucket: "hopebridge-577fe.firebasestorage.app",
  messagingSenderId: "88326241530",
  appId: "1:88326241530:web:b7a230839795e9df2c9d43",
  measurementId: "G-8GE8RESD4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com'
});

// Configure Facebook provider with the provided App ID
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  'display': 'popup',
  'auth_type': 'rerequest',
  'client_id': '664379166167394'
});

// Google Sign-in function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get user credentials and token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    
    console.log("Google auth successful", { user, token });
    
    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    console.error("Google auth failed:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    
    return {
      success: false,
      error: errorMessage,
      errorCode,
      email,
      credential
    };
  }
};

// Facebook Sign-in function
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    // Get user credentials and token
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    
    console.log("Facebook auth successful", { user, token });
    
    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    console.error("Facebook auth failed:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = FacebookAuthProvider.credentialFromError(error);
    
    return {
      success: false,
      error: errorMessage,
      errorCode,
      email,
      credential
    };
  }
};

// Handle redirect result (useful for mobile browsers)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const credential = 
        GoogleAuthProvider.credentialFromResult(result) || 
        FacebookAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      return {
        success: true,
        user,
        token,
        provider: result.providerId
      };
    }
    return null;
  } catch (error) {
    console.error("Auth redirect result error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { auth }; 