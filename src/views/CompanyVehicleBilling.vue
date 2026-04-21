<template>
  <base-status-page
    billing-service="vehicle"
    :api-url="'http://localhost:59563/openWB/web/settings/modules/billing_services/company_vehicle/companyVehicle.php'"
    :table-columns="[
      { label: 'Ladepunkt', field: 'chargePoint' },
      { label: 'Fahrzeug', field: 'vehicle', align: 'center' },
      { label: 'Mitarbeiter', field: 'employee', align: 'right' },
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
