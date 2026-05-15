<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || null"
    :type="href ? null : 'button'"
    class="btn btn-block"
    :title="tooltip"
    :target="href ? '_blank' : null"
    rel="noopener noreferrer"
    @click="handleClick"
  >
    <slot>{{ title }}</slot>
  </component>
</template>

<script>
export default {
  name: "OpenwbClickButton",
  props: {
    title: { type: String, required: false, default: "" },
    tooltip: { type: String, required: false, default: "" },
    href: { type: String, default: null },
  },
  emits: ["buttonClicked"],
  methods: {
    handleClick(event) {
      if (!this.href) {
        event.preventDefault();
        this.$emit("buttonClicked", event);
      }
    },
  },
};
</script>

<style scoped>
button:not(:disabled) {
  cursor: pointer;
}
</style>
