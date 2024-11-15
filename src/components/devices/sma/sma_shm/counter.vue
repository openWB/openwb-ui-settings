<template>
  <div class="device-smahm-counter">
    <openwb-base-heading> Einstellungen für SMA-HM/EM Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Seriennummer"
      :model-value="component.configuration.serials"
      @update:model-value="updateConfiguration($event, 'configuration.serials')"
    >
      <template #help>
        Eine Seriennummer ist nur erforderlich, wenn mehrere SMA HomeManager in Betrieb sind.<br />
        Funktioniert auch mit Energy Meter anstatt Home Manager.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSmahmCounter",
  mixins: [ComponentConfigMixin],
};
</script>
