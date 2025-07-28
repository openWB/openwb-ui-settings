<template>
  <div
    class="card-text alert"
    :class="'alert-' + subtype"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "OpenwbAlert",
  props: {
    subtype: {
      validator: function (value) {
        return ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark"].indexOf(value) !== -1;
      },
      default: "secondary",
    },
  },
};
</script>

<style scoped>
.card-text.alert {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-text :deep(p:last-of-type) {
  margin-bottom: 0;
}
</style>
