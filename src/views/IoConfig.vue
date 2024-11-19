<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showIoDeleteModal"
    title="Modul löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeIoDevice(modalIoIndex, $event)"
  >
    Wollen Sie das Ein-/Ausgangs-Gerät "{{ getIoDeviceName(modalIoIndex) }}" (ID: {{ modalIoIndex }}) wirklich
    entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>

  <!-- main content -->
  <div class="ioConfig">
    <form name="ioConfigForm">
      <openwb-base-card title="Ein-/Ausgangs-Geräte">
        <openwb-base-card
          v-for="(installedIoDevice, installedIoDeviceKey) in installedIoDevices"
          :key="installedIoDeviceKey"
          :title="installedIoDevice?.name + ' (ID: ' + installedIoDevice?.id + ')'"
          :collapsible="true"
          :collapsed="true"
          subtype="primary"
        >
          <template #actions="slotProps">
            <openwb-base-avatar
              v-if="!slotProps.collapsed"
              class="bg-danger clickable"
              @click="removeIoDeviceModal(installedIoDeviceKey, $event)"
            >
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'trash']"
              />
            </openwb-base-avatar>
          </template>
          <openwb-base-text-input
            title="Bezeichnung"
            subtype="text"
            :model-value="installedIoDevice.name"
            @update:model-value="updateState(installedIoDeviceKey, $event, 'name')"
          />
          <openwb-base-text-input
            title="Modul"
            subtype="text"
            disabled
            readonly
            :model-value="$store.state.mqtt[installedIoDeviceKey].type"
          />
        </openwb-base-card>
        <hr v-if="Object.keys(installedIoDevices).length > 0" />
        <openwb-base-select-input
          title="Verfügbare Geräte"
          not-selected="Bitte auswählen"
          :options="ioDeviceList"
          :model-value="ioDeviceToAdd"
          :add-button="true"
          @update:model-value="ioDeviceToAdd = $event"
          @input:add="addIoDevice"
        >
          <template #help> Bitte ein I/O-Modul auswählen, das hinzugefügt werden soll. </template>
        </openwb-base-select-input>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="ioConfigForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasTrash);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbIoConfigView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["save", "reset", "defaults", "sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/system/configurable/io_devices", "openWB/system/io/+/config"],
      showIoDeleteModal: false,
      ioDeviceToAdd: undefined,
    };
  },
  computed: {
    ioDeviceList() {
      return this.$store.state.mqtt["openWB/system/configurable/io_devices"];
    },
    installedIoDevices: {
      get() {
        return this.getWildcardTopics("openWB/system/io/+/config");
      },
    },
  },
  methods: {
    getIoDeviceName(ioDeviceIndex) {
      return this.$store.state.mqtt["openWB/system/io/" + ioDeviceIndex + "/config"]
        ? this.$store.state.mqtt["openWB/system/io/" + ioDeviceIndex + "/config"].name
        : "I/O-Gerät " + ioDeviceIndex;
    },
    addIoDevice() {
      console.log("addIoDevice", this.ioDeviceToAdd);
      this.$emit("sendCommand", {
        command: "addIoDevice",
        data: { type: this.ioDeviceToAdd },
      });
    },
    removeIoDeviceModal(ioDevice, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalIoIndex = parseInt(ioDevice.match(/(?:\/)(\d+)(?=\/)/)[1]);
      this.showIoDeleteModal = true;
    },
    removeIoDevice(ioDeviceIndex, event) {
      this.showIoDeleteModal = false;
      if (event == "confirm") {
        console.debug("request removal of io device '" + ioDeviceIndex + "'");
        this.$emit("sendCommand", {
          command: "removeIoDevice",
          data: { id: ioDeviceIndex },
        });
      }
    },
  },
};
</script>
