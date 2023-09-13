import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { defineStore } from "pinia";
import firebase from "@/core/services/firebase";
import { ref } from "vue";

function storeSetup() {
  const user = ref<null | User>(null);

  onAuthStateChanged(firebase.auth, (newUser) => {
    user.value = newUser;
  });
  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(firebase.auth, email, password);
  }
  async function logOut() {
    await signOut(firebase.auth);
  }

  return { user, logIn, logOut };
}

export const useAuthStore = defineStore("auth", storeSetup);
