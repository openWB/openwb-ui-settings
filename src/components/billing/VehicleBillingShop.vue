<template>
  <openwb-base-card title="OpenWB Shop">
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-3 px-3"
    >
      <div class="font-weight-bold mb-2">Noch kein Dienstwagenabrechnungs-Kunde?</div>
      <div class="mb-3">
        openWB ermöglicht die Abrechnung von zu Hause geladenem Strom für
        <strong>Dienstwagen, mit oder ohne Abrechnungsdienstleister.</strong>
        Voraussetzung: openWB mit software2.
      </div>
      <div class="mb-3">
        <div class="font-weight-bold">Mögliche Modelle:</div>
        <ul class="mb-2 pl-3">
          <li>Manuelle Übermittlung (bei eigener oder geteilter Nutzung)</li>
          <li>Automatischer Datenexport durch Ladelog (z.B. per RFID oder Fahrzeug-Zuordnung)</li>
          <li>Anbindung an OCPP-Abrechnungsdienstleister</li>
          <li>Komplettabrechnung durch openWB</li>
        </ul>
      </div>
      <div class="mb-3">
        <div class="font-weight-bold">Kosten:</div>
        <div class="row align-items-center">
          <div class="col"><strong>5,00 € im Monat</strong>pro Ladepunkt</div>
          <div class="col-auto">
            <openwb-base-click-button
              class="btn btn-outline-secondary"
              href="https://wb-solution.de/produkt/dienstwagenabrechnung/"
            >
              JETZT BESTELLEN >
            </openwb-base-click-button>
          </div>
        </div>
      </div>
    </openwb-base-card>
  </openwb-base-card>
</template>
<script>
export default {
  name: "VehicleBillingShop",
};
</script>
