<template>
  <v-row>
    <v-col cols="6">
      <div class="font-italic font-weight-black">Descripción</div>
      <v-list class="list-group list-group-flush">
        <v-list-item class="list-group-item border-0">
          Producto: {{ product.product }}
        </v-list-item>
        <v-list-item class="list-group-item border-0"
          >Tipo: {{ product.type }}</v-list-item
        >
        <v-list-item class="list-group-item border-0"
          >Marca: {{ product.brand }}</v-list-item
        >
        <v-list-item class="list-group-item border-0"
          >Género: {{ product.gender }}</v-list-item
        >
        <v-list-item class="list-group-item border-0"
          >Color: {{ product.color }}</v-list-item
        >
        <v-list-item class="list-group-item border-0"
          >Talle: {{ product.size }}</v-list-item
        >
      </v-list>
    </v-col>
    <v-col col="6">
      <v-select
        v-model="state"
        label="Condición del producto"
        :items="[
          'Apartado',
          'Crédito',
          'Dañado',
          'Perdido',
          'Sin vender',
          'Vendido',
        ]"
        @update:model-value="update"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { type PropType, ref, unref } from "vue";
import type { Product } from "@/core/validation";

const props = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
const state = ref(props.product.state);

const newProduct = unref(props.product);

const emit = defineEmits<{
  (e: "update", newProduct: Product): void;
}>();
function update(state: string) {
  newProduct.state = state;
  emit("update", newProduct);
}
</script>
