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
          :rules="[validateTelephone]"
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
          v-model="value.sellingDate"
          type="date"
          label="Fecha de venta"
          @update:model-value="updateSellingDate"
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
import { type Product, isValidTelephone } from "@/core/validation";
import { type PropType, ref, unref } from "vue";

const props = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});

const newProduct = unref(props.product);

const emit = defineEmits<{
  (e: "update", newProduct: Product): void;
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

function updateSellingDate(sellingDate: string) {
  newProduct.sellingDate = sellingDate;
  emit("update", newProduct);
}

function updateContact(contact: string) {
  newProduct.contact = contact;
  emit("update", newProduct);
}

function validateTelephone(telephone: string): boolean | string {
  const tuplaValueValidTelephone = isValidTelephone(
    telephone,
    newProduct.state
  );
  const valid = tuplaValueValidTelephone[1];
  return valid ? true : "Formato de télefono incorrecto";
}

const value = ref(props.product);
</script>
