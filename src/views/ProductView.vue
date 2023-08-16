<template>
  <h1>Información de Venta</h1>
  <v-form>
    <product-description v-model:product="product" />
    <client-description v-model:product="product" />
    <sales-description v-model:product="product" />
    <v-row>
      <v-btn @click="cancel">Cancelar</v-btn>
      <v-btn @click="apply">Aplicar</v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import ClientDescription from "@/components/ClientDescription.vue";
import ProductDescription from "@/components/ProductDescription.vue";
import SalesDescription from "@/components/SalesDescription.vue";
import { useDBStore } from "@/store/db";

const route = useRoute();
const router = useRouter();
const key = route.params.id as string;
const db = useDBStore();

const product = db.getProduct(key);
function goHome() {
  router.push({ name: "home" });
}

function apply() {
  db.update(key, product);
  goHome();
}
function cancel() {
  goHome();
}
</script>
