<template>
  <div class="loadManagementConfig">
    <form name="loadManagementConfigForm">
      <openwb-base-card
        title="Einstellungen"
        :collapsible="true"
        :collapsed="false"
      >
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-alert
            v-if="!installAssistantActive"
            subtype="info"
          >
            Die Konfiguration für die externe Steuerung durch den Netzbetreiber (RSE, EMS, §14a) erfolgt in den
            <router-link to="/IoConfiguration">Einstellungen der Ein-/Ausgänge</router-link> im Bereich der Aktionen.
          </openwb-base-alert>
          <openwb-base-button-group-input
            title="Fahrzeuge, die nicht mit Sollstrom laden"
            :buttons="[
              {
                buttonValue: false,
                text: 'nicht berücksichtigen',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'berücksichtigen',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/counter/config/consider_less_charging']"
            @update:model-value="updateState('openWB/counter/config/consider_less_charging', $event)"
          >
            <template #help>
              <p>
                Wenn angesteckte Fahrzeuge, die nicht oder nicht mit der Sollstromstärke laden, im Lastmanagement
                berücksichtigt werden, wird für diese der Sollstrom reserviert. Dadurch können bei Eingreifen des
                Lastmanagements andere Fahrzeuge möglicherweise nur mit reduzierter Stromstärke laden und der
                reservierte Strom wird nicht genutzt. Wenn die Fahrzeuge wieder Leistung beziehen, z.B. um zu
                klimatisieren, nutzen sie den für sie reservierten Strom.
              </p>
              <p>
                Wenn angesteckte Fahrzeuge, die nicht oder nicht mit der Sollstromstärke laden, nicht im Lastmanagement
                berücksichtigt werden, wird für diese auch kein Strom bei vorliegender Ladefreigabe reserviert bzw. es
                wird nur der tatsächlich genutzte Strom im Lastmanagement berücksichtigt. Andere Fahrzeuge können
                dadurch mit höherer Stromstärke laden. Wenn die maximalen Lastmanagement-Grenzen fast erreicht sind und
                die Fahrzeuge wieder Leistung beziehen, z.B. um zu klimatisieren, kann es zu einer kurzzeitigen
                Überschreitung der Lastmanagement-Grenzen kommen, bis im nächsten Zyklus die Stromstärken aller
                Ladepunkte an die neue Situation angepasst wurden. Das kurzzeitige Überschreiten der Maximal-Werte
                stellt für die Sicherungen in der Regel kein Problem dar.
              </p>
            </template>
          </openwb-base-button-group-input>
          <openwb-base-select-input
            title="Hausverbrauch"
            :options="getHcSourceIdOptions.options"
            :groups="getHcSourceIdOptions.groups"
            :model-value="$store.state.mqtt['openWB/counter/config/home_consumption_source_id']"
            @update:model-value="updateState('openWB/counter/config/home_consumption_source_id', $event)"
          >
            <template #help>
              Meist ist der Zähler am EVU-Punkt installiert, dann muss hier 'von openWB berechnen' ausgewählt werden.
              Wenn der Zähler im Hausverbrauchszweig installiert ist, die Struktur wie im
              <a
                href="https://github.com/openWB/core/wiki/Hausverbrauchs-Zähler"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wiki
              </a>
              beschrieben anordnen und hier den Hausverbrauchszähler auswählen. Dann wird dieser Wert abzüglich der
              Ladeleistung als Hausverbrauch erfasst.
            </template>
          </openwb-base-select-input>
          <openwb-base-heading> Vorhandene Zählermodule </openwb-base-heading>
          <openwb-base-alert subtype="info">
            Die maximale Leistung wird nur für den EVU-Zähler berücksichtigt. Bei Zwischenzählern begrenzt das
            Lastmanagement rein anhand der maximalen Phasenströme.<br />
            Wenn ein Zähler nicht auslesbar ist, wird weiterhin versucht, diesen auszulesen und nach 60s die angenommene
            Leistung im Fehlerfall verwendet, die unten für jeden Zähler eingestellt wird, um eine Überlast zu
            vermeiden. Die angenommene Leistung wird gleichmäßig auf die Phasen verteilt.<br />
            Üblicherweise sind Hausanschlüsse mit 24kW und 3*35A bzw. 43kW und 3*63A abgesichert.
          </openwb-base-alert>
          <openwb-base-card
            v-for="counter in counterConfigs"
            :key="counter.id"
            :collapsible="true"
            :collapsed="true"
            subtype="danger"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'gauge-high']" />
              {{ counter.name }}
            </template>
            <openwb-base-number-input
              title="Maximale Leistung"
              :min="1"
              :step="0.1"
              required
              unit="kW"
              :model-value="$store.state.mqtt['openWB/counter/' + counter.id + '/config/max_total_power'] / 1000"
              @update:model-value="
                updateState('openWB/counter/' + counter.id + '/config/max_total_power', $event * 1000)
              "
            >
              <template #help> Maximal zulässige Leistung für diesen (Zwischen-)Zähler. </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              title="Maximaler Strom L1"
              :min="6"
              :step="1"
              unit="A"
              required
              :model-value="$store.state.mqtt['openWB/counter/' + counter.id + '/config/max_currents'][0]"
              @update:model-value="updateState('openWB/counter/' + counter.id + '/config/max_currents', $event, '0')"
            >
              <template #help> Maximal zulässiger Strom für die Phase 1 dieses (Zwischen-)Zählers. </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              title="Maximaler Strom L2"
              :min="6"
              :step="1"
              unit="A"
              required
              :model-value="$store.state.mqtt['openWB/counter/' + counter.id + '/config/max_currents'][1]"
              @update:model-value="updateState('openWB/counter/' + counter.id + '/config/max_currents', $event, '1')"
            >
              <template #help> Maximal zulässiger Strom für die Phase 2 dieses (Zwischen-)Zählers. </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              title="Maximaler Strom L3"
              :min="6"
              :step="1"
              unit="A"
              required
              :model-value="$store.state.mqtt['openWB/counter/' + counter.id + '/config/max_currents'][2]"
              @update:model-value="updateState('openWB/counter/' + counter.id + '/config/max_currents', $event, '2')"
            >
              <template #help> Maximal zulässiger Strom für die Phase 3 dieses (Zwischen-)Zählers. </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              title="Maximale Leistung im Fehlerfall"
              :min="0"
              :step="0.1"
              unit="kW"
              :model-value="$store.state.mqtt['openWB/counter/' + counter.id + '/config/max_power_errorcase'] / 1000"
              @update:model-value="
                updateState('openWB/counter/' + counter.id + '/config/max_power_errorcase', $event * 1000)
              "
            >
              <template #help>
                Angenommen Leistung für diesen (Zwischen-)Zähler, falls vom Zähler keine Werte abgefragt werden können.
              </template>
            </openwb-base-number-input>
          </openwb-base-card>
          <openwb-base-heading> Vorhandene Wechselrichtermodule </openwb-base-heading>
          <openwb-base-card
            v-for="inverter in inverterConfigs"
            :key="inverter.id"
            :collapsible="true"
            :collapsed="true"
            subtype="success"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'solar-panel']" />
              {{ inverter.name }}
            </template>
            <openwb-base-number-input
              title="Maximale Ausgangsleistung des Wechselrichters"
              :min="0"
              :step="0.1"
              unit="kW"
              required
              :model-value="$store.state.mqtt['openWB/pv/' + inverter.id + '/config/max_ac_out'] / 1000"
              @update:model-value="updateState('openWB/pv/' + inverter.id + '/config/max_ac_out', $event * 1000)"
            >
              <template #help> Bei 0 kW erfolgt keine Berücksichtigung der maximalen Ausgangsleistung. </template>
            </openwb-base-number-input>
          </openwb-base-card>
          <openwb-base-heading> Vorhandene Speichermodule </openwb-base-heading>
          <openwb-base-card
            v-for="bat in batConfigs"
            :key="bat.id"
            :collapsible="true"
            :collapsed="true"
            subtype="warning"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'car-battery']" />
              {{ bat.name }}
            </template>
            <openwb-base-number-input
              title="Maximale Leistung des Speichers"
              :min="0"
              :step="0.1"
              unit="kW"
              required
              :model-value="$store.state.mqtt['openWB/bat/' + bat.id + '/config/max_power'] / 1000"
              @update:model-value="updateState('openWB/bat/' + bat.id + '/config/max_power', $event * 1000)"
            >
              <template #help>
                Die maximale Leistung wird lediglich für eine Plausibilitätsprüfung der Speicherwerte genutzt. Bei 0kW
                erfolgt keine Prüfung.
              </template>
            </openwb-base-number-input>
          </openwb-base-card>
        </div>
      </openwb-base-card>
      <openwb-base-card
        title="Struktur"
        :collapsible="true"
        :collapsed="true"
      >
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <!-- ToDo: Fix: nested lists bypass store commits! -->
          <sortable-list
            title="Anordnung der Komponenten"
            :model-value="$store.state.mqtt['openWB/counter/get/hierarchy']"
            :labels="hierarchyLabels"
            @update:model-value="updateState('openWB/counter/get/hierarchy', $event)"
          >
            <template #help>
              Durch die Anordnung der Komponenten werden Abhängigkeiten abgebildet.<br />
              An erster Stelle muss eine Zählerkomponente stehen, die den Netzanschlusspunkt erfasst. Dafür kann auch
              ein virtueller Zähler genutzt werden.<br />
              Die weiteren Komponenten müssen hierarchisch so angeordnet werden, wie sie auch physisch im Stromnetz
              angeschlossen werden.<br />
              Bei DC-gekoppelten Speichern sind diese hinter dem zugehörigen Wechselrichter zu platzieren, damit die
              Abhängigkeit in der Regelung berücksichtigt werden kann.
            </template>
          </sortable-list>
          <hr />
          <openwb-base-text-input
            v-model="newGroupName"
            title="Gruppe hinzufügen"
            subtype="group"
            :empty-value="null"
            :add-button="true"
            @input:add="addGroup"
          />
          <sortable-list
            v-model="loadmanagementPrioList"
            title="Prioritäten-Steuerung für das Lastmanagement"
            :labels="loadmanagementPrioLabels"
            :nesting="true"
            :max-nesting-depth="1"
            @delete-group="deleteGroup"
          >
            <template #help>
              Reihenfolge der Ladepunkt-Prioritäten für das Lastmanagement.<br />
              Die Reihenfolge kann durch Drag & Drop geändert werden.
            </template>
          </sortable-list>
        </div>
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="loadManagementConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSolarPanel as fasSolarPanel, faGaugeHigh as fasGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasSolarPanel, fasGaugeHigh);

