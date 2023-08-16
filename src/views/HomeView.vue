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
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Información de Venta</span>
        </v-card-title>
        <v-card-text>
          <product-dialog
            v-if="selectedProduct"
            :id="selectedProduct.key"
            :item="selectedProduct.product"
            @apply="apply"
            @cancel="cancel"
          ></product-dialog>
        </v-card-text>
      </v-card>
    </v-dialog>
  </nav-bar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import type { Product } from "@/core/validation";
import ProductDialog from "@/components/ProductDialog.vue";
import UploadFile from "@/components/UploadFile.vue";
import _ from "lodash";
import { useDBStore } from "@/store/db";

const dbStore = useDBStore();
const dialog = ref(false);
const selectedProduct = ref<{ key: string; product: Product } | null>(null);

const search = ref("");

const tableData = computed(() =>
  _.map(dbStore.products, (x) => {
    return { key: x.key, ...x.product };
  })
);
const editItem = (product: any) => {
  selectedProduct.value = {
    key: product.key as string,
    product: _.omit(product, "key") as Product,
  };
  dialog.value = true;
};

function closeDialog() {
  dialog.value = false;
}

function apply() {
  if (selectedProduct.value) {
    dbStore.update(selectedProduct.value.key, selectedProduct.value.product);
  }
  closeDialog();
}
function cancel() {
  closeDialog();
}

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
