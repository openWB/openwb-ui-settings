<template>
  <openwb-base-card
    title="Selbsttest"
    :subtype="statusLevel[overallState]"
  >
    <p>
      Vor dem Versenden eines Systemberichtes wird die Konfiguration auf häufige Fehler geprüft. Bitte behebe gefundene
      Probleme nach Möglichkeit, bevor Du den Systembericht versendest. Das Versenden ist trotzdem jederzeit möglich.
    </p>
    <ul class="list-unstyled mb-0">
      <li
        v-for="check in checks"
        :key="check.key"
        class="mb-2"
      >
        <font-awesome-icon
          :icon="stateIcons[check.state]"
          :class="'text-' + statusLevel[check.state]"
          fixed-width
        />
        {{ check.text }}
        <router-link
          v-if="check.state > 0 && check.link"
          :to="check.link"
        >
          {{ check.linkText }}
        </router-link>
        <ul
          v-if="check.items?.length > 0"
          class="list-unstyled ml-4 mt-1"
        >
          <li
            v-for="item in check.items"
            :key="item.key"
          >
            <font-awesome-icon
              :icon="stateIcons[item.state]"
              :class="'text-' + statusLevel[item.state]"
              fixed-width
            />
            {{ item.text }}
            <router-link
              v-if="item.link"
              :to="item.link"
            >
              (Einstellungen)
            </router-link>
            <div
              v-if="item.message"
              class="ml-4 small text-pre-wrap"
            >
              {{ item.message }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle);

import ComponentState from "../mixins/ComponentState.vue";

