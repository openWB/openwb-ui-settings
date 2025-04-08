<template>
  <button
    type="button"
    class="btn btn-block"
    :title="tooltip"
    @click.prevent="click"
  >
    <slot>{{ title }}</slot>
  </button>
</template>

<script>
export default {
  name: "OpenwbClickButton",
  props: {
    title: { type: String, required: false, default: "" },
    tooltip: { type: String, required: false, default: "" },
  },
  emits: ["buttonClicked"],
  methods: {
    click(event) {
      this.$emit("buttonClicked", event);
    },
  },
};
</script>

<style scoped>
button:not(:disabled) {
  cursor: pointer;
}
</style>
