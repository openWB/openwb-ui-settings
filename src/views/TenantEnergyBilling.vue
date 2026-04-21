<template>
  <base-status-page
    billing-service="tenant"
    :api-url="'https://mieterstrom-management.wb-solution.de/api/v1/mieterstrom-main'"
    :table-columns="[
      { label: 'Verbraucher', field: 'device' },
      { label: 'Zugeordnet zu', field: 'assigned_to', align: 'right' },
    ]"
  />
</template>

<script>
import BaseStatusPage from "../components/billing/BaseStatusPage.vue";
export default {
  components: {
    BaseStatusPage,
  },
};
</script>
