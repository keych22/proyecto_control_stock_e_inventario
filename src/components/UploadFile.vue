<template>
  <v-dialog v-model="dialog" persistent>
    <template #activator="{ props }">
      <v-btn v-bind="props">Cargar inventario</v-btn>
    </template>
    <v-card>
      <v-card-title>Cargar inventario</v-card-title>
      <v-card-text>
        <v-form>
          <v-file-input
            v-model="file"
            label="Seleccionar inventario en format CSV"
            @change="change"
          />
        </v-form>
        <v-progress-linear height="25" :model-value="progress">
          <strong>{{ progress }}%</strong>
        </v-progress-linear>
        <v-list
          v-if="errorMessages.length"
          bg-color="red"
          :items="errorMessages"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Log } from "@/core/log";
import _ from "lodash";
import { useDBStore } from "@/store/db";

const dbStore = useDBStore();

const dialog = ref(false);
const file = ref<File[]>([]);

const disabled = ref(false);
const progress = ref(0);
const log = ref<Log>(new Log());

function logError(message: string) {
  log.value.error(message);
}

const errorMessages = computed(() => {
  return _.map(log.value.messages, (message) => message.text);
});

function reportProgress(value: number) {
  progress.value = value;
}

async function change(e: Event) {
  disabled.value = true;
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length) {
    progress.value = 0;
    log.value.clear();
    await dbStore.loadInventory(files[0], reportProgress, logError);
  }
  disabled.value = false;
}
</script>
