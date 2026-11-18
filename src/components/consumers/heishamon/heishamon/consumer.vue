<template>
  <div class="consumer-heishamon">
    <openwb-base-heading> Einstellungen für Panasonic Wärmepumpe über HeishaMon </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die Messwerte werden lokal über die HTTP-Schnittstelle von HeishaMon ausgelesen. Die Wärmepumpe wird nicht
      gesteuert. Als elektrische Leistung wird ausschließlich <code>Heat_Power_Consumption</code> verwendet, keine
      thermische Leistung und keine Summe aus Heiz-, Kühl- und Warmwasserbetrieb. Geräte mit ausschließlich erweiterten
      Leistungswerten (<code>Heat_Power_Consumption_Extra</code>) werden nicht unterstützt.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    >
      <template #help>
        IP-Adresse oder Hostname von HeishaMon, ohne http:// und ohne /json. Die Abfrage von /json erfolgt automatisch.
      </template>
    </openwb-base-text-input>
    <openwb-base-checkbox-input
      title="Temperaturen auslesen"
      :model-value="consumer.configuration.read_temperatures"
      @update:model-value="updateConfiguration($event, 'configuration.read_temperatures')"
    >
      <template #help>
        Optional werden drei Temperaturen in dieser Reihenfolge erfasst: 1. Rücklauf (Main_Inlet_Temp), 2. Vorlauf
        (Main_Outlet_Temp), 3. Solltemperatur (Main_Target_Temp). Fehlende oder ungültige Temperaturen verhindern die
        Leistungsmessung nicht.
      </template>
    </openwb-base-checkbox-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerHeishaMon",
  mixins: [ConsumerConfigMixin],
};
</script>