import ComponentState from "../components/mixins/ComponentState.vue";
import SortableList from "../components/OpenwbSortableList.vue";
import OpenwbBaseTextInput from "../components/OpenwbBaseTextInput.vue";

export default {
  name: "OpenwbLoadManagementConfigView",
  components: {
    SortableList,
    FontAwesomeIcon,
    OpenwbBaseTextInput,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/bat/+/config/max_power", writeable: true },
        { topic: "openWB/chargepoint/+/config", writeable: false },
        { topic: "openWB/consumer/+/module", writeable: false },
        { topic: "openWB/counter/+/config/max_currents", writeable: true },
        { topic: "openWB/counter/+/config/max_power_errorcase", writeable: true },
        { topic: "openWB/counter/+/config/max_total_power", writeable: true },
        { topic: "openWB/counter/config/consider_less_charging", writeable: true },
        { topic: "openWB/counter/config/home_consumption_source_id", writeable: true },
        { topic: "openWB/counter/get/hierarchy", writeable: true },
        { topic: "openWB/counter/get/loadmanagement_prios", writeable: true },
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/pv/+/config/max_ac_out", writeable: true },
        { topic: "openWB/vehicle/+/name", writeable: false },
        { topic: "openWB/system/device/+/component/+/config", writeable: false },
      ],
      newGroupName: null,
    };
  },
  computed: {
    componentConfigurations() {
      return this.getWildcardTopics("openWB/system/device/+/component/+/config");
    },
    componentConfigs: {
      get() {
        return (type) => {
          let installedComponentsConfigs = this.componentConfigurations;
          return Object.keys(installedComponentsConfigs)
            .filter((key) => {
              return installedComponentsConfigs[key]?.type.includes(type);
            })
            .reduce((obj, key) => {
              return {
                ...obj,
                [key]: installedComponentsConfigs[key],
              };
            }, {});
        };
      },
    },
    counterConfigs: {
      get() {
        return this.componentConfigs("counter");
      },
    },
    counterOptions() {
      var myOptions = [];
      for (const element of Object.values(this.componentConfigurations)) {
        if (this.isComponentType(element?.type, "counter")) {
          myOptions.push({ value: element.id, text: element.name });
        }
      }
      return myOptions.sort((a, b) => {
        if (a.text == b.text) {
          return 0;
        }
        return a.text > b.text ? 1 : -1;
      });
    },
    inverterConfigs: {
      get() {
        return this.componentConfigs("inverter");
      },
    },
    batConfigs: {
      get() {
        return this.componentConfigs("bat");
      },
    },
    hierarchyLabels: {
      get() {
        let labels = {};
        for (const element of Object.values(this.$store.state.mqtt["openWB/counter/get/hierarchy"])) {
          labels = {
            ...labels,
            ...this.getElementTreeNames(element),
          };
        }
        return labels;
      },
    },
    loadmanagementPrioList: {
      get() {
        const prioList = this.$store.state.mqtt["openWB/counter/get/loadmanagement_prios"] || [];
        if (!Array.isArray(prioList)) return [];
        return prioList.map((item) => {
          // Backward compatibility: legacy prio entries ... plain vehicle IDs (e.g. "ev3")
          if (typeof item === "string") {
            return { id: item, type: "vehicle" };
          }
          return item;
        });
      },
      set(newList) {
        this.updateState("openWB/counter/get/loadmanagement_prios", newList);
      },
    },
    loadmanagementPrioLabels: {
      get() {
        const labels = {};
        const processItems = (items) => {
          items.forEach((item) => {
            switch (item.type) {
              case "group": {
                if (item.label) {
                  labels[item.id] = item.label;
                }
                if (Array.isArray(item.children)) {
                  processItems(item.children);
                }
                break;
              }
              case "vehicle": {
                const vehicleId = String(item.id).replace(/^ev/, "");
                const name = this.$store.state.mqtt[`openWB/vehicle/${vehicleId}/name`];
                if (name) {
                  labels[item.id] = name;
                }
                break;
              }
              case "load": {
                const name = this.$store.state.mqtt[`openWB/consumer/${item.id}/module`]?.name;
                if (name) {
                  labels[item.id] = name;
                }
                break;
              }
            }
          });
        };
        processItems(this.loadmanagementPrioList);
        return labels;
      },
    },
    getHcSourceIdOptions() {
      let options = [
        {
          value: null,
          text: "von openWB berechnen (in 99% der Fälle die richtige Einstellung)",
        },
      ];
      let groups = [
        {
          label: "Eingerichtete Zähler-Komponenten",
          options: [...this.counterOptions],
        },
      ];
      return { options: options, groups: groups };
    },
  },
  methods: {
    getElementTreeNames(element) {
      let myNames = {};
      switch (element.type) {
        case "cp": {
          const chargePoint = this.getChargePoint(element.id);
          if (chargePoint) {
            myNames[element.id] = chargePoint.name;
          }
          break;
        }
        case "consumer": {
          const consumer = this.$store.state.mqtt[`openWB/consumer/${element.id}/module`];
          if (consumer?.name) {
            myNames[element.id] = consumer.name;
          }
          break;
        }
        default: {
          const component = this.getComponent(element.id);
          if (component?.name) {
            myNames[element.id] = component.name;
          }
        }
      }
      element.children.forEach((child) => {
        myNames = { ...myNames, ...this.getElementTreeNames(child) };
      });
      return myNames;
    },
    getComponent(componentIndex) {
      let myComponent = undefined;
      Object.keys(this.$store.state.mqtt).forEach((value) => {
        if (value.match("^openWB/system/device/[0-9]+/component/" + componentIndex + "/config$")) {
          myComponent = this.$store.state.mqtt[value];
        }
      });
      return myComponent;
    },
    getChargePoint(chargePointIndex) {
      let myChargePoint = undefined;
      Object.keys(this.$store.state.mqtt).forEach((value) => {
        if (value.match("^openWB/chargepoint/" + chargePointIndex + "/config$")) {
          myChargePoint = this.$store.state.mqtt[value];
        }
      });
      return myChargePoint;
    },
    isComponentType(componentType, verifier) {
      return componentType?.split("_").includes(verifier);
    },
    addGroup() {
      if (!this.newGroupName) return;
      const newGroup = {
        type: "group",
        id: `group-${Date.now()}`,
        label: this.newGroupName,
        children: [],
      };
      const updatedList = [...this.loadmanagementPrioList, newGroup];
      this.loadmanagementPrioList = updatedList;
      this.newGroupName = null;
    },
    deleteGroup(groupId) {
      const unwrapGroup = (items) => {
        const result = [];
        items.forEach((item) => {
          if (item.type === "group" && item.id === groupId) {
            // Promote children instead of keeping the group
            if (Array.isArray(item.children)) {
              result.push(...item.children);
            }
          } else if (item.type === "group" && Array.isArray(item.children)) {
            // Recursively check nested groups
            result.push({
              ...item,
              children: unwrapGroup(item.children),
            });
          } else {
            result.push(item);
          }
        });
        return result;
      };
      const updatedList = unwrapGroup(this.loadmanagementPrioList);
      this.loadmanagementPrioList = updatedList;
    },
  },
};
</script>
