<template>
  <div class="consumer-esphome">
    <openwb-base-heading>Einstellungen für ESPHome</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Name des Leistungs-Sensors"
      subtype="text"
      required
      :model-value="consumer.configuration.power_sensor_name"
      @update:model-value="updateConfiguration($event, 'configuration.power_sensor_name')"
    >
      <template #help>
        Der Name des Sensors, wie er in der ESPHome-YAML-Konfiguration vergeben wurde (web_server muss aktiviert sein).
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Name des Schalters"
      subtype="text"
      :model-value="consumer.configuration.switch_name"
      @update:model-value="updateConfiguration($event, 'configuration.switch_name')"
    >
      <template #help>
        Optional: Name des Schalters, über den der Verbraucher ein- und ausgeschaltet werden kann. Ohne Angabe werden
        nur Messwerte erfasst.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerEsphome",
  mixins: [ConsumerConfigMixin],
};
</script>
