<template>
  <base-status-page
    billing-service="vehicle"
    :table-columns="tableColumns"
  />
</template>

<script>
import BaseStatusPage from "../components/billing/BaseStatusPage.vue";
export default {
  components: {
    BaseStatusPage,
  },
  data() {
    return {
      apiUrl: "",
      username: "",
      password: "",
      name: "",
      contractStatus: "",
      lastSync: "",
      rawAssignments: [],
      contractDetails: {},
      errorMessage: "",
      // connection states: idle, loading, success, error
      connectionState: "idle",
      wasConnected: false,
      tableColumns: [
        { label: "Ladepunkt", field: "chargePoint" },
        { label: "Fahrzeug", field: "vehicle", align: "center" },
        { label: "Mitarbeiter", field: "employee", align: "right" },
      ],
    };
  },
};
</script>
