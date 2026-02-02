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
  <openwb-base-modal-dialog
    :show="showComponentRemoveModal"
    title="Komponente löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeComponent"
  >
    Wollen Sie die Komponente "{{ modalComponentName }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig
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
          title="Ausschaltverzögerung"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_off_threshold' / 1000]"
          :min="0"
          :max="30000"
          :step="1"
          unit="kWh"
          @update:model-value="updateState('openWB/general/consumer/config/switch_off_threshold', $event * 1000)"
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

            <openwb-config-proxy
              :device="installedConsumer"
              @update:configuration="consumerDeviceConfiguration(installedConsumer, $event)"
            />
            <hr />
            <openwb-base-heading> Zusätzliche Leistungsmessung </openwb-base-heading>
            <openwb-base-alert
              v-if="!hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Es wurde noch kein zusätzlicher Zähler hinzugefügt.
            </openwb-base-alert>
            <!-- Extra Meter Device card -->
            <openwb-base-card
              v-if="hasExtraMeter(installedConsumer.id)"
              subtype="dark"
              :collapsible="true"
              :collapsed="true"
            >
              <template #header>
                <font-awesome-icon :icon="['fas', 'fa-network-wired']" />
                {{ getExtraMeterDevice(installedConsumer.id)?.name }}
              </template>
              <openwb-config-proxy
                :device="getExtraMeterDevice(installedConsumer.id)"
                @update:configuration="updateExtraMeterDeviceConfiguration(installedConsumer.id, $event)"
              />
              <hr />
              <!-- Extra Meter Component card -->
              <openwb-base-card
                v-if="getExtraMeterComponent(installedConsumer.id)"
                subtype="danger"
                :collapsible="true"
                :collapsed="true"
              >
                <template #header>
                  <font-awesome-icon :icon="['fas', 'fa-gauge-high']" />
                  {{ getExtraMeterComponent(installedConsumer.id)?.name }}
                </template>
                <template #actions="slotProps">
                  <openwb-base-avatar
                    v-if="!slotProps.collapsed"
                    class="bg-danger clickable"
                    @click="removeExtraMeterComponentModal(installedConsumer.id, $event)"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </openwb-base-avatar>
                </template>
                <openwb-base-text-input
                  title="Bezeichnung"
                  :model-value="getExtraMeterComponent(installedConsumer.id)?.name"
                  @update:model-value="
                    updateState(
                      `openWB/consumer/${installedConsumer.id}/extra_meter/device/component/config`,
                      $event,
                      'name',
                    )
                  "
                />
                <openwb-base-text-input
                  title="Hersteller"
                  :model-value="getExtraMeterComponent(installedConsumer.id)?.info?.manufacturer"
                  @update:model-value="
                    updateState(
                      `openWB/consumer/${installedConsumer.id}/extra_meter/device/component/config`,
                      $event,
                      'info.manufacturer',
                    )
                  "
                />
                <openwb-base-text-input
                  title="Modell"
                  :model-value="getExtraMeterComponent(installedConsumer.id)?.info?.model"
                  @update:model-value="
                    updateState(
                      `openWB/consumer/${installedConsumer.id}/extra_meter/device/component/config`,
                      $event,
                      'info.model',
                    )
                  "
                />
                <hr />
                <openwb-config-proxy
                  :device="getExtraMeterDevice(installedConsumer.id)"
                  :component="getExtraMeterComponent(installedConsumer.id)"
                  @update:configuration="updateExtraMeterComponentConfiguration(installedConsumer.id, $event)"
                />
              </openwb-base-card>
              <hr />
              <openwb-base-alert
                v-if="!getExtraMeterComponent(installedConsumer.id)"
                subtype="info"
              >
                Es wurde noch keine Zähler-Komponente hinzugefügt.
              </openwb-base-alert>
              <!-- Select extra meter component -->
              <openwb-base-select-input
                v-if="!getExtraMeterComponent(installedConsumer.id)"
                v-model="extraMeterComponentToAdd"
                title="Verfügbare Komponenten"
                not-selected="Bitte auswählen"
                :options="getExtraMeterComponentList(installedConsumer.id)"
                :add-button="true"
                @input:add="addExtraMeterComponent(installedConsumer.id)"
              >
                <template #help> Wählen Sie die Komponente aus, die die Messwerte liefert (z.B. Zähler). </template>
              </openwb-base-select-input>
            </openwb-base-card>
            <hr />
            <div v-if="!getExtraMeterDevice(installedConsumer.id)">
              <openwb-base-heading> Zusätzlicher Zähler hinzufügen </openwb-base-heading>
              <!-- Select extra meter device -->
              <openwb-base-select-input
                v-model="selectedExtraMeterVendor"
                title="Hersteller (Zusätzlicher Zähler)"
                not-selected="Bitte auswählen"
                :groups="extraMeterVendorList"
              />
              <openwb-base-select-input
                v-model="extraMeterDeviceToAdd"
                title="Verfügbare Zählergeräte"
                not-selected="Bitte auswählen"
                :disabled="!selectedExtraMeterVendor"
                :options="extraMeterDeviceList"
                :add-button="true"
                @input:add="addExtraMeterDevice(installedConsumer.id)"
              >
                <template #help>
                  Wählen Sie das Gerät aus, über das die zusätzliche Leistungsmessung erfolgen soll.
                </template>
              </openwb-base-select-input>
            </div>
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
        @save="$emit('save')"
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
  faNetworkWired as fasNetworkWired,
  faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHome, fasPlus, fasTrash, fasCog, fasNetworkWired, fasGaugeHigh);
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbConfigProxy from "../components/devices/OpenwbConfigProxy.vue";

