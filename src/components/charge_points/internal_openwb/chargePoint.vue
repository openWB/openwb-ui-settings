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
      ]"
      :model-value="chargePoint.configuration.mode"
      @update:model-value="updateMode($event)"
    />
    <openwb-base-number-input
      v-if="chargePoint.configuration.mode == 'duo'"
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
  name: "ChargePointInternalOpenwb",
  mixins: [ChargePointConfigMixin],
  methods: {
    updateMode(event) {
      // set "duo_num" to "1" for modes only supporting one charge point
      if (event == "series" || event == "socket") {
        this.updateConfiguration(0, "configuration.duo_num");
      }
      this.updateConfiguration(event, "configuration.mode");
    },
  },
};
</script>
