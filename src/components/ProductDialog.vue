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
import type { Entry } from "@/core/core";
import ProductDescription from "@/components/ProductDescription.vue";
import SalesDescription from "@/components/SalesDescription.vue";

const props = defineProps({
  id: { type: String, required: true },
  item: { type: Object as PropType<Entry>, required: true },
});

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "apply", key: String, product: Entry): void;
}>();

let newProduct = unref(props.item);

function update(product: Entry) {
  newProduct = product;
}

function apply() {
  //key???
  emit("apply", props.id, newProduct);
}
</script>
