<template>
  <nav-bar class="mt-2">
    <v-row class="ml-0 mb-0 mr-0">
      <v-col cols="12" sm="6">
        <upload-file />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar Productos"
          variant="outlined"
          single-line
          hide-details
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="tableData"
      :items-per-page="5"
      class="elevation-2"
      item-value="product"
    >
      <template #[`item.actions`]="{ item }">
        <v-icon size="small" class="ml-3" @click="editItem(item.raw.key)">
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
const splitSearch = computed(() => dbStore.filterProducts(search.value));

const tableData = computed(() =>
  _.map(splitSearch.value, (x) => {
    return { key: x.key, ...x.product };
  })
);
const editItem = (key: any) => {
  router.push({ name: "product", params: { id: key } });
};

const headers = [
  { title: "Ciudad", key: "city" },
  { title: "Producto", key: "product" },
  { title: "Tipo de Artículo", key: "type" },
  { title: "Detalle", key: "detail" },
  { title: "Marca", key: "brand" },
  { title: "Género", key: "gender" },
  { title: "Código", key: "code" },
  { title: "Color", key: "color" },
  { title: "Talle", key: "size" },
  { title: "Estado", key: "state" },
  { title: "Acción", key: "actions", sortable: false },
];
</script>
