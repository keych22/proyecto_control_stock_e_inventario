<template>
  <v-row>
    <v-btn @click="$emit('cancel')">Cancelar</v-btn>
    <v-btn @click="$emit('apply')">Aplicar</v-btn>
  </v-row>
</template>
<script setup lang="ts">
defineEmits<{
  (e: "cancel"): void;
  (e: "apply"): void;
}>();
</script>
