<template>
  <div class="status">
    <!-- all charge points -->
    <charge-point-sum-card
      v-if="numChargePointsInstalled > 1 && $store.state.mqtt['openWB/general/extern'] === false"
    />
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
      v-for="(vehicleName, vehicleId) of vehicleNames"
      :key="vehicleId"
      :vehicle-id="parseInt(vehicleId)"
      :vehicle-name="vehicleName"
    />
    <!-- io devices -->
    <io-device-card
      v-for="ioDevice in ioDeviceConfigs"
      :key="ioDevice.id"
      :io-device="ioDevice"
    />
    <!-- electricity tariff -->
    <electricity-pricing-card v-if="$store.state.mqtt['openWB/general/extern'] === false" />
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
        "openWB/counter/get/hierarchy",
        // components
        "openWB/system/device/+/component/+/config",
        // io devices
        "openWB/system/io/+/config",
        // vehicles
        "openWB/vehicle/+/name",
      ],
    };
  },
  computed: {
    /**
     * Get all object ids of a specific type from the hierarchy
     * @param type type of object to get the ids from
     * @returns number[]
     */
    getObjectIds: {
      get() {
        return (type) => {
          function getId(hierarchy) {
            let result = [];
            if (hierarchy !== undefined) {
              hierarchy.forEach((element) => {
                if (element.type == type) {
                  result.push(element.id);
                }
                result = [...result, ...getId(element.children)];
              });
            }
            return result;
          }
          return getId(this.$store.state.mqtt["openWB/counter/get/hierarchy"]);
        };
      },
    },
    installedChargePoints: {
      get() {
        return this.getObjectIds("cp");
        // let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
        // let myObj = {};
        // for (const [key, element] of Object.entries(chargePoints)) {
        //   if (element.type === "internal_openwb" || this.$store.state.mqtt["openWB/general/extern"] === false) {
        //     myObj[key] = element;
        //   }
        // }
        // return myObj;
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
    ioDeviceConfigs: {
      get() {
        return this.getWildcardTopics("openWB/system/io/+/config");
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
        const vehicleNameTopics = this.getWildcardTopics("openWB/vehicle/+/name");
        // modify keys to get vehicleId only from the topic
        for (const key of Object.keys(vehicleNameTopics)) {
          const vehicleIdx = key.match(/(?:\/)(\d+)(?=\/)/)[1];
          vehicleNameTopics[vehicleIdx] = vehicleNameTopics[key];
          delete vehicleNameTopics[key];
        }
        return vehicleNameTopics;
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
