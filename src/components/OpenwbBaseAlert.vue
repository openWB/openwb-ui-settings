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

<style scoped lang="scss">
/* Base styles for the alert card */
.card-text.alert {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family:  sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  

}

/* Alert subtype color variants */
.alert-primary {
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
}

</style>
