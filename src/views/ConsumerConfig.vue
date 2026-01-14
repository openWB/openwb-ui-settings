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
      <!-- Allgemeine Einstellungen -->
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

      <!-- Verbraucher-Liste -->
      <openwb-base-card title="Verbraucher">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
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
            <openwb-config-proxy
              :consumer="installedConsumer"
              @update:configuration="updateConfiguration(installedConsumerKey, $event)"
            />
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHome, fasPlus, fasTrash, fasCog, fasNetworkWired);

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
        "openWB/system/consumer/+/config",
        "openWB/general/consumer/config/switch_on_delay",
        "openWB/general/consumer/config/switch_off_delay",
        "openWB/general/consumer/config/switch_off_threshold",
        "openWB/system/configurable/consumers",
      ],
      selectedVendor: undefined,
      consumerToAdd: undefined,
      showConsumerRemoveModal: false,
      modalConsumer: undefined,
      modalConsumerName: "",
    };
  },
  computed: {
    installedConsumers: {
      get() {
        return this.getWildcardTopics("openWB/system/consumer/+/config");
      },
    },
    vendorList: {
      get() {
        if (this.$store.state.mqtt["openWB/system/configurable/consumers"] === undefined) {
          return [];
        }
        const configurable = this.$store.state.mqtt["openWB/system/configurable/consumers"];
        
        return Object.entries(configurable).map(([groupKey, group]) => {
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
        });
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
        
        // Finde den Vendor in allen Gruppen
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
          data: { id: this.modalConsumer },
        });
      }
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
