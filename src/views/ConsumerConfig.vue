<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showConsumerRemoveModal"
    title="Verbraucher löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeConsumer"
  >
    Wollen Sie den Verbraucher "{{ modalConsumerName }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig
    gemacht werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="consumerConfig">
    <form name="consumerConfigForm">
      <!-- General Settings -->
      <openwb-base-card>
        <template #header>
          <font-awesome-icon :icon="['fas', 'cog']" />
          Allgemeine Einstellungen
        </template>
        <openwb-base-number-input
          title="Einschaltverzögerung"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_on_delay']"
          :min="0"
          :max="300"
          :step="1"
          unit="s"
          @update:model-value="updateState('openWB/general/consumer/config/switch_on_delay', $event)"
        />
        <openwb-base-number-input
          title="Ausschaltverzögerung"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_off_delay']"
          :min="0"
          :max="300"
          :step="1"
          unit="s"
          @update:model-value="updateState('openWB/general/consumer/config/switch_off_delay', $event)"
        />
        <openwb-base-number-input
          title="Ausschaltschwelle"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_off_threshold']"
          :min="0"
          :max="30000"
          :step="1"
          unit="W"
          @update:model-value="updateState('openWB/general/consumer/config/switch_off_threshold', $event)"
        />
      </openwb-base-card>
      <!-- Consumer section -->
      <openwb-base-card title="Verbraucher">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <!-- Individual Consumer cards -->
          <openwb-base-card
            v-for="(installedConsumer, installedConsumerKey) in installedConsumers"
            :key="installedConsumerKey"
            :collapsible="true"
            :collapsed="true"
            subtype="dark"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'home']" />
              {{ installedConsumer?.name }}
            </template>
            <template #actions="slotProps">
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeConsumerModal(installedConsumer?.id, installedConsumer?.name, $event)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              subtype="text"
              :model-value="installedConsumer?.name"
              @update:model-value="updateState(installedConsumerKey, $event, 'name')"
            />
            <openwb-base-text-input
              title="Hersteller"
              subtype="text"
              :model-value="installedConsumer.info?.manufacturer"
              @update:model-value="updateState(installedConsumerKey, $event, 'info.manufacturer')"
            >
              <template #help> Optional: zusätzliche Information für den Systembericht. </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              title="Modell"
              subtype="text"
              :model-value="installedConsumer.info?.model"
              @update:model-value="updateState(installedConsumerKey, $event, 'info.model')"
            >
              <template #help> Optional: zusätzliche Information für den Systembericht. </template>
            </openwb-base-text-input>
            <hr />
            <openwb-base-heading> Verwendung Optionen </openwb-base-heading>
            <openwb-base-select-input
              title="Verwendung"
              not-selected="Bitte auswählen"
              :options="getUsageOptions(installedConsumer)"
              :model-value="installedConsumer.consumerUsage?.type ?? null"
              @update:model-value="setUsage(installedConsumer.id, $event)"
            >
              <template #help> Legt fest, wie dieser Verbraucher im Energiemanagement berücksichtigt wird. </template>
            </openwb-base-select-input>

            <hr />
            <openwb-base-heading> Elektrischer Anschluss </openwb-base-heading>
            <openwb-base-button-group-input
              title="Anzahl angeschlossener Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 2, text: '2' },
                { buttonValue: 3, text: '3' },
              ]"
              :model-value="installedConsumer.config?.connected_phases"
              @update:model-value="
                updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'connected_phases')
              "
            />
            <openwb-base-button-group-input
              title="Phase 1 des Ladekabels"
              :buttons="[
                { buttonValue: 1, text: 'EVU L1' },
                { buttonValue: 2, text: 'EVU L2' },
                { buttonValue: 3, text: 'EVU L3' },
              ]"
              :model-value="installedConsumer?.config?.phase_1"
              @update:model-value="updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'phase_1')"
            >
            </openwb-base-button-group-input>
            <openwb-base-number-input
              title="Max Leistung"
              unit="W"
              :min="1"
              :model-value="installedConsumer?.config?.max_power"
              @update:model-value="updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'max_power')"
            >
            </openwb-base-number-input>

            <hr />

            <openwb-consumer-config-proxy
              :device="installedConsumer"
              @update:configuration="consumerDeviceConfiguration(installedConsumer, $event)"
            />
            <template v-if="showModeSettings(installedConsumer)">
              <hr />
              <openwb-base-heading> Betriebsmodus </openwb-base-heading>
              <openwb-base-button-group-input
                title="Betriebsmodus"
                :buttons="[
                  { buttonValue: 'instant_charging', text: 'Sofort', class: 'btn-outline-danger' },
                  { buttonValue: 'pv_charging', text: 'PV', class: 'btn-outline-success' },
                  { buttonValue: 'eco_charging', text: 'Eco', class: 'btn-outline-warning' },
                  { buttonValue: 'scheduled_charging', text: 'Ziel', class: 'btn-outline-primary' },
                  { buttonValue: 'stop', text: 'Stop', class: 'btn-outline-dark' },
                ]"
                :model-value="installedConsumer.consumerUsage.chargemode"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'chargemode')"
              >
                <template #help>
                  Sofort = dauerhaft an, Stop = dauerhaft aus. PV, Eco und Ziel schalten den Verbraucher nach
                  Überschuss, Strompreis bzw. Zeitplan.
                </template>
              </openwb-base-button-group-input>
              <hr />
              <openwb-base-card
                v-if="installedConsumer.consumerUsage.chargemode === 'instant_charging'"
                title="Sofort"
              >
                <openwb-base-alert subtype="info"> Das Gerät wird sofort eingeschaltet. </openwb-base-alert>
              </openwb-base-card>
              <openwb-base-card
                v-if="installedConsumer.consumerUsage.chargemode === 'pv_charging'"
                title="PV"
              >
                <openwb-base-alert subtype="info">
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde. Das Gerät wird frühestens wieder ausgeschaltet, wenn die minimale Betriebsdauer
                  erreicht wurde, um sicherzustellen, dass das Programm vollständig durchlaufen kann.
                </openwb-base-alert>
              </openwb-base-card>
              <openwb-base-card
                v-if="installedConsumer.consumerUsage.chargemode === 'eco_charging'"
                title="Eco"
              >
                <openwb-base-alert subtype="info">
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde oder der Preis unter die Strompreisgrenze fällt. Das Gerät wird frühestens wieder
                  ausgeschaltet, wenn die minimale Betriebsdauer erreicht wurde, um sicherzustellen, dass das Programm
                  vollständig durchlaufen kann.
                </openwb-base-alert>
                <openwb-base-number-input
                  title="Strompreisgrenze"
                  unit="ct/kWh"
                  :min="0"
                  :step="0.1"
                  :model-value="installedConsumer.consumerUsage.eco_charging.price_limit * 100"
                  @update:model-value="updateUsage(installedConsumer.id, $event / 100, 'eco_charging.price_limit')"
                >
                  <template #help>
                    Eco schaltet den Verbraucher ein, sobald der variable Strompreis unter diesem Wert liegt. Dafür muss
                    ein Strompreis-Anbieter konfiguriert sein.
                  </template>
                </openwb-base-number-input>
              </openwb-base-card>
              <openwb-base-card
                v-if="installedConsumer.consumerUsage.chargemode === 'scheduled_charging'"
                title="Ziel"
              >
                <openwb-base-alert subtype="info">
                  Jeder Plan führt einen Programm-Durchlauf des Geräts durch. Wenn der Preis vorher günstig ist oder
                  genug Überschuss da ist, wird vorher gestartet, sonst zu angegebenen Uhrzeit.
                </openwb-base-alert>
                <hr />
                <openwb-base-heading>
                  Zielpläne
                  <template #actions>
                    <openwb-base-avatar
                      class="bg-success clickable"
                      title="Neuen Zielladen-Plan hinzufügen"
                      @click.stop="addUsagePlan(installedConsumer.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />
                    </openwb-base-avatar>
                  </template>
                </openwb-base-heading>
                <openwb-base-alert
                  v-if="!installedConsumer.consumerUsage.scheduled_charging?.plans?.length"
                  subtype="info"
                >
                  Es wurde noch kein Zielladen-Plan angelegt.
                </openwb-base-alert>
                <openwb-base-card
                  v-for="plan in installedConsumer.consumerUsage.scheduled_charging?.plans ?? []"
                  :key="plan.id"
                  :title="plan.name"
                  subtype="dark"
                >
                  <template #actions>
                    <openwb-base-avatar
                      class="bg-danger clickable"
                      title="Plan entfernen"
                      @click.stop="removeUsagePlan(installedConsumer.id, plan.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </openwb-base-avatar>
                  </template>
                  <!-- TODO: Plan-Felder (Zeit, Wiederholung, Dauer) nach Klärung der Backend-Struktur -->
                </openwb-base-card>
              </openwb-base-card>
              <openwb-base-card
                v-if="installedConsumer.consumerUsage.chargemode === 'stop'"
                title="Stop"
              >
                <openwb-base-alert subtype="info"> Das Gerät wird dauerhaft ausgeschaltet. </openwb-base-alert>
              </openwb-base-card>
              <openwb-base-number-input
                title="Min Betriebsstrom"
                unit="A"
                :min="0"
                :step="0.1"
                :model-value="installedConsumer.consumerUsage.min_current"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'min_current')"
              />
              <openwb-base-number-input
                title="Min Regelintervall"
                unit="s"
                :min="0"
                :step="1"
                :model-value="installedConsumer.consumerUsage.min_intervall"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'min_intervall')"
              >
                <template #help>
                  Mindestzeit, die der Verbraucher in einem Schaltzustand bleibt. Träge Geräte (z. B. Wärmepumpen)
                  benötigen hier größere Werte.
                </template>
              </openwb-base-number-input>
              <openwb-base-button-group-input
                title="Anlauferkennung"
                :buttons="[
                  { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
                  { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
                ]"
                :model-value="installedConsumer.consumerUsage.wait_for_start_active"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'wait_for_start_active')"
              >
                <template #help>
                  "Durch diese Option wird das angeschlossene Gerät täglich um 0:01 Uhr eingeschaltet. Wenn erkannt
                  wird, dass das Gerät … Leistungsaufnahme länger als 'Zeit im Standby' größer als 'Verbrauch im
                  Standby' … wird es direkt ausgeschaltet, falls die Einschaltschwelle nicht erreicht ist … Somit kann
                  z.B. eine Waschmaschine am Morgen im Standby befüllt … läuft aber erst richtig an, wenn genügend
                  Überschuss vorhanden ist."
                </template>
              </openwb-base-button-group-input>
              <hr />
              <openwb-base-heading> Zeitladen </openwb-base-heading>
              <openwb-base-button-group-input
                title="Zeitladen aktiv"
                :buttons="[
                  { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
                  { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
                ]"
                :model-value="installedConsumer.consumerUsage.time_charging.active"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'time_charging.active')"
              >
                <template #help>
                  Zeitladen schaltet das Gerät innerhalb der festgelegten Zeitpläne ein, unabhängig vom oben gewählten
                  Betriebsmodus.
                </template>
              </openwb-base-button-group-input>
              <template v-if="installedConsumer.consumerUsage.time_charging.active">
                <openwb-base-alert
                  v-if="!installedConsumer.consumerUsage.time_charging.plans?.length"
                  subtype="info"
                >
                  Es wurde noch kein Zeitladen-Plan angelegt.
                </openwb-base-alert>
                <openwb-base-card
                  v-for="plan in installedConsumer.consumerUsage.time_charging.plans ?? []"
                  :key="plan.id"
                  :title="plan.name"
                  subtype="dark"
                >
                  <!-- TODO: Add plan fields (time, repetition, min. storage SoC) + Add/Remove,
                       as soon as there is a backend command for consumer time charging plans -->
                </openwb-base-card>
              </template>
            </template>
            <hr />
            <openwb-base-heading> Integrierter Zähler </openwb-base-heading>
            <openwb-base-alert
              v-if="!hasIntegratedCounter[installedConsumer.id] && !hasExtraMeter(installedConsumer.id)"
              subtype="warning"
            >
              Es ist kein separater Zähler verknüpft. Ohne separaten Zähler wird der Verbraucher anhand der eingegebenen
              minimalen Leistung geschaltet.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="!hasIntegratedCounter[installedConsumer.id] && hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Dieser Verbraucher verfügt über keinen integrierten Zähler. Ein separater Zähler ist verknüpft.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="hasIntegratedCounter[installedConsumer.id] && !hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Es ist kein separater Zähler verknüpft. Falls gewünscht, kann ein separater Zähler verknüpft werden, der
              die Messwerte des integrierten Zählers überschreibt.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="hasIntegratedCounter[installedConsumer.id] && hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Ein separater Zähler ist verknüpft. Die Messwerte des integrierten Zählers werden durch die Werte des
              separaten Zählers überschrieben.
            </openwb-base-alert>
            <hr />
            <openwb-base-heading> Separate Leistungsmessung </openwb-base-heading>
            <openwb-base-alert subtype="info">
              Legen Sie den Zähler zuerst unter „Geräte und Komponenten" an und verknüpfen Sie ihn anschließend hier mit
              dem Verbraucher. Der EVU-Zähler sowie Zähler, die bereits einem anderen Verbraucher zugeordnet sind,
              stehen nicht zur Auswahl.
            </openwb-base-alert>
            <openwb-base-select-input
              title="Zähler"
              :options="availableCounterOptions(installedConsumer.id)"
              :model-value="getExtraMeter(installedConsumer.id) ?? null"
              @update:model-value="setExtraMeter(installedConsumer.id, $event)"
            >
              <template #help>
                Der ausgewählte Zähler überschreibt die Messwerte eines ggf. integrierten Zählers. Konfiguriert wird der
                Zähler unter „Geräte und Komponenten".
              </template>
            </openwb-base-select-input>
          </openwb-base-card>
          <hr v-if="Object.keys(installedConsumers).length > 0" />
          <openwb-base-select-input
            v-model="selectedVendor"
            title="Hersteller"
            not-selected="Bitte auswählen"
            :groups="vendorList"
          />
          <openwb-base-select-input
            v-model="consumerToAdd"
            title="Verfügbare Verbraucher"
            not-selected="Bitte auswählen"
            :disabled="selectedVendor === undefined"
            :options="consumerList"
            :model-value="consumerToAdd"
            :add-button="true"
            @update:model-value="consumerToAdd = $event"
            @input:add="addConsumer"
          >
            <template #help> Bitte einen Verbraucher auswählen, der hinzugefügt werden soll. </template>
          </openwb-base-select-input>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="consumerConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome as fasHome,
  faPlus as fasPlus,
  faTrash as fasTrash,
  faCog as fasCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHome, fasPlus, fasTrash, fasCog);
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbConsumerConfigProxy from "../components/consumers/OpenwbConsumerConfigProxy.vue";

