<template>
  <check-box
    v-for="(option, index) in options"
    :key="option"
    :label="option"
    @update="update(index, $event)"
  />
</template>

<script setup lang="ts">
import CheckBox from "@/components/CheckBox.vue";
import _ from "lodash";

const props = defineProps<{
  options: string[];
}>();

const emit = defineEmits<{
  (e: "update", value: string[]): void;
}>();

const checkedOptions = _.map(props.options, () => false);

function update(index: number, value: boolean) {
  checkedOptions[index] = value;
  const zip = _.zip(checkedOptions, props.options) as [boolean, string][];
  const filter = _.filter(zip, (value) => value[0]);
  const selectedOptions = _.map(filter, (value) => value[1]);
  emit("update", selectedOptions);
}
</script>
