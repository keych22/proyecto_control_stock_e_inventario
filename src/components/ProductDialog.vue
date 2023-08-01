<template>
  <v-container>
    <v-form>
      <product-description :product="props.item" @update="update" />
      <client-description :product="props.item" @update="update" />
      <sales-description :product="props.item" @update="update" />
      <cancel-apply @apply="apply" @cancel="$emit('cancel')" />
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { type PropType, unref } from "vue";
import CancelApply from "@/components/CancelApply.vue";
import ClientDescription from "@/components/ClientDescription.vue";
import type { Product } from "@/core/validation";
import ProductDescription from "@/components/ProductDescription.vue";
import SalesDescription from "@/components/SalesDescription.vue";

const props = defineProps({
  id: { type: String, required: true },
  item: { type: Object as PropType<Product>, required: true },
});

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "apply", key: String, product: Product): void;
}>();

let newProduct = unref(props.item);

function update(product: Product) {
  newProduct = product;
}

function apply() {
  emit("apply", props.id, newProduct);
}
</script>
