<template>
  <div class="d-flex flex-wrap justify-content-center">
    <LegendCategory
      v-for="(items, category) in categorizedItems"
      :key="category"
      :label="categoryLabels[category]"
      :items="items"
      @toggle="$emit('toggle', $event)"
    />
  </div>
</template>

<script>
import LegendCategory from "./LegendCategory.vue";

export default {
  name: "LegendCategoriesGroup",
  components: { LegendCategory },
  props: {
    categorizedItems: {
      type: Object,
      default: () => ({
        chargepoint: [],
        vehicle: [],
        component: [],
      }),
    },
  },
  emits: ["toggle"],
  data() {
    return {
      categoryLabels: {
        component: "Komponenten",
        chargepoint: "Ladepunkte",
        vehicle: "Fahrzeuge",
      },
    };
  },
};
</script>
