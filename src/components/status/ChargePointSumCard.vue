<template>
  <openwb-base-card
    subtype="primary"
    :collapsible="true"
    :collapsed="true"
  >
    <template #header>
      <font-awesome-icon
        fixed-width
        :icon="['fas', 'charging-station']"
      />
      Alle Ladepunkte
    </template>
    <template #actions>
      {{ formatNumberTopic("openWB/chargepoint/get/power", 3, 3, 0.001) + " kW" }}
    </template>
    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Ladevorgang</th>
            <td class="text-right">Leistung</td>
          </tr>
          <tr>
            <td />
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/get/power", 3, 3, 0.001) + " kW" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>

    <openwb-base-alert subtype="light">
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <th>Zählerstände</th>
            <td class="text-right">Geladen</td>
            <td class="text-right">Entladen</td>
          </tr>
          <tr>
            <td class="text-right">Heute</td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/get/daily_imported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/get/daily_exported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
          <tr>
            <td class="text-right">Gesamt</td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/get/daily_imported", 3, 3, 0.001) + " kWh" }}
            </td>
            <td class="text-right text-monospace">
              {{ formatNumberTopic("openWB/chargepoint/get/daily_exported", 3, 3, 0.001) + " kWh" }}
            </td>
          </tr>
        </tbody>
      </table>
    </openwb-base-alert>
  </openwb-base-card>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faChargingStation as fasChargingStation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasChargingStation);

export default {
  name: "ChargePointSumCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
};
</script>
