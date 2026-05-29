<template>
  <openwb-base-card title="OpenWB Shop">
    <div class="font-weight-bold mb-2">Noch kein Dienstwagenabrechnungs-Kunde?</div>
    <div class="mb-3">
      openWB ermöglicht die Abrechnung von zu Hause geladenem Strom für
      <strong>Dienstwagen, mit oder ohne Abrechnungsdienstleister.</strong>
      Voraussetzung: openWB mit software2.
    </div>
    <div class="font-weight-bold">Mögliche Modelle:</div>
    <ul class="mb-2 pl-3">
      <li>Manuelle Übermittlung (bei eigener oder geteilter Nutzung)</li>
      <li>Automatischer Datenexport durch Ladelog (z.B. per RFID oder Fahrzeug-Zuordnung)</li>
      <li>Anbindung an OCPP-Abrechnungsdienstleister</li>
      <li>Komplettabrechnung durch openWB</li>
    </ul>
    <div class="d-flex justify-content-end">
      <openwb-base-click-button
        class="btn btn-outline-secondary order-button"
        href="https://wb-solution.de/produkt/dienstwagenabrechnung/"
      >
        JETZT BESTELLEN >
      </openwb-base-click-button>
    </div>
  </openwb-base-card>
</template>
<script>
export default {
  name: "VehicleBillingShop",
};
</script>
<style scoped>
.order-button {
  width: auto;
}
</style>
