<template>
  <nav-bar>
    <upload-file />
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Buscar Productos"
      single-line
      hide-details
    />
    <v-data-table
      :headers="headers"
      :items="tableData"
      :items-per-page="4"
      class="elevation-1"
      item-value="product"
      :search="search"
    >
      <template #[`item.actions`]="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw.key)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </nav-bar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import UploadFile from "@/components/UploadFile.vue";
import _ from "lodash";
import { useDBStore } from "@/store/db";
import { useRouter } from "vue-router";

const dbStore = useDBStore();
const router = useRouter();

const search = ref("");

const tableData = computed(() =>
  _.map(dbStore.products, (x) => {
    return { key: x.key, ...x.product };
  })
);
const editItem = (key: any) => {
  router.push({ name: "product", params: { id: key } });
};

const headers = [
  { title: "Fecha de Compra", key: "purchaseDate" },
  { title: "Ciudad", key: "city" },
  { title: "Producto", key: "product" },
  { title: "Tipo de Artículo", key: "type" },
  { title: "Marca", key: "brand" },
  { title: "Género", key: "gender" },
  { title: "Código", key: "code" },
  { title: "Color", key: "color" },
  { title: "Talle", key: "size" },
  { title: "Estado", key: "state" },
  { title: "Acción", key: "actions", sortable: false },
];
</script>
