<template>
  <openwb-base-card
    v-if="
      $store.state.mqtt['openWB/general/ripple_control_receiver/module'] &&
      $store.state.mqtt['openWB/general/ripple_control_receiver/module'].type
    "
    subtype="secondary"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon :icon="['fas', 'tower-broadcast']" />
      Steuerbare Verbrauchseinrichtung (RSE)
    </template>
    <openwb-base-alert
      :subtype="statusLevel[$store.state.mqtt['openWB/general/ripple_control_receiver/get/fault_state']]"
    >
      <font-awesome-icon
        v-if="$store.state.mqtt['openWB/general/ripple_control_receiver/get/fault_state'] == 1"
        fixed-width
        :icon="['fas', 'exclamation-triangle']"
      />
      <font-awesome-icon
        v-else-if="$store.state.mqtt['openWB/general/ripple_control_receiver/get/fault_state'] == 2"
        fixed-width
        :icon="['fas', 'times-circle']"
      />
      <font-awesome-icon
        v-else
        fixed-width
        :icon="['fas', 'check-circle']"
      />
      Modulmeldung:<br />
      <span style="white-space: pre-wrap">{{
        $store.state.mqtt["openWB/general/ripple_control_receiver/get/fault_str"]
      }}</span>
    </openwb-base-alert>
    <openwb-base-text-input
      title="Status"
      readonly
      :model-value="
        $store.state.mqtt['openWB/general/ripple_control_receiver/get/override_value'] == 0
          ? 'Laden gesperrt'
          : 'Laden erlaubt (' + $store.state.mqtt['openWB/general/ripple_control_receiver/get/override_value'] + '%)'
      "
    />
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faTowerBroadcast as fasTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasTowerBroadcast);

export default {
  name: "RippleControlReceiverCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/ripple_control_receiver/get/fault_state",
        "openWB/general/ripple_control_receiver/get/fault_str",
        "openWB/general/ripple_control_receiver/get/override_value",
        "openWB/general/ripple_control_receiver/module",
      ],
      statusLevel: ["success", "warning", "danger"],
    };
  },
};
</script>
