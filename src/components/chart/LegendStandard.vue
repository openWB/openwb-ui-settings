<template>
  <div class="custom-legend d-flex flex-wrap justify-content-center">
    <div
      v-for="item in items"
      :key="item.label"
      class="legend-item d-flex align-items-center m-1"
      :class="{ 'legend-item-hidden': item.hidden }"
      role="button"
      @click="$emit('toggle', item.label)"
    >
      <svg
        width="20"
        height="6"
        class="mr-1"
      >
        <line
          x1="0"
          y1="3"
          x2="20"
          y2="3"
          :stroke="item.borderColor"
          stroke-width="3"
          :stroke-dasharray="item.borderDash && item.borderDash.length ? item.borderDash.join(',') : ''"
        />
      </svg>
      <span
        class="legend-label"
        :class="{ 'text-line-through': item.hidden }"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LegendStandard",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["toggle"],
};
</script>

<style scoped>
.custom-legend {
  cursor: pointer;
  font-size: 0.875rem;
}
.legend-item {
  padding: 2px 6px;
  border-radius: 4px;
  transition: opacity 0.2s;
}
.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.legend-item-hidden {
  opacity: 0.5;
}
.legend-label {
  white-space: nowrap;
}
.text-line-through {
  text-decoration: line-through;
}
</style>
