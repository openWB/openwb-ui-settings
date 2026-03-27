<template>
  <base-status-page
    billing-service="tenant"
    :api-url="'http://localhost:59563/openWB/web/settings/modules/billing_services/tenant_energy/tenantEnergy.php'"
    :portal-links="[
      { label: 'Mieterstrom Portal öffnen', url: 'https://wb-solution.de/produkt/mieterstromabrechnung/' },
      { label: 'Abrechnung Download Portal', url: 'https://openwb.de/main/mieterstromabrechnung-mit-openwb/' },
    ]"
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
