<template>
  <div :id="id" class="accordion accordion-flush">
    <accordion-item
      v-for="option in options"
      :key="option.name"
      :parent-id="id"
      :title="option.name"
      :options="option.value"
    />
  </div>
</template>

<script setup lang="ts">
import AccordionItem from "@/components/AccordionItem.vue";
import _ from "lodash";

defineProps<{
  options: { name: string; value: string[] }[];
}>();

const id = _.uniqueId("accordion-");
</script>
