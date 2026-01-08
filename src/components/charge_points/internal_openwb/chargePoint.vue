<template>
  <div class="charge-point-internal-openwb">
    <openwb-base-select-input
      title="Bauart"
      not-selected="Bitte auswählen"
      required
      :options="[
        {
          value: 'series',
          text: 'openWB series1/2 in den Varianten custom, standard & standard+',
        },
        { value: 'duo', text: 'openWB series1/2 Duo' },
        { value: 'socket', text: 'openWB series1/2 Buchse' },
        { value: 'pro_plus', text: 'openWB Pro+' },
        { value: 'se', text: 'openWB SE (11kW)' },
      ]"
      :model-value="chargePoint.configuration.mode"
      @update:model-value="updateMode($event)"
    />
    <openwb-base-number-input
      v-if="chargePoint.configuration.mode == 'duo' || chargePoint.configuration.mode == 'se'"
      title="Ladepunkt-Nummer"
      required
      :min="1"
      :max="2"
      :model-value="chargePoint.configuration.duo_num + 1"
      @update:model-value="updateConfiguration($event - 1, 'configuration.duo_num')"
    >
      <template #help>
        Bei einer openWB Duo oder openWB SE Duo können mit "1" oder "2" die beiden enthaltenen Ladepunkte angesprochen
        werden. Bei einer openWB SE mit einem Ladepunkt ist hier eine 1 einzutragen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointInternalOpenwb",
  mixins: [ChargePointConfigMixin],
  methods: {
    updateMode(event) {
      // reset "duo_num" for modes only supporting one charge point
      if (["series", "socket", "pro_plus"].includes(event)) {
        this.updateConfiguration(0, "configuration.duo_num");
      }
      this.updateConfiguration(event, "configuration.mode");
    },
  },
};
</script>
