<template>
  <div
    :class="['base-text', { dotted: addHint }]"
    :title="description"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "OpenwbTooltip",
  props: {
    description: { type: String, default: "#TOOLTIP#" },
    addHint: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.base-text {
  position: relative;
  display: inline-block;
}

.base-text.dotted {
  border-bottom: 2px dotted var(--dark); /* Add dots under the hoverable text */
  cursor: help; /* Change cursor to indicate interactivity */
}
</style>
