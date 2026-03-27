<template>
  <openwb-base-card
    v-if="!isConnected"
    title="OpenWB Shop"
  >
    <openwb-base-card
      subtype="white"
      body-bg="white"
      class="py-3 px-3"
    >
      <div class="font-weight-bold mb-2">Noch kein Mieterstrom-Kunde?</div>
      <div class="mb-3">
        Mit openWB können<strong>Vermieter den Stromverbrauch ihrer Mieter</strong> erfassen und direkt abrechnen,
        <strong>egal ob mit oder ohne PV-Anlage.</strong> Auch gespeicherter Strom (z.B. aus einem Batteriespeicher)
        kann berücksichtigt werden.
      </div>
      <div class="mb-3">
        <div class="font-weight-bold">Vorteile:</div>
        <ul class="mb-2 pl-3">
          <li>Günstiger Strom durch Wegfall von Netzentgelten</li>
          <li>Abrechnung pro Wohneinheit</li>
          <li>Klare Zuordnung von PV-/Netz-/Speicherstrom</li>
          <li>RFID Ladefreigabe</li>
          <li>Monatliche oder jährliche Abrechnung</li>
        </ul>
      </div>
      <div class="mb-3">
        <div class="font-weight-bold">Kosten:</div>
        <div class="row align-items-center">
          <div class="col"><strong>5,00 € im Monat</strong> je Abrechnungsstelle</div>
          <div class="col-auto">
            <openwb-base-click-button
              class="btn btn-outline-secondary"
              href="https://wb-solution.de/produkt/mieterstromabrechnung/"
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
  name: "TenantBillingShop",
  props: {
    isConnected: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
