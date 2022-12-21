<template>
  <v-form class="mx-auto px-6 py-8" @submit.prevent="login">
    <v-text-field v-model="email" label="Correo Electrónico" type="email" />
    <v-text-field v-model="password" label="Contraseña" type="password" />
    <v-btn :disabled="incompleteForm" color="success" type="submit">
      Iniciar sesión
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import router from "@/router/router";
import { useAuthStore } from "@/store/auth";

const email = ref<null | string>(null);
const password = ref<null | string>(null);

const incompleteForm = computed(() => !email.value || !password.value);

function reset() {
  email.value = null;
  password.value = null;
}

async function login() {
  if (email.value && password.value) {
    const auth = useAuthStore();

    auth
      .logIn(email.value, password.value)
      .then(() => {
        router.push({ name: "home" });
      })
      .catch((reason) => {
        alert(reason);
      });
    reset();
  }
}
</script>
