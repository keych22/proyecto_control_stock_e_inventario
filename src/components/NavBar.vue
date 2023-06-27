<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>KChModas</v-app-bar-title>
      <v-btn @click="logout"> Cerrar sesión </v-btn>
    </v-app-bar>
    <v-main><slot /></v-main>
  </v-app>
</template>

<script setup lang="ts">
import router from "@/router/router";
import { useAuthStore } from "@/store/auth";

const auth = useAuthStore();

function logout() {
  auth.logOut().then(() => {
    router.push({ name: "login" });
  });
}
</script>