export default {
  name: "OpenwbConsumerConfigView",
  components: {
    FontAwesomeIcon,
    OpenwbConsumerConfigProxy,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/consumer/+/module", writeable: true },
        { topic: "openWB/consumer/+/config", writeable: true },
        { topic: "openWB/consumer/+/usage", writeable: true },
        { topic: "openWB/consumer/+/extra_meter", writeable: true },
        { topic: "openWB/system/device/+/component/+/config", writeable: false },
        { topic: "openWB/counter/get/hierarchy", writeable: false },
        { topic: "openWB/general/consumer/config/switch_on_delay", writeable: true },
        { topic: "openWB/general/consumer/config/switch_off_delay", writeable: true },
        { topic: "openWB/general/consumer/config/switch_off_threshold", writeable: true },
        { topic: "openWB/system/configurable/consumers", writeable: false },
      ],
      selectedVendor: undefined,
      consumerToAdd: undefined,
      showConsumerRemoveModal: false,
      modalConsumer: undefined,
      modalConsumerName: "",
      CONSUMER_CONFIG_FIELDS: ["connected_phases", "phase_1", "max_power"],
    };
  },
  computed: {
    installedConsumers() {
      const modules = this.getWildcardTopics("openWB/consumer/+/module");
      const configs = this.getWildcardTopics("openWB/consumer/+/config");
      const usages = this.getWildcardTopics("openWB/consumer/+/usage");

      return Object.fromEntries(
        Object.entries(modules).map(([moduleTopic, module]) => {
          const id = module.id;

          return [
            moduleTopic,
            {
              ...module,
              config: configs[`openWB/consumer/${id}/config`] ?? {},
              consumerUsage: usages[`openWB/consumer/${id}/usage`] ?? null,
            },
          ];
        }),
      );
    },
    vendorList: {
      get() {
        if (this.$store.state.mqtt["openWB/system/configurable/consumers"] === undefined) {
          return [];
        }
        const configurable = this.$store.state.mqtt["openWB/system/configurable/consumers"];
        return Object.entries(configurable)
          .map(([, group]) => {
            return {
              label: group.group_name,
              options: Object.entries(group.vendors)
                .map(([vendorKey, vendor]) => {
                  return {
                    value: vendorKey,
                    text: vendor.vendor_name,
                  };
                })
                .sort((a, b) => a.text.localeCompare(b.text)),
            };
          })
          .sort((a, b) => -a.label.localeCompare(b.label)); // reverse order to have "openWB" at the top
      },
    },
    consumerList: {
      get() {
        if (this.selectedVendor === undefined) {
          return [];
        }
        const configurable = this.$store.state.mqtt["openWB/system/configurable/consumers"];
        if (!configurable) {
          return [];
        }
        let selectedVendorData = null;
        for (const group of Object.values(configurable)) {
          if (group.vendors && group.vendors[this.selectedVendor]) {
            selectedVendorData = group.vendors[this.selectedVendor];
            break;
          }
        }
        if (!selectedVendorData || !selectedVendorData.consumers) {
          return [];
        }
        return Object.entries(selectedVendorData.consumers)
          .map(([consumerKey, consumer]) => {
            return {
              value: [this.selectedVendor, consumerKey],
              text: consumer.consumer_name,
            };
          })
          .sort((a, b) => a.text.localeCompare(b.text));
      },
    },
    componentConfigurations() {
      return this.getWildcardTopics("openWB/system/device/+/component/+/config");
    },
    // id of the EVU/grid counter (root of the counter hierarchy), which must not be selectable
    evuCounterId() {
      const hierarchy = this.$store.state.mqtt["openWB/counter/get/hierarchy"];
      if (!Array.isArray(hierarchy) || hierarchy.length === 0) return undefined;
      return hierarchy[0]?.id;
    },
    extraMeterLinks() {
      const topics = this.getWildcardTopics("openWB/consumer/+/extra_meter");
      return Object.entries(topics).map(([topic, counterId]) => {
        const match = topic.match(/openWB\/consumer\/(\d+)\/extra_meter/);
        return { consumerId: match ? parseInt(match[1]) : null, counterId };
      });
    },
    hasIntegratedCounter() {
      const result = {};
      Object.values(this.installedConsumers).forEach((consumer) => {
        result[consumer.id] = consumer?.usage?.includes("meter_only") ?? false;
      });
      return result;
    },
  },
  methods: {
    addConsumer() {
      if (!this.consumerToAdd) return;
      this.$emit("sendCommand", {
        command: "addConsumer",
        data: {
          vendor: this.consumerToAdd[0],
          type: this.consumerToAdd[1],
        },
      });
    },
    removeConsumerModal(index, name, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalConsumer = index;
      this.modalConsumerName = name;
      this.showConsumerRemoveModal = true;
    },
    removeConsumer(event) {
      this.showConsumerRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeConsumer",
          data: { consumer_id: this.modalConsumer },
        });
      }
    },
    getExtraMeter(consumerId) {
      return this.$store.state.mqtt[`openWB/consumer/${consumerId}/extra_meter`];
    },
    hasExtraMeter(consumerId) {
      return this.getExtraMeter(consumerId) != null;
    },
    setExtraMeter(consumerId, counterId) {
      this.updateState(`openWB/consumer/${consumerId}/extra_meter`, counterId ?? null);
    },
    // counters selectable for this consumer: type counter, excluding the EVU/grid
    // counter and counters already linked to another consumer
    availableCounterOptions(consumerId) {
      const linkedElsewhere = this.extraMeterLinks
        .filter((link) => link.consumerId !== consumerId && link.counterId != null)
        .map((link) => link.counterId);
      const counters = Object.values(this.componentConfigurations)
        .filter((component) => component && this.isComponentType(component.type, "counter"))
        .filter((component) => component.id !== this.evuCounterId)
        .filter((component) => !linkedElsewhere.includes(component.id))
        .map((component) => ({ value: component.id, text: component.name }))
        .sort((a, b) => a.text.localeCompare(b.text));
      // explicit selectable "none" entry so an existing link can be removed
      return [{ value: null, text: "kein Zähler" }, ...counters];
    },
    isComponentType(componentType, verifier) {
      return componentType.split("_").includes(verifier);
    },
    consumerDeviceConfiguration(consumer, event) {
      const { object, value } = event;
      const isConsumerConfigField = this.CONSUMER_CONFIG_FIELDS.includes(object);
      const targetTopic = isConsumerConfigField
        ? `openWB/consumer/${consumer.id}/config`
        : `openWB/consumer/${consumer.id}/module`;
      this.updateState(targetTopic, value, object);
    },
    getUsageOptions(consumer) {
      if (!Array.isArray(consumer.usage)) return [];
      return consumer.usage.map((use) => ({
        value: use,
        text: this.usageLabels(use),
      }));
    },
    usageLabels(type) {
      const map = {
        meter_only: "Nur Messung",
        suspendable_onoff: "Schaltbar (Ein/Aus)",
        suspendable_tunable: "Stufenlos regelbar",
        continuous: "Dauerverbraucher",
      };
      return map[type] ?? type;
    },
    setUsage(consumerId, usage) {
      this.$emit("sendCommand", {
        command: "selectUsage",
        data: {
          consumer_id: consumerId,
          usage,
        },
      });
    },
    showModeSettings(consumer) {
      const type = consumer.consumerUsage?.type;
      return type != null && type !== "meter_only";
    },
    updateUsage(consumerId, value, path) {
      this.updateState(`openWB/consumer/${consumerId}/usage`, value, path);
    },
    addUsagePlan(consumerId) {
      this.$emit("sendCommand", {
        command: "addUsagePlan",
        data: { consumer_id: consumerId },
      });
    },
    removeUsagePlan(consumerId, planId) {
      this.$emit("sendCommand", {
        command: "removeUsagePlan",
        data: { consumer_id: consumerId, plan: planId },
      });
    },
  },
};
</script>