export default {
  name: "SupportSelfTestCard",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/counter/get/hierarchy", writeable: false },
        { topic: "openWB/chargepoint/+/config", writeable: false },
        { topic: "openWB/system/device/+/config", writeable: false },
        { topic: "openWB/system/device/+/component/+/config", writeable: false },
        { topic: "openWB/vehicle/+/name", writeable: false },
        { topic: "openWB/consumer/+/module", writeable: false },
        { topic: "openWB/system/io/+/config", writeable: false },
        { topic: "openWB/chargepoint/+/get/fault_state", writeable: false },
        { topic: "openWB/chargepoint/+/get/fault_str", writeable: false },
        { topic: "openWB/counter/+/get/fault_state", writeable: false },
        { topic: "openWB/counter/+/get/fault_str", writeable: false },
        { topic: "openWB/pv/+/get/fault_state", writeable: false },
        { topic: "openWB/pv/+/get/fault_str", writeable: false },
        { topic: "openWB/bat/+/get/fault_state", writeable: false },
        { topic: "openWB/bat/+/get/fault_str", writeable: false },
        { topic: "openWB/vehicle/+/get/fault_state", writeable: false },
        { topic: "openWB/vehicle/+/get/fault_str", writeable: false },
        { topic: "openWB/consumer/+/get/fault_state", writeable: false },
        { topic: "openWB/consumer/+/get/fault_str", writeable: false },
        { topic: "openWB/io/states/+/get/fault_state", writeable: false },
        { topic: "openWB/io/states/+/get/fault_str", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/get/fault_state", writeable: false },
        { topic: "openWB/optional/ep/flexible_tariff/get/fault_str", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/get/fault_state", writeable: false },
        { topic: "openWB/optional/ep/grid_fee/get/fault_str", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_state", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_str", writeable: false },
      ],
      stateIcons: [
        ["fas", "check-circle"],
        ["fas", "exclamation-triangle"],
        ["fas", "times-circle"],
      ],
      faultSources: [
        {
          baseTopic: "openWB/chargepoint/+",
          label: "Ladepunkt",
          link: "/ChargePointInstallation",
          getName: (id) => this.$store.state.mqtt[`openWB/chargepoint/${id}/config`]?.name,
        },
        {
          baseTopic: "openWB/counter/+",
          label: "Zähler",
          link: "/HardwareInstallation",
          getName: (id) => this.getComponentName(id),
        },
        {
          baseTopic: "openWB/pv/+",
          label: "Wechselrichter",
          link: "/HardwareInstallation",
          getName: (id) => this.getComponentName(id),
        },
        {
          baseTopic: "openWB/bat/+",
          label: "Speicher",
          link: "/HardwareInstallation",
          getName: (id) => this.getComponentName(id),
        },
        {
          baseTopic: "openWB/vehicle/+",
          label: "Fahrzeug",
          link: "/VehicleConfiguration",
          getName: (id) => this.$store.state.mqtt[`openWB/vehicle/${id}/name`],
        },
        {
          baseTopic: "openWB/consumer/+",
          label: "Verbraucher",
          link: "/ConsumerConfiguration",
          getName: (id) => this.$store.state.mqtt[`openWB/consumer/${id}/module`]?.name,
        },
        {
          baseTopic: "openWB/io/states/+",
          label: "I/O-Gerät",
          link: "/IoConfiguration",
          getName: (id) => this.$store.state.mqtt[`openWB/system/io/${id}/config`]?.name,
        },
        {
          baseTopic: "openWB/optional/ep/flexible_tariff",
          label: "Strompreis-Anbieter",
          link: "/GeneralChargeConfiguration",
        },
        {
          baseTopic: "openWB/optional/ep/grid_fee",
          label: "Netzentgelte",
          link: "/GeneralChargeConfiguration",
        },
        {
          baseTopic: "openWB/optional/forecast",
          label: "Prognose",
          link: "/ForecastConfiguration",
        },
      ],
    };
  },
  computed: {
    isExtern() {
      return this.$store.state.mqtt["openWB/general/extern"] === true;
    },
    chargePointCheck() {
      const count = Object.keys(this.getWildcardTopics("openWB/chargepoint/+/config")).length;
      if (count > 0) {
        return {
          key: "chargepoint",
          state: 0,
          text: count === 1 ? "Es ist ein Ladepunkt angelegt." : `Es sind ${count} Ladepunkte angelegt.`,
        };
      }
      return {
        key: "chargepoint",
        state: 1,
        text:
          "Es ist kein Ladepunkt angelegt. Falls das gewollt ist (z.B. reine Speicher- oder Verbrauchersteuerung), " +
          "kann dieser Hinweis ignoriert werden.",
        link: "/ChargePointInstallation",
        linkText: "Ladepunkte konfigurieren",
      };
    },
    gridCounterCheck() {
      const hierarchy = this.$store.state.mqtt["openWB/counter/get/hierarchy"];
      const root = Array.isArray(hierarchy) ? hierarchy[0] : undefined;
      if (root?.type === "counter") {
        const name = this.getComponentName(root.id);
        return {
          key: "grid_counter",
          state: 0,
          text: `Der EVU-Zähler ist angelegt${name ? ` ("${name}")` : ""}.`,
        };
      }
      return {
        key: "grid_counter",
        state: 2,
        text: "Es ist kein EVU-Zähler als oberste Komponente in der Struktur des Lastmanagements eingetragen.",
        link: "/LoadManagementConfiguration",
        linkText: "Lastmanagement konfigurieren",
      };
    },
    devicesWithoutComponentCheck() {
      const devices = Object.values(this.getWildcardTopics("openWB/system/device/+/config")).filter(
        (device) =>
          device &&
          typeof device === "object" &&
          Object.keys(this.getWildcardTopics(`openWB/system/device/${device.id}/component/+/config`)).length === 0,
      );
      if (devices.length === 0) {
        return {
          key: "devices_without_component",
          state: 0,
          text: "Alle Geräte haben mindestens eine Komponente.",
        };
      }
      return {
        key: "devices_without_component",
        state: 1,
        text:
          "Folgende Geräte haben keine Komponente: " +
          devices.map((device) => `"${device.name}"`).join(", ") +
          ". Bitte eine Komponente hinzufügen oder das Gerät löschen.",
        link: "/HardwareInstallation",
        linkText: "Geräte und Komponenten konfigurieren",
      };
    },
    faultStates() {
      const faults = [];
      for (const source of this.faultSources) {
        const idPattern = source.baseTopic.replaceAll("/", "\\/").replace("+", "(\\d+)");
        const stateTopics = this.getWildcardTopics(`^${idPattern}\\/get\\/fault_state$`, true);
        for (const [topic, state] of Object.entries(stateTopics)) {
          if (!(state > 0)) {
            continue;
          }
          const id = topic.match(new RegExp(`^${idPattern}`))[1];
          const name = id !== undefined ? source.getName?.(id) : undefined;
          let text = source.label;
          if (id !== undefined) {
            text += name ? ` "${name}" (ID ${id})` : ` (ID ${id})`;
          }
          faults.push({
            key: topic,
            state: Math.min(state, 2),
            text: text + (state >= 2 ? ": Fehler" : ": Warnung"),
            message: this.$store.state.mqtt[topic.replace(/fault_state$/, "fault_str")],
            link: source.link,
          });
        }
      }
      // errors first, then warnings
      return faults.sort((a, b) => b.state - a.state);
    },
    faultStateCheck() {
      if (this.faultStates.length === 0) {
        return {
          key: "fault_states",
          state: 0,
          text: "Es liegen keine Fehler- oder Warnmeldungen vor.",
        };
      }
      return {
        key: "fault_states",
        state: Math.max(...this.faultStates.map((fault) => fault.state)),
        text: "Folgende Komponenten melden Fehler oder Warnungen:",
        items: this.faultStates,
      };
    },
    checks() {
      if (this.isExtern) {
        // secondary openWB: no counters or devices are configured here
        return [this.chargePointCheck, this.faultStateCheck];
      }
      return [this.chargePointCheck, this.gridCounterCheck, this.devicesWithoutComponentCheck, this.faultStateCheck];
    },
    overallState() {
      return Math.max(...this.checks.map((check) => check.state));
    },
  },
  methods: {
    getComponentName(id) {
      return Object.values(this.getWildcardTopics(`openWB/system/device/+/component/${id}/config`))[0]?.name;
    },
  },
};
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
