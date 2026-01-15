<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showIoDeviceDeleteModal"
    title="Modul löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeIoDevice(modalIoDeviceIndex, $event)"
  >
    Willst Du das Ein-/Ausgangs-Gerät "{{ getIoDeviceName(modalIoDeviceIndex) }}" (ID: {{ modalIoDeviceIndex }})
    wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showIoActionDeleteModal"
    title="Aktion löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeIoAction(modalIoActionIndex, $event)"
  >
    Willst Du die Aktion "{{ getIoDeviceName(modalIoActionIndex) }}" (ID: {{ modalIoActionIndex }}) wirklich entfernen?
    Dieser Vorgang kann nicht rückgängig gemacht werden!
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
              <font-awesome-icon :icon="['fas', 'trash']" />
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
          <hr />
          <openwb-io-device-proxy
            :io-device="installedIoDevice"
            @update:configuration="updateConfiguration(installedIoDeviceKey, $event)"
            @send-command="sendSystemCommand($event.command, $event.data)"
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
          <template #help> Bitte ein Ein-/Ausgangs-Modul auswählen, das hinzugefügt werden soll. </template>
        </openwb-base-select-input>
      </openwb-base-card>

      <openwb-base-card title="Ein-/Ausgangs-Aktionen">
        <openwb-base-card
          v-for="(installedIoAction, installedIoActionKey) in installedIoActions"
          :key="installedIoActionKey"
          :title="installedIoAction?.name + ' (ID: ' + installedIoAction?.id + ')'"
          :collapsible="true"
          :collapsed="true"
          subtype="primary"
        >
          <template #actions="slotProps">
            <openwb-base-avatar
              v-if="!slotProps.collapsed"
              class="bg-danger clickable"
              @click="removeIoActionModal(installedIoActionKey, $event)"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </openwb-base-avatar>
          </template>
          <openwb-base-text-input
            title="Bezeichnung"
            subtype="text"
            :model-value="installedIoAction?.name"
            @update:model-value="updateState(installedIoActionKey, $event, 'name')"
          />
          <openwb-base-text-input
            title="Modul"
            subtype="text"
            disabled
            readonly
            :model-value="[installedIoAction?.group, installedIoAction?.type].join(' / ')"
          />
          <hr />
          <openwb-io-action-proxy
            v-if="installedIoAction !== undefined"
            :io-action="installedIoAction"
            :io-devices="installedIoDevices"
            :installed-charge-points="installedChargePoints"
            :installed-components="installedComponents"
            @update:configuration="updateConfiguration(installedIoActionKey, $event)"
          />
        </openwb-base-card>
        <hr v-if="Object.keys(installedIoActions).length > 0" />
        <openwb-base-select-input
          v-if="Object.keys(installedIoDevices).length > 0"
          title="Verfügbare Aktionen"
          not-selected="Bitte auswählen"
          :groups="ioActionList"
          :model-value="ioActionToAdd"
          :add-button="true"
          @update:model-value="ioActionToAdd = $event"
          @input:add="addIoAction"
        >
          <template #help> Bitte eine Ein-/Ausgangs-Aktion auswählen, die hinzugefügt werden soll. </template>
        </openwb-base-select-input>
        <openwb-base-alert
          v-else
          subtype="warning"
        >
          Keine Ein-/Ausgangs-Geräte vorhanden!<br />
          Bitte füge zuerst ein Ein-/Ausgangs-Gerät hinzu, bevor Du Aktionen konfigurierst.
        </openwb-base-alert>
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
import OpenwbIoDeviceProxy from "../components/io_devices/OpenwbIoDeviceProxy.vue";
import OpenwbIoActionProxy from "../components/io_actions/OpenwbIoActionProxy.vue";

export default {
  name: "OpenwbIoConfigView",
  components: {
    FontAwesomeIcon,
    OpenwbIoDeviceProxy,
    OpenwbIoActionProxy,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["save", "reset", "defaults", "send-command"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/system/configurable/io_devices",
        "openWB/system/io/+/config",
        "openWB/system/configurable/io_actions",
        "openWB/io/action/+/config",
        "openWB/chargepoint/+/config",
        "openWB/system/device/+/component/+/config",
      ],
      showIoDeviceDeleteModal: false,
      modalIoDeviceIndex: undefined,
      ioDeviceToAdd: undefined,
      showIoActionDeleteModal: false,
      modalIoActionIndex: undefined,
      ioActionToAdd: undefined,
    };
  },
  computed: {
    ioDeviceList: {
      get() {
        return this.$store.state.mqtt["openWB/system/configurable/io_devices"];
      },
    },
    installedIoDevices: {
      get() {
        return this.getWildcardTopics("openWB/system/io/+/config");
      },
    },
    ioActionList: {
      get() {
        if (this.$store.state.mqtt["openWB/system/configurable/io_actions"] === undefined) {
          return [];
        }
        return Object.entries(this.$store.state.mqtt["openWB/system/configurable/io_actions"])
          .map(([groupKey, group]) => {
            return {
              label: group.group_name,
              options: group.actions
                .map((action) => {
                  return {
                    value: [groupKey, action.value],
                    text: action.text,
                  };
                })
                .sort((a, b) => a.text.localeCompare(b.text)),
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    },
    installedIoActions: {
      get() {
        return this.getWildcardTopics("openWB/io/action/+/config");
      },
    },
    installedChargePoints: {
      get() {
        return this.getWildcardTopics("openWB/chargepoint/+/config");
      },
    },
    installedComponents: {
      get() {
        return this.getWildcardTopics("openWB/system/device/+/component/+/config");
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
      this.$emit("send-command", {
        command: "addIoDevice",
        data: { type: this.ioDeviceToAdd },
      });
    },
    removeIoDeviceModal(ioDevice, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalIoDeviceIndex = parseInt(ioDevice.match(/(?:\/)(\d+)(?=\/)/)[1]);
      this.showIoDeviceDeleteModal = true;
    },
    removeIoDevice(ioDeviceIndex, event) {
      this.showIoDeviceDeleteModal = false;
      if (event == "confirm") {
        this.$emit("send-command", {
          command: "removeIoDevice",
          data: { id: ioDeviceIndex },
        });
      }
    },
    addIoAction() {
      this.$emit("send-command", {
        command: "addIoAction",
        data: { type: this.ioActionToAdd },
      });
    },
    removeIoActionModal(ioAction, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalIoActionIndex = parseInt(ioAction.match(/(?:\/)(\d+)(?=\/)/)[1]);
      this.showIoActionDeleteModal = true;
    },
    removeIoAction(ioActionIndex, event) {
      this.showIoActionDeleteModal = false;
      if (event == "confirm") {
        this.$emit("send-command", {
          command: "removeIoAction",
          data: { id: ioActionIndex },
        });
      }
    },
    sendSystemCommand(command, data) {
      this.$emit("send-command", {
        command: command,
        data: data,
      });
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
