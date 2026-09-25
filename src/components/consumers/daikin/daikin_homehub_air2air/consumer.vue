<template>
  <div class="consumer-daikin-homehub-air2air">
    <openwb-base-heading> Einstellungen für Daikin Air2Air (HomeHub EKRHH) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Für die HomeHub-Anbindung (EKRHH-Adapter) von Daikin Air2Air-Klimaanlagen. Es steht keine Leistungsmessung zur
      Verfügung - wer den Verbrauch erfassen will, braucht eine separate Leistungsmessung (zB
      Zwischenzähler/Smart-Plug), die diesem Verbraucher zugeordnet wird.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :min="1"
      :max="255"
      :model-value="consumer.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerDaikinHomehubAir2air",
  mixins: [ConsumerConfigMixin],
};
</script>
