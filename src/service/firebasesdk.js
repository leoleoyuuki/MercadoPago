// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc, getDocs, updateDoc, doc, deleteDoc   } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOSzMtAz3os1wCYKfd1Fhor1feJGTFcEY",
    authDomain: "saas-mercadopago.firebaseapp.com",
    projectId: "saas-mercadopago",
    storageBucket: "saas-mercadopago.appspot.com",
    messagingSenderId: "196810760883",
    appId: "1:196810760883:web:6d1f06a6f9512febe906c6"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db, collection, addDoc, getDocs, updateDoc, doc, deleteDoc}