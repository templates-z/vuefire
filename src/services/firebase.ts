import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { reactive, ref } from "vue";

// Replace with your Firebase project configuration
interface FirebaseInstance {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

const initialized = ref<boolean>(false);

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate that all required environment variables are present
const validateConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}. Please check your .env file.`);
  }
};

const firebase = reactive<FirebaseInstance>({
  app: null,
  db: null,
  auth: null,
  storage: null,
});

async function initializeFirebase() {
  if (initialized.value) {
    return;
  }
  try {
    // Validate configuration before initializing
    validateConfig();
    
    firebase.app = initializeApp(firebaseConfig);
    firebase.db = getFirestore(firebase.app);
    firebase.auth = getAuth(firebase.app);
    firebase.storage = getStorage(firebase.app);
    initialized.value = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw new Error("Failed to initialize Firebase");
  }
}
export { initializeFirebase, firebase };

// Export convenient references
export const db = firebase.db;
export const auth = firebase.auth;
export const storage = firebase.storage;
