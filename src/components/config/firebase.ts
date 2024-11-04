// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWniAHd9KwNQ0erdOGC3dYScXfSUWyBjk",
  authDomain: "podbooking-caa44.firebaseapp.com",
  projectId: "podbooking-caa44",
  storageBucket: "podbooking-caa44.appspot.com",
  messagingSenderId: "543585897558",
  appId: "1:543585897558:web:6d77f7da3a12a353b03ff7",
  measurementId: "G-3VCLQ9DYEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage =getStorage(app);
const Ggprovider = new GoogleAuthProvider();
const auth = getAuth();
export {storage, Ggprovider, auth};