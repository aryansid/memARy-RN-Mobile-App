// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD003894Cz3__4C5s9511lNLvhcqEXJnO8",
  authDomain: "memary-142b8.firebaseapp.com",
  projectId: "memary-142b8",
  storageBucket: "memary-142b8.appspot.com",
  messagingSenderId: "748164427131",
  appId: "1:748164427131:web:088a0104ecd7490e8861de",
  measurementId: "G-F6NWNRVJ2G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('DB instance: ', db);

export {auth, db, storage}