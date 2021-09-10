<template>
  <div class="card" :class="'border-' + subtype">
    <div class="card-header" :class="'bg-' + subtype">
      <div class="form-group mb-0">
        <div class="form-row vaRow mb-1">
          <div class="col">
            {{ title }}
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    title: { type: String, default: "# no title set #" },
    subtype: {
      validator: function (value) {
        return (
          [
            "info",
            "success",
            "warning",
            "danger",
            "primary",
            "secondary",
            "light",
            "dark",
          ].indexOf(value) !== -1
        );
      },
      default: "secondary",
    },
  },
};
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}

.card .card-header {
  font-weight: bold;
}

.bg-primary,
.bg-secondary,
.bg-danger,
.bg-success {
  color: white;
}

.bg-warning,
.bg-info {
  color: #212529;
}

.card-header.bg-secondary .btn-outline-info:not(.active):not(:hover),
.card-header.bg-success .btn-outline-info:not(.active):not(:hover),
.card-header.bg-primary .btn-outline-info:not(.active):not(:hover) {
  background-color: white;
}

.card-header.bg-success .btn-outline-info.focus {
  box-shadow: 0 0 0 0.2rem white;
}

.card-header.bg-success .btn-outline-info.active,
.card-header.bg-success .btn-outline-info:hover {
  border-color: white;
}
</style>
