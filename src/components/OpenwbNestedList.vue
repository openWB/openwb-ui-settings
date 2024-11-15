<template>
  <draggable
    class="dragArea w-100 mb-0"
    tag="ul"
    :list="list"
    :group="{ name: 'g1' }"
    item-key="id"
    handle=".handle"
  >
    <template #item="{ element }">
      <li>
        <div
          class="element-titel"
          :class="classes(element)"
        >
          <span>
            <font-awesome-icon
              class="handle"
              fixed-width
              :icon="['fas', 'arrows-alt']"
            />
            <font-awesome-icon
              v-if="getElementIcon(element)"
              fixed-width
              :icon="getElementIcon(element)"
            />
            {{ getElementLabel(element.id) }}
          </span>
          <!-- <span class="element-actions">
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'edit']"
              @click="elementEdit(element.id)"
            />
          </span> -->
        </div>
        <openwb-nested-list
          v-model="element.children"
          :labels="labels"
        />
      </li>
    </template>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowsAlt as fasArrowsAlt,
  faChargingStation as fasChargingStation,
  faCarBattery as fasCarBattery,
  faSolarPanel as fasSolarPanel,
  faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasArrowsAlt, fasChargingStation, fasCarBattery, fasSolarPanel, fasGaugeHigh);

export default {
  name: "OpenwbNestedList",
  components: {
    draggable,
    FontAwesomeIcon,
  },
  props: {
    list: { type: Object, required: false, default: undefined },
    labels: { type: Object, required: false, default: undefined },
  },
  methods: {
    classes(element) {
      var myClasses = "";
      switch (element.type) {
        case "bat":
          myClasses += "battery";
          break;
        case "cp":
          myClasses += "charge-point";
          break;
        default:
          myClasses += element.type;
          break;
      }
      return myClasses;
    },
    getElementLabel(elementId) {
      if (this.labels && elementId in this.labels) {
        return this.labels[elementId];
      }
      return elementId;
    },
    getElementIcon(element) {
      switch (element.type) {
        case "bat":
          return ["fas", "car-battery"];
        case "counter":
          return ["fas", "gauge-high"];
        case "cp":
          return ["fas", "charging-station"];
        case "inverter":
          return ["fas", "solar-panel"];
        default:
          return undefined;
      }
    },
    // elementEdit(id) {
    //   console.log("edit Element:", id);
    // },
  },
};
</script>

<style scoped>
.dragArea {
  min-height: 40px;
  color: #e9ecef;
  list-style-type: none;
  border: 1px solid var(--secondary);
  border-radius: 3px;
  padding: 0px;
}

.dragArea ul {
  background-color: var(--light);
}

.dragArea li {
  position: relative;
  top: 0px;
  left: 0px;
  padding-left: 40px;
  margin: 5px;
  border: 1px solid var(--dark);
  border-radius: 3px;
  background-color: var(--dark);
}

.handle {
  float: left;
  background-position: center center;
  background-repeat: no-repeat;
  margin-left: -35px;
  margin-right: 5px;
  font-size: 1.1em;
  color: var(--light);
  cursor: pointer;
}

.element-titel {
  display: flex;
  justify-content: space-between;
  padding: 7px;
  background: var(--info);
}

.element-titel.counter {
  background-color: var(--danger);
}

.element-titel.charge-point {
  background-color: var(--primary);
}

.element-titel.inverter {
  background-color: var(--success);
}

.element-titel.battery {
  background-color: var(--warning);
  color: var(--dark);
}

.element-actions {
  cursor: pointer;
}
</style>
