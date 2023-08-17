<template>
  <h1>Información de Venta</h1>
  <v-form>
    <v-row>
      <v-col cols="6">
        <div class="font-italic font-weight-black">Descripción</div>
        <v-list class="list-group list-group-flush">
          <v-list-item class="list-group-item border-0">
            Producto: {{ product.product }}
          </v-list-item>
          <v-list-item class="list-group-item border-0">
            Tipo: {{ product.type }}</v-list-item
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
          v-model="product.state"
          label="Condición del producto"
          :items="[
            'Apartado',
            'Crédito',
            'Dañado',
            'Perdido',
            'Sin vender',
            'Vendido',
          ]"
        />
      </v-col>
    </v-row>
    <v-row class="font-italic font-weight-black">Datos sobre el cliente</v-row>
    <v-row>
      <v-col col="6">
        <v-text-field
          v-model="product.client"
          label="Nombre"
          placeholder="Nombre del cliente"
        />
        <v-text-field
          v-model="product.telephone"
          label="Teléfono (opcional)"
          :rules="[validateTelephone]"
          placeholder="Indique un número telefónico"
        />
      </v-col>
      <v-col col="6">
        <v-text-field
          v-model="product.address"
          label="Lugar de entrega"
          placeholder="Dirección"
        />
        <v-text-field
          v-model="product.sellingDate"
          type="date"
          :rules="[validateSellingDate]"
          label="Fecha de venta"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-select
          v-model="product.contact"
          label="Forma de contacto"
          :items="[
            'Facebook',
            'Instagram',
            'Ninguna',
            'Personal',
            'Referencia',
            'Whatsapp',
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <div class="font-italic font-weight-black">Información de venta</div>
    </v-row>
    <v-row>
      <v-text-field
        v-model="purchasePriceString"
        label="Precio de compra"
        type="text"
      />
    </v-row>
    <v-row>
      <v-text-field
        v-model="creditString"
        label="Abono"
        type="text"
        placeholder="Monto"
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
      />
    </v-row>
    <v-row>
      <v-btn @click="cancel">Cancelar</v-btn>
      <v-btn @click="apply">Aplicar</v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isValidSellingDate, isValidTelephone } from "@/core/validation";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useDBStore } from "@/store/db";

const route = useRoute();
const router = useRouter();
const key = route.params.id as string;
const db = useDBStore();

const product = db.getProduct(key);
function goHome() {
  router.push({ name: "home" });
}

function apply() {
  db.update(key, product);
  goHome();
}
function cancel() {
  goHome();
}

function convertDecimalToString(number: number): string {
  return (number / 100).toFixed(2);
}

const purchasePriceString = computed(() =>
  convertDecimalToString(product.purchasePrice)
);

const sellingPriceString = computed(() =>
  convertDecimalToString(product.sellingPrice)
);

const difference = computed(() => {
  return ((product.sellingPrice - product.credit) / 100).toFixed(2);
});

function validateTelephone(telephone: string): boolean | string {
  const tuplaValueValidTelephone = isValidTelephone(telephone, product.state);
  const valid = tuplaValueValidTelephone[1];
  return valid ? true : "Formato de télefono incorrecto";
}

function validateSellingDate(sellingDate: string): boolean | string {
  const tuplaValueValidSellingDate = isValidSellingDate(
    sellingDate,
    product.purchaseDate,
    product.state
  );
  const valid = tuplaValueValidSellingDate[1];
  return valid ? true : "Fecha ingresada en un rango no válido";
}

const creditString = computed(() => convertDecimalToString(product.credit));
</script>
