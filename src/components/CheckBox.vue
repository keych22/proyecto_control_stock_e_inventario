<template>
  <div class="form-check">
    <input
      :id="id"
      v-model="checked"
      class="form-check-input"
      type="checkbox"
      @change="update"
    />
    <label class="form-check-label" :for="id">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { ref } from "vue";

defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: "update", value: boolean): void;
}>();

const id = _.uniqueId("form-check-");
const checked = ref(false);
function update() {
  emit("update", checked.value);
}
</script>
