<template>
  <div class="status">
    <!-- all charge points -->
    <charge-point-sum-card
      v-if="numChargePointsInstalled > 1 && $store.state.mqtt['openWB/general/extern'] === false"
    />
    <!-- individual charge points -->
    <charge-point-card
      v-for="(installedChargePoint, installedChargePointKey) in installedChargePoints"
      :key="installedChargePointKey"
      :installed-charge-point="installedChargePoint"
      :installed-charge-point-key="installedChargePointKey"
    />
    <!-- counters -->
    <counter-card
      v-for="counter in counterConfigs"
      :key="counter.id"
      :counter="counter"
    />
    <!-- all inverters -->
    <inverter-sum-card v-if="numInvertersInstalled > 1 && $store.state.mqtt['openWB/general/extern'] === false" />
    <!-- individual inverters -->
    <inverter-card
      v-for="inverter in inverterConfigs"
      :key="inverter.id"
      :inverter="inverter"
    />
    <!-- all batteries -->
    <battery-sum-card v-if="numBatteriesInstalled > 1 && $store.state.mqtt['openWB/general/extern'] === false" />
    <!-- individual batteries -->
    <battery-card
      v-for="battery in batteryConfigs"
      :key="battery.id"
      :battery="battery"
    />
    <!-- vehicles -->
    <vehicle-card
      v-for="(vehicleName, vehicleKey) of vehicleNames"
      :key="vehicleKey"
      :vehicle-key="vehicleKey"
      :vehicle-name="vehicleName"
    />
    <!-- electricity tariff -->
    <electricity-tariff-card />
    <!-- ripple-control-receiver -->
    <ripple-control-receiver-card />
  </div>
</template>

<script>
import ChargePointSumCard from "../components/status/ChargePointSumCard.vue";
import ChargePointCard from "../components/status/ChargePointCard.vue";
import CounterCard from "../components/status/CounterCard.vue";
import InverterSumCard from "../components/status/InverterSumCard.vue";
import InverterCard from "../components/status/InverterCard.vue";
import BatterySumCard from "../components/status/BatterySumCard.vue";
import BatteryCard from "../components/status/BatteryCard.vue";
import RippleControlReceiverCard from "../components/status/RippleControlReceiver.vue";
import VehicleCard from "../components/status/VehicleCard.vue";
import ElectricityTariffCard from "../components/status/ElectricityTariffCard.vue";
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbStatusView",
  components: {
    ChargePointSumCard,
    ChargePointCard,
    CounterCard,
    InverterSumCard,
    InverterCard,
    BatterySumCard,
    BatteryCard,
    RippleControlReceiverCard,
    VehicleCard,
    ElectricityTariffCard,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        // charge points total
        "openWB/chargepoint/get/power",
        "openWB/chargepoint/get/imported",
        "openWB/chargepoint/get/exported",
        "openWB/chargepoint/get/daily_imported",
        "openWB/chargepoint/get/daily_exported",
        // individual charge points
        "openWB/chargepoint/+/config",
        "openWB/chargepoint/+/get/+",
        "openWB/chargepoint/+/get/connected_vehicle/info",
        "openWB/chargepoint/+/set/+",
        "openWB/internal_chargepoint/+/data/phases_to_use",
        // components
        "openWB/system/device/+/component/+/config",
        // counter
        "openWB/counter/+/get/+",
        // pv
        "openWB/pv/get/+",
        "openWB/pv/+/get/+",
        // batteries
        "openWB/bat/get/+",
        "openWB/bat/+/get/+",
        // vehicles
        "openWB/vehicle/+/name",
        "openWB/vehicle/+/get/+",
      ],
    };
  },
  computed: {
    installedChargePoints: {
      get() {
        let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
        let myObj = {};
        for (const [key, element] of Object.entries(chargePoints)) {
          if (element.type === "internal_openwb" || this.$store.state.mqtt["openWB/general/extern"] === false) {
            myObj[key] = element;
          }
        }
        return myObj;
      },
    },
    numChargePointsInstalled: {
      get() {
        return Object.keys(this.installedChargePoints).length;
      },
    },
    counterConfigs: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.filterComponentsByType(
          this.getWildcardTopics("openWB/system/device/+/component/+/config"),
          "counter",
        );
      },
    },
    numInvertersInstalled: {
      get() {
        return Object.keys(this.inverterConfigs).length;
      },
    },
    inverterConfigs: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.filterComponentsByType(
          this.getWildcardTopics("openWB/system/device/+/component/+/config"),
          "inverter",
        );
      },
    },
    numBatteriesInstalled: {
      get() {
        return Object.keys(this.batteryConfigs).length;
      },
    },
    batteryConfigs: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.filterComponentsByType(this.getWildcardTopics("openWB/system/device/+/component/+/config"), "bat");
      },
    },
    vehicleNames: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.getWildcardTopics("openWB/vehicle/+/name");
      },
    },
  },
  methods: {
    filterComponentsByType(components, type) {
      return Object.keys(components)
        .filter((key) => {
          return components[key].type.includes(type);
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: components[key],
          };
        }, {});
    },
  },
};
</script>

<style scoped>
.status {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 1em;
}

.status .card {
  align-self: start;
}

@media (max-width: 768px) {
  .status {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
}
</style>
