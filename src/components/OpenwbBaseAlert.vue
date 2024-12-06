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
/* Base styles for the alert card */
.card-text.alert {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Alert subtype color variants */
/* .alert-primary {
  background: linear-gradient(to right, #5a9bd5, #8fbce8);
  color: #ffffff;
}

.alert-light {
  background-color: #ffffff;
  color: #212529;
  border: 1px solid #dee2e6;
}

.alert-dark {
  background-color: #343a40;
  color: #ffffff;
} */
</style>