export default {
  name: "OpenwbConsumerConfigView",
  components: {
    FontAwesomeIcon,
    OpenwbConfigProxy,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/consumer/+/module",
        "openWB/consumer/+/config",
        "openWB/consumer/+/usage",
        "openWB/system/configurable/consumers_extra_meter",
        "openWB/consumer/+/extra_meter/device/config",
        "openWB/consumer/+/extra_meter/device/component/config",
        "openWB/general/consumer/config/switch_on_delay",
        "openWB/general/consumer/config/switch_off_delay",
        "openWB/general/consumer/config/switch_off_threshold",
        "openWB/system/configurable/consumers",
      ],
      selectedVendor: undefined,
      consumerToAdd: undefined,
      selectedExtraMeterVendor: undefined,
      extraMeterDeviceToAdd: undefined,
      extraMeterComponentToAdd: undefined,
      showConsumerRemoveModal: false,
      showComponentRemoveModal: false,
      modalConsumer: undefined,
      modalConsumerName: "",
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
          .map(([groupKey, group]) => {
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
    extraMeterVendorList() {
      const consumerExtraMeterDevice = this.$store.state.mqtt["openWB/system/configurable/consumers_extra_meter"];
      if (!consumerExtraMeterDevice) return [];
      return Object.entries(consumerExtraMeterDevice)
        .map(([groupKey, group]) => ({
          label: group.group_name,
          options: Object.entries(group.vendors)
            .map(([vendorKey, vendor]) => ({
              value: vendorKey,
              text: vendor.vendor_name,
            }))
            .sort((a, b) => a.text.localeCompare(b.text)),
        }))
        .sort((a, b) => -a.label.localeCompare(b.label)); // reverse order to have "openWB" at the top
    },
    extraMeterDeviceList() {
      if (!this.selectedExtraMeterVendor) return [];
      const consumerExtraMeterConfigurable = this.$store.state.mqtt["openWB/system/configurable/consumers_extra_meter"];
      if (!consumerExtraMeterConfigurable) return [];
      for (const group of Object.values(consumerExtraMeterConfigurable)) {
        const vendor = group.vendors?.[this.selectedExtraMeterVendor];
        if (vendor?.devices) {
          return Object.entries(vendor.devices)
            .map(([deviceKey, device]) => ({
              value: deviceKey,
              text: device.device_name,
            }))
            .sort((a, b) => a.text.localeCompare(b.text));
        }
      }
      return [];
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
    removeExtraMeterComponentModal(consumerId, event) {
      event.stopPropagation();
      this.modalConsumer = consumerId;
      this.modalComponentName = this.getExtraMeterComponent(consumerId)?.name ?? "";
      this.showComponentRemoveModal = true;
    },
    removeComponent(event) {
      this.showComponentRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeConsumerExtraMeterComponent",
          data: { consumer_id: this.modalConsumer },
        });
      }
    },
    addExtraMeterDevice(consumerId) {
      if (!this.selectedExtraMeterVendor || !this.extraMeterDeviceToAdd) return;

      this.$emit("sendCommand", {
        command: "addConsumerExtraMeterDevice",
        data: {
          vendor: this.selectedExtraMeterVendor,
          type: this.extraMeterDeviceToAdd,
          consumer_id: consumerId,
        },
      });
      this.extraMeterDeviceToAdd = undefined;
    },
    getExtraMeterComponentList(consumerId) {
      const device = this.getExtraMeterDevice(consumerId);
      if (!device) return [];

      const consumerExtraMeterConfigurable = this.$store.state.mqtt["openWB/system/configurable/consumers_extra_meter"];
      if (!consumerExtraMeterConfigurable) return [];

      for (const group of Object.values(consumerExtraMeterConfigurable)) {
        const vendor = group.vendors?.[device.vendor];
        const dev = vendor?.devices?.[device.type];

        if (dev?.components) {
          return Object.entries(dev.components).map(([key, component]) => ({
            value: key,
            text: component.component_name,
          }));
        }
      }
      return [];
    },
    addExtraMeterComponent(consumerId) {
      if (!this.extraMeterComponentToAdd) return;

      const device = this.getExtraMeterDevice(consumerId);
      if (!device) return;

      this.$emit("sendCommand", {
        command: "addConsumerExtraMeterComponent",
        data: {
          deviceVendor: device.vendor,
          deviceType: device.type,
          type: this.extraMeterComponentToAdd,
          consumer_id: consumerId,
        },
      });
      this.extraMeterComponentToAdd = undefined;
    },
    getExtraMeterDevice(consumerId) {
      return this.$store.state.mqtt[`openWB/consumer/${consumerId}/extra_meter/device/config`];
    },

    getExtraMeterComponent(consumerId) {
      return this.$store.state.mqtt[`openWB/consumer/${consumerId}/extra_meter/device/component/config`];
    },
    hasExtraMeter(consumerId) {
      return !!this.getExtraMeterDevice(consumerId);
    },
    updateExtraMeterDeviceConfiguration(consumerId, event) {
      this.updateState(`openWB/consumer/${consumerId}/extra_meter/device/config`, event.value, event.object);
    },
    updateExtraMeterComponentConfiguration(consumerId, event) {
      this.updateState(`openWB/consumer/${consumerId}/extra_meter/device/component/config`, event.value, event.object);
    },
    consumerDeviceConfiguration(consumer, event) {
      const { object, value } = event;
      const moduleFields = ["configuration.ip_address", "configuration.port", "configuration.modbus_id"];
      const targetTopic = moduleFields.includes(object)
        ? `openWB/consumer/${consumer.id}/module`
        : `openWB/consumer/${consumer.id}/config`;
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
        suspendable_onoff_individual: "Schaltbar (Individuell)",
        suspendable_tunable: "Stufenlos regelbar",
        suspendable_tunable_individual: "Stufenlos regelbar (Individuell)",
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
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
