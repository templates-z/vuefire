import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebase } from "./firebase";
import { ref, computed } from "vue";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "User" | "Admin" | "Editor" | "SuperAdmin" | "Author";
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: any;
  updatedAt: any;
}

export interface signinCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "User" | "Admin" | "Editor" | "SuperAdmin" | "Author";
}

// Reactive user state
export const currentUser = ref<User | null>(null);
export const userProfile = ref<UserProfile | null>(null);
export const authReady = ref(false);
export const isAuthenticated = computed(() => !!currentUser.value);
export const isAdmin = computed(() => userProfile.value?.role === "Admin" || userProfile.value?.role === "SuperAdmin");
export const isStaff = computed(
  () =>
    userProfile.value?.role === "Admin" || userProfile.value?.role === "SuperAdmin" || userProfile.value?.role === "Editor",
);

// Initialize auth state listener
export async function initAuthStateListener() {
  if (!firebase.auth) {
    throw new Error("Firebase auth not initialized");
  }

  onAuthStateChanged(firebase.auth, async (user) => {
    currentUser.value = user;
    console.log("Auth state changed. Current user:", user);
    if (user) {
      try {
        // Load user profile from Firestore
        const profileDoc = await getDoc(doc(firebase.db!, "users", user.uid));
        if (profileDoc.exists()) {
          userProfile.value = profileDoc.data() as UserProfile;
          // Let the router guard handle redirects
        } else {
          // Create default profile if it doesn't exist
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || "",
            role: "User",
            firstName: "",
            lastName: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(firebase.db!, "users", user.uid), defaultProfile);
          userProfile.value = defaultProfile;
          // Let the router guard handle redirects
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        userProfile.value = null;
      }
    } else {
      userProfile.value = null;
      // Let the router guard handle redirects
    }

    // Mark auth as ready after the first state change
    if (!authReady.value) {
      console.log('Auth is now ready!')
    }
    authReady.value = true;
  });
}

export async function signinUser(
  credentials: signinCredentials,
): Promise<User> {
  if (!firebase.auth) {
    throw new Error("Firebase auth not initialized");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      firebase.auth,
      credentials.email,
      credentials.password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function signupUser(signupData: SignupData): Promise<User> {
  if (!firebase.auth || !firebase.db) {
    throw new Error("Firebase not initialized");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebase.auth,
      signupData.email,
      signupData.password,
    );

    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: `${signupData.firstName} ${signupData.lastName}`,
    });

    // Create user profile in Firestore
    const userProfile: any = {
      uid: user.uid,
      email: user.email!,
      displayName: `${signupData.firstName} ${signupData.lastName}`,
      role: signupData.role || "User",
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add phone if it's provided (not undefined)
    if (signupData.phone) {
      userProfile.phone = signupData.phone;
    }

    await setDoc(doc(firebase.db, "users", user.uid), userProfile);

    return user;
  } catch (error: any) {
    console.error('Registration failed:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function signInWithGoogle(): Promise<User> {
  if (!firebase.auth || !firebase.db) {
    throw new Error("Firebase not initialized");
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const userCredential = await signInWithPopup(firebase.auth, provider);
    const user = userCredential.user;

    // Check if user profile exists in Firestore
    const profileDoc = await getDoc(doc(firebase.db, "users", user.uid));
    
    if (!profileDoc.exists()) {
      // Create user profile if it doesn't exist
      const displayName = user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userProfile: any = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName,
        role: "User",
        firstName: firstName,
        lastName: lastName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Only add avatar if it exists
      if (user.photoURL) {
        userProfile.avatar = user.photoURL;
      }

      await setDoc(doc(firebase.db, "users", user.uid), userProfile);
    }

    return user;
  } catch (error: any) {
    console.error('Google sign-in failed:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function signOutUser(): Promise<void> {
  if (!firebase.auth) {
    throw new Error("Firebase auth not initialized");
  }

  try {
    await signOut(firebase.auth);
  } catch (error: any) {
    throw new Error("Failed to signOut");
  }
}

export async function resetPassword(email: string): Promise<void> {
  if (!firebase.auth) {
    throw new Error("Firebase auth not initialized");
  }

  try {
    await sendPasswordResetEmail(firebase.auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function updateUserProfile(
  updates: Partial<UserProfile>,
): Promise<void> {
  if (!firebase.db || !currentUser.value) {
    throw new Error("Firebase not initialized or user not authenticated");
  }

  try {
    const userRef = doc(firebase.db, "users", currentUser.value.uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // Update local state
    if (userProfile.value) {
      userProfile.value = { ...userProfile.value, ...updates };
    }
  } catch (error: any) {
    throw new Error("Failed to update profile");
  }
}

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No user found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "Email address is already in use.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing authentication.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by the browser.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address but different sign-in credentials.";
    default:
      return "Authentication failed. Please try again.";
  }
}
