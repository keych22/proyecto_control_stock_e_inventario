<template>
  <v-app>
    <v-app-bar class="bg-cyan-lighten-5">
      <v-app-bar-title>KChModas</v-app-bar-title>
      <v-btn class="bg-blue-grey-lighten-4 elevation-1" @click="logout">
        Cerrar sesión
      </v-btn>
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
