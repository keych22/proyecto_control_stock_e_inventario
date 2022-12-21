<template>
  <div>
    <v-row class="font-italic font-weight-black">Datos sobre el cliente</v-row>
    <v-row>
      <v-col col="6">
        <v-text-field
          v-model="value.client"
          label="Nombre"
          placeholder="Nombre del cliente"
          @update:model-value="updateClient"
        />
        <v-text-field
          v-model="value.telephone"
          label="Teléfono (opcional)"
          placeholder="Indique un número telefónico"
          @update:model-value="updateTelephone"
        />
      </v-col>
      <v-col col="6">
        <v-text-field
          v-model="value.address"
          label="Lugar de entrega"
          placeholder="Dirección"
          @update:model-value="updateAddress"
        />
        <v-text-field
          v-model="value.purchaseDate"
          type="date"
          label="Fecha"
          placeholder="Fecha de entrega"
          @update:model-value="updatePurchaseDate"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-select
          v-model="value.contact"
          label="Forma de contacto"
          :items="[
            '',
            'Facebook',
            'Instagram',
            'Ninguna',
            'Personal',
            'Referencia',
            'Whatsapp',
          ]"
          @update:model-value="updateContact"
        />
      </v-col>
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

function updateClient(client: string) {
  newProduct.client = client;
  emit("update", newProduct);
}

function updateTelephone(telephone: string) {
  newProduct.telephone = telephone;
  emit("update", newProduct);
}

function updateAddress(address: string) {
  newProduct.address = address;
  emit("update", newProduct);
}

function updatePurchaseDate(purchaseDate: string) {
  newProduct.purchaseDate = purchaseDate;
  emit("update", newProduct);
}

function updateContact(contact: string) {
  newProduct.contact = contact;
  emit("update", newProduct);
}

const value = ref(props.product);
</script>
