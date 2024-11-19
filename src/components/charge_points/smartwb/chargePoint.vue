<template>
  <div class="charge-point-smartwb">
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="chargePoint.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Wartezeit"
      required
      :min="2"
      :max="10"
      unit="s"
      :model-value="chargePoint.configuration.timeout"
      @update:model-value="updateConfiguration($event, 'configuration.timeout')"
    >
      <template #help>
        Zeitangabe in Sekunden, für die auf eine Antwort des Ladepunktes gewartet wird. Wird diese Zeit überschritten,
        so wird von einer Kommunikationsstörung ausgegangen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointSmartwb",
  mixins: [ChargePointConfigMixin],
};
</script>
