<template>
  <nav-bar>
    <v-form ref="form">
      <v-container class="pa-8">
        <v-row class="font-italic font-weight-black">
          Descripción del producto
        </v-row>
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
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
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="product.state"
              class="pt-2 pr-3"
              label="Condición"
              variant="outlined"
              :items="States"
            />
          </v-col>
        </v-row>
        <v-row class="font-italic font-weight-black mb-0"
          >Datos del cliente</v-row
        >
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="product.client"
              :rules="[validateClientInput]"
              label="Nombre del cliente"
              placeholder="Nota: opcional si el estado es 'Vendido'"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="product.telephone"
              label="Teléfono (opcional)"
              :rules="[validateTelephoneInput]"
              placeholder="Ejemplos: 1135726783  o  2995189044"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="product.address"
              :rules="[validateDeliveryInput]"
              label="Lugar de entrega (Opcional)"
              variant="outlined"
              placeholder="Dirección"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="product.sellingDate"
              type="date"
              :rules="[validateSellingDateInput]"
              label="Fecha de venta"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12" sm="6">
            <v-select
              v-model="product.contact"
              label="Forma de contacto"
              variant="outlined"
              :items="ContactMethod"
            />
          </v-col>
        </v-row>
        <v-row>
          <div class="font-italic font-weight-black mb-2">Datos de venta</div>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="purchasePriceString"
              label="Precio de compra"
              variant="outlined"
              readonly
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              :model-value="sellingPriceString"
              :rules="[validateSellingPriceInput]"
              label="Precio de venta"
              variant="outlined"
              @change="changeSellingPrice"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              :model-value="creditString"
              :rules="[validateCreditInput]"
              label="Abono"
              placeholder="Monto"
              variant="outlined"
              @change="changeCredit"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="difference"
              label="Resta por pagar"
              variant="outlined"
              placeholder="Diferencia"
              readonly
            />
          </v-col>
        </v-row>
        <v-row class="d-flex justify-end mb-2">
          <v-btn class="mr-2 bg-blue-grey-lighten-4" @click="cancel"
            >Cancelar</v-btn
          >
          <v-btn
            color="success"
            class="mr-3"
            :disabled="disabledApplyButton"
            @click="apply"
            >Aplicar</v-btn
          >
        </v-row>
      </v-container>
    </v-form>
  </nav-bar>
</template>

<script setup lang="ts">
import { ContactMethod, States } from "@/core/core";
import { computed, onMounted, ref, watch } from "vue";
import {
  convertAmountDecimals,
  isValidClient,
  isValidCredit,
  isValidDelivery,
  isValidSellingDate,
  isValidSellingPrice,
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

function changeCredit(event: Event) {
  const value = convertAmountDecimals((event.target as HTMLInputElement).value);
  product.value.credit = value;
}

function changeSellingPrice(event: Event) {
  const value = convertAmountDecimals((event.target as HTMLInputElement).value);
  product.value.sellingPrice = value;
}

const pesosToCents = 100;
function convertDecimalToString(number: number): string {
  return (number / pesosToCents).toFixed(2);
}

const creditString = computed(
  () =>
    // Este variable recibe el valor calculado unicamente despues
    isNaN(product.value.credit) // de que se dispara el evento change?
      ? "" // TUVE QUE COLOCAR VACIO..? o meter esta funcion dentro
      : convertDecimalToString(product.value.credit) // changeCredit
);

// class="mr-3 bg-blue-lighten-1 text-blue-grey-darken-3"

const difference = computed(() => {
  const difference = product.value.sellingPrice - product.value.credit;
  return isNaN(difference) ? "" : convertDecimalToString(difference);
});

const purchasePriceString = computed(() =>
  // Esta funcion esta demás? ya que este valor viene sin error
  isNaN(product.value.purchasePrice) // del archivo CSV o ya es validado previamente?
    ? "invalid"
    : convertDecimalToString(product.value.purchasePrice)
);

const sellingPriceString = computed(() =>
  isNaN(product.value.sellingPrice)
    ? ""
    : convertDecimalToString(product.value.sellingPrice)
);

const disabledApplyButton = ref(false);

async function enableValidations() {
  const isValidForm = await form.value.validate();
  disabledApplyButton.value = !isValidForm.valid;
}

watch(product, enableValidations, { deep: true });

onMounted(enableValidations);

function validateClientInput(client: string): boolean | string {
  const state = product.value.state;
  const clientAndValidation = isValidClient(client, state);
  return clientAndValidation[1];
}

function validateCreditInput(credit: string): boolean | string {
  const sellingPrice = convertDecimalToString(product.value.sellingPrice);
  const state = product.value.state;
  const creditAndValidation = isValidCredit(credit, sellingPrice, state);
  return creditAndValidation[1];
}

function validateDeliveryInput(delivery: string): boolean | string {
  const state = product.value.state;
  const deliveryAndValidation = isValidDelivery(delivery, state);
  return deliveryAndValidation[1];
}

function validateSellingDateInput(sellingDate: string): boolean | string {
  const state = product.value.state;
  const purchaseDate = product.value.purchaseDate;
  const sellingDateAndValidation = isValidSellingDate(
    sellingDate,
    purchaseDate,
    state
  );
  const error = sellingDateAndValidation[1];
  return error;
}

function validateSellingPriceInput(sellingPrice: string): boolean | string {
  const credit = convertDecimalToString(product.value.credit);
  const state = product.value.state;
  const sellingPriceAndValidation = isValidSellingPrice(
    sellingPrice,
    credit,
    state
  );
  return sellingPriceAndValidation[1];
}

function validateTelephoneInput(telephone: string): boolean | string {
  const state = product.value.state;
  const telephoneAndValidation = isValidTelephone(telephone, state);
  return telephoneAndValidation[1];
}

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
</script>
