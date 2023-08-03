<template>
  <div>
    <v-row>
      <div class="font-italic font-weight-black">Información de venta</div>
    </v-row>
    <v-row>
      <v-text-field
        v-model="purchasePriceString"
        label="Precio de compra"
        type="text"
        @update:model-value="updatePurchasePrice"
      />
    </v-row>
    <v-row>
      <v-text-field
        v-model="creditString"
        label="Abono"
        type="text"
        placeholder="Monto"
        @update:model-value="updateCredit"
      />
    </v-row>
    <v-row>
      <v-text-field v-model="difference" label="Diferencia" type="text" />
    </v-row>
    <v-row>
      <v-text-field
        v-model="sellingPriceString"
        label="Precio de venta"
        type="text"
        @update:model-value="updateSalePrice"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed, ref, unref } from "vue";
import type { Product } from "@/core/validation";

const props = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});

const newProduct = unref(props.product);
const difference = computed(() => {
  return ((newProduct.sellingPrice - newProduct.credit) / 100).toFixed(2);
});

const emit = defineEmits<{
  (e: "update", newProduct: Product): void;
}>();

function updatePurchasePrice(purchasePrice: number) {
  newProduct.purchasePrice = purchasePrice;
  emit("update", newProduct);
}

function updateCredit(credit: number) {
  newProduct.credit = credit;
  emit("update", newProduct);
}
function updateSalePrice(salePrice: number) {
  newProduct.sellingPrice = salePrice;
  emit("update", newProduct);
}

function convertDecimalToString(number: number): string {
  return (number / 100).toFixed(2);
}

const purchasePriceString = computed(() =>
  convertDecimalToString(value.value.purchasePrice)
);
const sellingPriceString = computed(() =>
  convertDecimalToString(value.value.sellingPrice)
);
const creditString = computed(() => convertDecimalToString(value.value.credit));
const value = ref(props.product);
</script>
