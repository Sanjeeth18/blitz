import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithRedirect
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLuG-S-pImAUqTWwTfbJrrl5L2hUjEaFk",
  authDomain: "wisdomhub-3ab5e.firebaseapp.com",
  projectId: "wisdomhub-3ab5e",
  storageBucket: "wisdomhub-3ab5e.firebasestorage.app",
  messagingSenderId: "16340234040",
  appId: "1:16340234040:web:4b6f5c680f4b26b0d1dbcd",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();

export {
  auth,
  firestore,
  googleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
};
