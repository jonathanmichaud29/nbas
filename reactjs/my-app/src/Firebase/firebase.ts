import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const generateMessageFromFirebaseErrorCode = (err: any) => {
  let sError = "Unknown error validating user credential";
  switch(err.code){
    case "auth/invalid-email":
    case "auth/wrong-password":
    case "auth/user-not-found":
      sError = "Invalid user or password";
      break;
    case "auth/too-many-requests":
      sError = "Too many attempts to login with this user. Please try again later.";
      break;
    default:
      break;
  }
  return sError;
}

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return Promise.resolve(result);
  } catch (err: any) {
    return Promise.reject(generateMessageFromFirebaseErrorCode(err));
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
    /* alert(err.message); */
  }
};

const logout = () => {
  window.localStorage.clear();
  signOut(auth);
  
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  sendPasswordReset,
  logout,
};