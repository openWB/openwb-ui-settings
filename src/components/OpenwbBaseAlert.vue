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
