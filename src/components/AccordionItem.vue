<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="'#' + id"
      >
        {{ title }}
      </button>
    </h2>
    <div
      :id="id"
      class="accordion-collapse collapse"
      :data-bs-parent="'#' + parentId"
    >
      <div class="accordion-body">
        <check-box-group :options="options" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBoxGroup from "@/components/CheckBoxGroup.vue";
import _ from "lodash";

defineProps<{
  parentId: string;
  title: string;
  options: string[];
}>();

const id = _.uniqueId("accordion-collapse-");
</script>
