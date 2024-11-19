<template>
  <div class="device-sungrow-counter">
    <openwb-base-heading> Einstellungen für Sungrow Zähler </openwb-base-heading>
    <openwb-base-select-input
      title="Version"
      :options="[
        { value: 0, text: 'SH (Hybrid)' },
        { value: 1, text: 'SG (kein Hybrid)' },
        { value: 2, text: 'SG (kein Hybrid) mit WiNet Dongle' },
      ]"
      :model-value="component.configuration.version"
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Die Variante SH ist nur über die LAN-IP mit openWB nutzbar. Hierzu hinter dem WiNet-S Dongle den Lan Anschluss
        nutzen. Den WiNet-S Dongle zusätzlich ins Heimnetz (per Lan oder Wlan) einbinden, um ISolarCloud nutzen zu
        können.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSungrowCounter",
  mixins: [ComponentConfigMixin],
};
</script>
