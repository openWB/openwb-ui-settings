<template>
  <div class="charge-point-openwb-satellite">
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="chargePoint.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Ladepunkt-Nummer"
      required
      :min="1"
      :max="2"
      :model-value="chargePoint.configuration.duo_num + 1"
      @update:model-value="updateConfiguration($event - 1, 'configuration.duo_num')"
    >
      <template #help>
        Bei einfachen Ladepunkten ist hier immer eine "1" einzutragen. Lediglich bei einer openWB Duo kann mit "2" der
        zweite enthaltene Ladepunkt angesprochen werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointSatellite",
  mixins: [ChargePointConfigMixin],
};
</script>
