<template>
  <div>
    <v-row>
      <div class="font-italic font-weight-black">Información de venta</div>
    </v-row>
    <v-row>
      <v-text-field
        v-model="value.purchasePrice"
        label="Precio de compra"
        type="text"
        @update:model-value="updatePurchasePrice"
      />
    </v-row>
    <v-row>
      <v-text-field
        v-model="value.credit"
        label="Abono"
        type="text"
        placeholder="Monto"
        @update:model-value="updateCredit"
      />
    </v-row>
    <v-row>
      <v-text-field v-model="value.difference" label="Diferencia" type="text" />
    </v-row>
    <v-row>
      <v-text-field
        v-model="value.sellingPrice"
        label="Precio de venta"
        type="text"
        @update:model-value="updateSalePrice"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, unref } from "vue";
import type { Entry } from "@/core/core";

const props = defineProps({
  product: { type: Object as PropType<Entry>, required: true },
});

const newProduct = unref(props.product);

const emit = defineEmits<{
  (e: "update", newProduct: Entry): void;
}>();

function updatePurchasePrice(purchasePrice: string) {
  newProduct.purchasePrice = purchasePrice;
  emit("update", newProduct);
}

function updateCredit(credit: string) {
  newProduct.credit = credit;
  emit("update", newProduct);
}
function updateSalePrice(salePrice: string) {
  newProduct.sellingPrice = salePrice;
  emit("update", newProduct);
}

const value = ref(props.product);
</script>
