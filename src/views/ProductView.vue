<template>
  <nav-bar
    ><h1>Información de Venta</h1>
    <v-form ref="form">
      <v-row>
        <v-col cols="6">
          <div class="font-italic font-weight-black">Descripción</div>
          <v-list class="list-group list-group-flush">
            <v-list-item class="list-group-item border-0">
              Producto: {{ product.product }}
            </v-list-item>
            <v-list-item class="list-group-item border-0">
              Tipo: {{ product.type }}
            </v-list-item>
            <v-list-item class="list-group-item border-0"
              >Marca: {{ product.brand }}
            </v-list-item>
            <v-list-item class="list-group-item border-0"
              >Género: {{ product.gender }}
            </v-list-item>
            <v-list-item class="list-group-item border-0"
              >Color: {{ product.color }}
            </v-list-item>
            <v-list-item class="list-group-item border-0"
              >Talle: {{ product.size }}
            </v-list-item>
          </v-list>
        </v-col>
        <v-col col="6">
          <v-select
            v-model="product.state"
            label="Condición del producto"
            :items="States"
          />
        </v-col>
      </v-row>
      <v-row class="font-italic font-weight-black"
        >Datos sobre el cliente</v-row
      >
      <v-row>
        <v-col col="6">
          <v-text-field
            v-model="product.client"
            :rules="[validateClientInput]"
            label="Nombre"
            placeholder="Nombre del cliente (Nota: opcional si el estado es 'Vendido')"
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
            :rules="[validateDeliveryInput]"
            label="Lugar de entrega (Opcional)"
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
            :items="ContactMethod"
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
          readonly
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
  </nav-bar>
</template>

<script setup lang="ts">
import { ContactMethod, States } from "@/core/core";
import { computed, ref, watch } from "vue";
import {
  isValidClient,
  isValidDelivery,
  isValidSellingDate,
  isValidTelephone,
} from "@/core/validation";
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import type { VForm } from "vuetify/lib/components/index.mjs";
import { useDBStore } from "@/store/db";

const route = useRoute();
const router = useRouter();
const key = route.params.id as string;
const db = useDBStore();

const form = ref<VForm | null>(null);
const product = ref(db.getProduct(key));

const pesosToCents = 100;
function convertDecimalToString(number: number): string {
  return isNaN(number) ? "" : (number / pesosToCents).toFixed(2);
}

const purchasePriceString = computed(() =>
  convertDecimalToString(product.value.purchasePrice)
);

const sellingPriceString = computed(() =>
  convertDecimalToString(product.value.sellingPrice)
);

const difference = computed(() => {
  return convertDecimalToString(
    product.value.sellingPrice - product.value.credit
  );
});

const creditString = computed(() =>
  convertDecimalToString(product.value.credit)
);

watch(
  product,
  async () => {
    const validation = await form.value.validate();
    console.log(validation);
  },
  { deep: true }
);
function goHome() {
  router.push({ name: "home" });
}

function apply() {
  db.update(key, product.value);
  goHome();
}
function cancel() {
  goHome();
}

function validateDeliveryInput(delivery: string): boolean | string {
  const state = product.value.state;
  const deliveryAndValidation = isValidDelivery(delivery, state);
  let valid = deliveryAndValidation[1];
  if (valid) {
    return true;
  }
  switch (state) {
    case "Credito":
    case "Vendido":
      return "Ingresar un lugar de entrega";
    case "Apartado":
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      return "Este campo DEBE estar vacío.";
  }
  return false;
}

function validateClientInput(client: string): boolean | string {
  const state = product.value.state;
  const clientAndValidation = isValidClient(client, state);
  const valid = clientAndValidation[1];
  if (valid) {
    return true;
  }
  switch (state) {
    case "Credito":
    case "Apartado":
      return "El campo del nombre no puede estar vacío.";
    case "Vendido":
      return true;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      return "El campo del nombre debe estar vacío.";
  }
  return false;
}

function validateTelephone(telephone: string): boolean | string {
  const tuplaValueValidTelephone = isValidTelephone(
    telephone,
    product.value.state
  );
  const valid = tuplaValueValidTelephone[1];
  return valid ? true : "Formato de télefono incorrecto";
}

function validateSellingDate(sellingDate: string): boolean | string {
  const tuplaValueValidSellingDate = isValidSellingDate(
    sellingDate,
    product.value.purchaseDate,
    product.value.state
  );
  const valid = tuplaValueValidSellingDate[1];
  return valid ? true : "Fecha ingresada en un rango no válido";
}
</script>
