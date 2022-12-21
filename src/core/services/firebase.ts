import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

class Firebase {
  private static readonly options = {
    apiKey: "AIzaSyAsxHcTqrCKD5Yxqe3gIiMUtAZ085t1vJY",
    authDomain: "kchmodas.firebaseapp.com",
    projectId: "kchmodas",
    storageBucket: "kchmodas.appspot.com",
    messagingSenderId: "340093435974",
    appId: "1:340093435974:web:9def9bb1732f1c3efb0a47",
  };

  private readonly app;
  public readonly auth;
  public readonly db;

  constructor() {
    this.app = initializeApp(Firebase.options);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);

    if (import.meta.env.DEV) {
      connectAuthEmulator(this.auth, "http://localhost:9099");
      connectFirestoreEmulator(this.db, "localhost", 8080);
    }
  }
}

const firebase = new Firebase();
export default firebase;
