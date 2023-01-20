import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAosQkUfxRNHgxXTfdxJ8Y4b-zc7Y_StK4",
  authDomain: "catgram-bek-d78f8.firebaseapp.com",
  projectId: "catgram-bek-d78f8",
  storageBucket: "catgram-bek-d78f8.appspot.com",
  messagingSenderId: "1077336658293",
  appId: "1:1077336658293:web:3d4b5b9d436c0d6694c33c",
  measurementId: "G-FP998NSF9W"
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;


export { firebase, FieldValue };
