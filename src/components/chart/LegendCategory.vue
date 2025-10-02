<template>
  <div class="dropdown m-1">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      data-toggle="dropdown"
      aria-expanded="false"
    >
      {{ label }}
    </button>
    <ul class="dropdown-menu">
      <li
        v-for="item in items"
        :key="item.label"
        class="dropdown-item"
        :class="{ 'legend-item-hidden': item.hidden }"
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
        <span :class="{ 'text-line-through': item.hidden }">
          {{ item.label }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LegendCategory",
  props: {
    label: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["toggle"],
  mounted() {
    // Initialise bootstrap Dropdown after Render
    if (window.$) {
      window.$(this.$el).find(".dropdown-toggle").dropdown();
    }
  },
};
</script>

<style scoped>
.text-line-through {
  text-decoration: line-through;
}
.legend-item-hidden {
  opacity: 0.5;
}
</style>
