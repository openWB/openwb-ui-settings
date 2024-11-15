<template>
  <div class="device-virtual-counter">
    <openwb-base-heading> Einstellungen für virtuelle Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Zusätzlicher Verbrauch"
      :min="0"
      :step="0.05"
      unit="kW"
      required
      :model-value="component.configuration.external_consumption / 1000"
      @update:model-value="updateConfiguration($event * 1000, 'configuration.external_consumption')"
    >
      <template #help>
        Die hier angegebene Leistung wird pauschal zu dem Leistungen der hinter dem Zähler liegenden Komponenten
        addiert. Damit lässt sich z. B. eine Reserve für nicht erfasste Verbraucher einstellen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceVirtualCounter",
  mixins: [ComponentConfigMixin],
};
</script>
