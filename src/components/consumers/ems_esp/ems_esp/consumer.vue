<template>
  <div class="consumer-ems-esp">
    <openwb-base-heading> Einstellungen für EMS-ESP </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Für EMS-Bus-Wärmepumpen (zB Buderus, Bosch, Junkers) über einen EMS-ESP32-Gateway. Der Zugriff erfolgt über die
      REST-API des Gateways (Bearer-Token, in der EMS-ESP-Weboberfläche unter "Security" einsehbar). Ob SG-Ready-Boost
      und PV-Überschusskompensation (pvmaxcomp) tatsächlich wirken, ist modellabhängig - laut EMS-ESP32-Community
      funktioniert es zB auf einer Buderus WLW186i-12E, nicht jedoch auf einer Bosch Compress CS7000iAW.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Token"
      subtype="text"
      required
      :model-value="consumer.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    >
      <template #help> API-Token aus der EMS-ESP-Weboberfläche (Settings &gt; Security &gt; Generate Token). </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerEmsEsp",
  mixins: [ConsumerConfigMixin],
};
</script>
