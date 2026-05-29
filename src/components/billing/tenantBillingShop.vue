<template>
  <openwb-base-card title="OpenWB Shop">
    <div class="font-weight-bold mb-2">Noch kein Mieterstrom-Kunde?</div>
    <div class="mb-3">
      Mit openWB können<strong>Vermieter den Stromverbrauch ihrer Mieter</strong> erfassen und direkt abrechnen,
      <strong>egal ob mit oder ohne PV-Anlage.</strong> Auch gespeicherter Strom (z.B. aus einem Batteriespeicher) kann
      berücksichtigt werden.
    </div>
    <div class="font-weight-bold">Vorteile:</div>
    <ul class="mb-2 pl-3">
      <li>Günstiger Strom durch Wegfall von Netzentgelten</li>
      <li>Abrechnung pro Wohneinheit</li>
      <li>Klare Zuordnung von PV-/Netz-/Speicherstrom</li>
      <li>RFID Ladefreigabe</li>
      <li>Monatliche oder jährliche Abrechnung</li>
    </ul>
    <div class="d-flex justify-content-end">
      <openwb-base-click-button
        class="btn btn-outline-secondary order-button"
        href="https://wb-solution.de/produkt/mieterstromabrechnung/"
      >
        JETZT BESTELLEN >
      </openwb-base-click-button>
    </div>
  </openwb-base-card>
</template>
<script>
export default {
  name: "TenantBillingShop",
};
</script>
<style scoped>
.order-button {
  width: auto;
}
</style>
