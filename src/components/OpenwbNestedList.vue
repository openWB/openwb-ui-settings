<template>
  <draggable
    v-model="list"
    class="dragArea w-100 mb-0"
    tag="ul"
    :group="dragGroup"
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
              :icon="['fas', nesting ? 'arrows-alt' : 'arrows-up-down']"
            />
            <font-awesome-icon
              v-if="getElementIcon(element)"
              :icon="getElementIcon(element)"
            />
            {{ getElementLabel(element.id) }}
          </span>
          <span
            v-if="element.type === 'group'"
            class="element-actions"
          >
            <font-awesome-icon
              :icon="['fas', 'trash']"
              @click.stop="$emit('delete-group', element.id)"
            />
          </span>
          <!-- <span class="element-actions">
            <font-awesome-icon

              :icon="['fas', 'edit']"
              @click="elementEdit(element.id)"
            />
          </span> -->
        </div>
        <openwb-nested-list
          v-if="nesting && element.children && currentNestingDepth < maxNestingDepth"
          v-model="element.children"
          :labels="labels"
          :nesting="nesting"
          :max-nesting-depth="maxNestingDepth"
          :current-nesting-depth="currentNestingDepth + 1"
          @delete-group="$emit('delete-group', $event)"
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
  faArrowsUpDown as fasArrowsUpDown,
  faChargingStation as fasChargingStation,
  faCarBattery as fasCarBattery,
  faSolarPanel as fasSolarPanel,
  faGaugeHigh as fasGaugeHigh,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasArrowsAlt, fasArrowsUpDown, fasChargingStation, fasCarBattery, fasSolarPanel, fasGaugeHigh, fasTrash);
export default {
  name: "OpenwbNestedList",
  components: {
    draggable,
    FontAwesomeIcon,
  },
  props: {
    modelValue: { type: Array, required: false, default: () => [] },
    labels: { type: Object, required: false, default: undefined },
    nesting: { type: Boolean, default: true },
    maxNestingDepth: { type: Number, default: Infinity },
    currentNestingDepth: { type: Number, default: 0 },
  },
  emits: ["update:modelValue", "delete-group"],
  computed: {
    list: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    dragGroup() {
      if (this.currentNestingDepth === 0) {
        return {
          name: "g1",
          pull: true,
          put: true,
        };
      }
      return {
        name: "g1",
        pull: true,
        put: (to, from, dragEl) => {
          const draggedItem = dragEl?.__draggable_context?.element;
          if (!draggedItem) return true;
          return draggedItem.type !== "group";
        },
      };
    },
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
