<template>
  <div class="status">
    <!-- all charge points -->
    <charge-point-sum-card v-if="showChargePointSumCard" />
    <!-- individual charge points -->
    <charge-point-card
      v-for="installedChargePointId in installedChargePoints"
      :key="installedChargePointId"
      :charge-point-id="installedChargePointId"
    />
    <!-- counters -->
    <counter-card
      v-for="counter in counterConfigs"
      :key="counter.id"
      :counter="counter"
    />
    <!-- all inverters -->
    <inverter-sum-card v-if="showInverterSumCard" />
    <!-- individual inverters -->
    <inverter-card
      v-for="inverter in inverterConfigs"
      :key="inverter.id"
      :inverter="inverter"
    />
    <!-- all batteries -->
    <battery-sum-card v-if="showBatterySumCard" />
    <!-- individual batteries -->
    <battery-card
      v-for="battery in batteryConfigs"
      :key="battery.id"
      :battery="battery"
    />
    <!-- vehicles -->
    <vehicle-card
      v-for="vehicleId of vehicles"
      :key="vehicleId"
      :vehicle-id="vehicleId"
    />
    <!-- io devices -->
    <io-device-card
      v-for="ioDevice in ioDeviceConfigs"
      :key="ioDevice.id"
      :io-device="ioDevice"
    />
    <!-- electricity tariff -->
    <electricity-pricing-card v-if="showElectricityPricingCard" />
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
import IoDeviceCard from "../components/status/IoDeviceCard.vue";
import VehicleCard from "../components/status/VehicleCard.vue";
import ElectricityPricingCard from "../components/status/ElectricityPricingCard.vue";
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
    IoDeviceCard,
    VehicleCard,
    ElectricityPricingCard,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        // charge point sum
        "openWB/chargepoint/get/power",
        // individual charge points
        "openWB/chargepoint/+/config",
        // components
        "openWB/system/device/+/component/+/config",
        // battery sum
        "openWB/bat/get/power",
        // inverter sum
        "openWB/pv/get/power",
        // io devices
        "openWB/system/io/+/config",
        // vehicles
        "openWB/vehicle/+/info",
        // electricity pricing
        "openWB/optional/ep/flexible_tariff/provider",
        "openWB/optional/ep/grid_fee/provider",
      ],
    };
  },
  computed: {
    installedChargePoints: {
      get() {
        return Object.keys(this.getWildcardTopics("openWB/chargepoint/+/config"))
          .map((topic) => {
            let match = topic.match(/^openWB\/chargepoint\/(\d+)\/config$/);
            return match ? parseInt(match[1]) : null;
          })
          .filter((id) => id !== null);
      },
    },
    showChargePointSumCard: {
      get() {
        return (
          (this.$store.state.mqtt["openWB/chargepoint/get/power"] !== undefined ? true : false) &&
          this.$store.state.mqtt["openWB/general/extern"] === false &&
          this.installedChargePoints.length > 1
        );
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
    showInverterSumCard: {
      get() {
        return (
          this.$store.state.mqtt["openWB/pv/get/power"] !== undefined &&
          this.$store.state.mqtt["openWB/general/extern"] === false &&
          Object.keys(this.inverterConfigs).length > 1
        );
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
    showBatterySumCard: {
      get() {
        return (
          this.$store.state.mqtt["openWB/bat/get/power"] !== undefined &&
          this.$store.state.mqtt["openWB/general/extern"] === false &&
          Object.keys(this.batteryConfigs).length > 1
        );
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
    vehicles: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        let vehicleInfoTopics = this.getWildcardTopics("openWB/vehicle/+/info");
        // return an array of vehicle ids
        return Object.keys(vehicleInfoTopics).map((topic) => {
          let match = topic.match(/^openWB\/vehicle\/(\d+)\/info$/);
          return match ? parseInt(match[1]) : null;
        });
      },
    },
    ioDeviceConfigs: {
      get() {
        return this.getWildcardTopics("openWB/system/io/+/config");
      },
    },
    showElectricityPricingCard: {
      get() {
        return (
          (this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"]?.type ||
            this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"]?.type) &&
          this.$store.state.mqtt["openWB/general/extern"] === false
        );
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

@media (max-width: 991px) {
  .status {
    grid-template-columns: repeat(1, 1fr);
  }
}

.status .card {
  align-self: start;
}
</style>
