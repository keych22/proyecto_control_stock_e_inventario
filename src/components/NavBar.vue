<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>KChModas</v-app-bar-title>
      <!--      <router-link class="navbar-brand" to="/">KChModas</router-link>-->
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
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
