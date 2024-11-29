<template>
  <openwb-base-card
    subtype="success"
    :collapsible="true"
    :collapsed="true"
    
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'solar-panel']"
      />
      {{ inverter.name }} {{formatNumberTopic('openWB/pv/' + inverter.id + '/get/power', 3, 3, 0.001)}} kW
    </template>
    <openwb-base-alert :subtype="statusLevel[$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state']]">
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/pv/' + inverter.id + '/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{ $store.state.mqtt["openWB/pv/" + inverter.id + "/get/fault_str"] }}</span>
    </openwb-base-alert>

    
    <openwb-base-alert :subtype="statusLevel[5]">
    <BTableSimple small borderless responsive >

    <BTbody>
      <BTr>
        <BTh rowspan="2">Aktuelle Werte</BTh>
        <BTd></BTd>
        <BTd class="text-right">Leistung</BTd>
        <BTd class="text-right">Zählerstand</BTd>
      </BTr>
      <BTr>
        
        <BTd />
        <BTd class="text-right text-monospace">{{this.formatNumberTopic(
          "openWB/pv/" + this.inverter.id + "/get/power", 3, 3, 0.001) + " kW"}}</BTd>
        <BTd class="text-right text-monospace">{{ this.formatNumberTopic('openWB/pv/' + this.inverter.id + '/get/exported', 3, 3, 0.001) + ' kWh' }}</BTd>
      </BTr>
      </BTbody>
      </BTableSimple>
    </openwb-base-alert>
    <openwb-base-alert :subtype="statusLevel[5]">
      <BTableSimple small borderless responsive >
      <BTbody>
      <BTr>
        <BTh rowspan="3">Erträge</BTh>
        <BTd class="text-right">Heute</BTd>
        <BTd class="text-right">Monat</BTd>
        <BTd class="text-right">Jahr</BTd>       
      </BTr>
      <BTr>
        <BTd class="text-right text-monospace">{{this.formatNumberTopic('openWB/pv/' + this.inverter.id + '/get/daily_exported', 3, 3, 0.001) + ' kWh'}}</BTd>
        <BTd class="text-right text-monospace">{{this.formatNumberTopic('openWB/pv/' + this.inverter.id + '/get/monthly_exported', 3, 3, 0.001) + ' kWh'}}</BTd>
        <BTd class="text-right text-monospace">{{this.formatNumberTopic('openWB/pv/' + this.inverter.id + '/get/yearly_exported', 3, 3, 0.001) + ' kWh'}}</BTd>
      </BTr>
    </BTbody>
  </BTableSimple>
  </openwb-base-alert>
  <template #footer>
    <div class="text-right"> ID: {{ inverter.id }}</div>
  </template>
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";
import { BTable, BTableLite, BTableSimple,  BTfoot, BThead, BTr, BTh, BTd, BTbody } from "bootstrap-vue-next";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faSolarPanel as fasSolarPanel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasSolarPanel);

export default {
  name: "InverterCard",
  components: {
    FontAwesomeIcon, BTableLite, BTable, BTableSimple,  BTfoot, BThead, BTr, BTh, BTd , BTbody
  },
  mixins: [ComponentState],
  props: {
    inverter: { type: Object, required: true },
  },
  data() {
    return {
        statusLevel: ["success", "warning", "danger", "primary", "secondary", "light", "dark"],
    };
  },
};
</script>
