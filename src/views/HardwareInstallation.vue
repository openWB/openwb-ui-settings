<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showDeviceRemoveModal"
    title="Gerät löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeDevice"
  >
    Wollen Sie das Gerät "{{ modalDeviceName }}" inklusive aller Komponenten wirklich entfernen? Dieser Vorgang kann
    nicht rückgängig gemacht werden!
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
  <div class="hardwareInstallation">
    <form name="hardwareInstallationForm">
      <openwb-base-alert
        v-if="!installAssistantActive"
        subtype="info"
      >
        Wenn neue Komponenten - insbesondere Zähler - konfiguriert wurden, ist auch das
        <router-link to="/LoadManagementConfiguration"> Lastmanagement </router-link>
        zu prüfen!<br />
        Je nach Hersteller muss eventuell die Kommunikation im Wechselrichter freigegeben werden (z.B. Aktivierung
        Modbus TCP, Portfreigaben o.Ä.)
      </openwb-base-alert>
      <openwb-base-card title="Geräte und Komponenten">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-card
            v-for="(installedDevice, installedDeviceKey) in installedDevices"
            :key="installedDeviceKey"
            :collapsible="true"
            :collapsed="true"
            subtype="dark"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'network-wired']" />
              {{ installedDevice?.name }}
            </template>
            <template #actions="slotProps">
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeDeviceModal(installedDevice?.id, installedDevice?.name, $event)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </openwb-base-avatar>
              <div v-else>
                <openwb-base-avatar
                  v-for="installedComponent in getMyInstalledComponents(installedDevice?.id)"
                  :key="installedComponent.id"
                  :class="'ml-1 bg-' + getComponentTypeClass(installedComponent.type)"
                >
                  <font-awesome-icon :icon="getComponentTypeIcon(installedComponent.type)" />
                </openwb-base-avatar>
              </div>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              subtype="text"
              :model-value="installedDevice?.name"
              @update:model-value="updateState(installedDeviceKey, $event, 'name')"
            />
            <hr />
            <openwb-config-proxy
              :device="installedDevice"
              @update:configuration="updateConfiguration(installedDeviceKey, $event)"
            />
            <hr />
            <openwb-base-heading>Komponenten</openwb-base-heading>
            <openwb-base-alert
              v-if="!deviceHasConfiguredComponents(installedDevice?.id)"
              subtype="warning"
            >
              Es wurden noch keine Komponenten zu diesem Gerät angelegt.
            </openwb-base-alert>
            <openwb-base-card
              v-for="(installedComponent, installedComponentKey) in getMyInstalledComponents(installedDevice.id)"
              :key="installedComponent.id"
              :collapsible="true"
              :collapsed="true"
              :subtype="getComponentTypeClass(installedComponent.type)"
            >
              <template #header>
                <font-awesome-icon :icon="getComponentTypeIcon(installedComponent.type)" />
                {{ installedComponent.name }}
              </template>
              <template #actions="slotProps">
                <openwb-base-avatar
                  v-if="!slotProps.collapsed"
                  class="bg-danger clickable"
                  @click="
                    removeComponentModal(
                      installedDevice.id,
                      installedComponent.id,
                      installedComponent.type,
                      installedComponent.name,
                      $event,
                    )
                  "
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </openwb-base-avatar>
              </template>
              <openwb-base-text-input
                title="Bezeichnung"
                subtype="text"
                :model-value="installedComponent.name"
                @update:model-value="updateState(installedComponentKey, $event, 'name')"
              >
                <template #append>
                  <openwb-base-color-picker
                    class="p-1"
                    :model-value="installedComponent?.color"
                    :default-color="getComponentDefaultColor(installedComponent?.type)"
                    @update:model-value="updateState(installedComponent, $event, 'color')"
                  />
                </template>
              </openwb-base-text-input>
              <openwb-base-text-input
                title="Hersteller"
                subtype="text"
                :model-value="installedComponent.info.manufacturer"
                @update:model-value="updateState(installedComponentKey, $event, 'info.manufacturer')"
              >
                <template #help> Optional: zusätzliche Information für den Systembericht. </template>
              </openwb-base-text-input>
              <openwb-base-text-input
                title="Modell"
                subtype="text"
                :model-value="installedComponent.info.model"
                @update:model-value="updateState(installedComponentKey, $event, 'info.model')"
              >
                <template #help> Optional: zusätzliche Information für den Systembericht. </template>
              </openwb-base-text-input>
              <hr />
              <openwb-config-proxy
                :device="installedDevice"
                :component="installedComponent"
                @update:configuration="updateConfiguration(installedComponentKey, $event)"
              />
            </openwb-base-card>
            <hr />
            <openwb-base-select-input
              v-if="getComponentList(installedDevice.vendor, installedDevice.type).length"
              title="Verfügbare Komponenten"
              not-selected="Bitte auswählen"
              :options="getComponentList(installedDevice.vendor, installedDevice.type)"
              :model-value="componentToAdd[installedDevice.id]"
              :add-button="true"
              @update:model-value="componentToAdd[installedDevice.id] = $event"
              @input:add="
                addComponent(
                  installedDevice.id,
                  installedDevice.vendor,
                  installedDevice.type,
                  componentToAdd[installedDevice.id],
                )
              "
            >
              <template #help>
                Bitte eine Komponente auswählen, die hinzugefügt werden soll. Für jeden Datensatz, z.B. Wechselrichter-
                und Batteriedaten, muss eine Wechselrichter- und eine Batteriekomponente hinzugefügt werden.
              </template>
            </openwb-base-select-input>
            <openwb-base-alert
              v-else
              subtype="info"
            >
              Dieses System bietet keine Komponenten zur Installation an.
            </openwb-base-alert>
          </openwb-base-card>
          <hr v-if="Object.keys(installedDevices).length > 0" />
          <openwb-base-select-input
            v-model="selectedVendor"
            title="Hersteller"
            not-selected="Bitte auswählen"
            :groups="vendorList"
          />
          <openwb-base-select-input
            v-model="deviceToAdd"
            title="Verfügbare Geräte"
            not-selected="Bitte auswählen"
            :disabled="selectedVendor === undefined"
            :options="deviceList"
            :model-value="deviceToAdd"
            :add-button="true"
            @update:model-value="deviceToAdd = $event"
            @input:add="addDevice"
          >
            <template #help>
              <p>
                Die openWB-Regelung ist auf Werte von Messpunkten (Zähler, Energy Meter usw.) angewiesen. Hierfür werden
                "Geräte" und "Komponenten" verwendet.<br />
                Ein "Gerät" wird hierbei durch seine Verbindungseinstellungen (z.B. IP-Adresse) spezifiziert (häufig
                durch manuelle Eingabe oder manchmal automatisch ermittelt) und kann über mehrere untergeordnete
                "Komponenten" verfügen, z.B. einen Messpunkt für PV-Erzeugung, einen Messpunkt für
                Netzeinspeisung/-bezug am EVU-Punkt usw.. Ein "Gerät" bedingt somit immer mindestens eine zugehörige
                "Komponente".
              </p>
              <p>
                Bsp: Werden die Werte von verschiedenen Messpunkten (z.B. PV und EVU) über die gleiche IP-Adresse
                abgefragt, wird dafür ein "Gerät" mit zwei "Komponenten" für PV- und EVU- Messpunkt angelegt.<br />
                Verfügt dagegen jeder Messpunkt über eine eigene IP-Adresse, wird jeder Messpunkt als eigenes "Gerät"
                mit nur einer "Komponente" angelegt.
              </p>
              <p>
                Das "Gerät" wird in der Dropdown-Liste ausgewählt und mit "+" der Regelung hinzugefügt. Im Anschluss
                erfolgt die Konfiguration des "Gerätes" innerhalb des schwarzen "Geräte"-Reiters.
              </p>
            </template>
          </openwb-base-select-input>
        </div>
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="hardwareInstallationForm"
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
  faPlus as fasPlus,
  faTrash as fasTrash,
  faNetworkWired as fasNetworkWired,
  faMicrochip as fasMicrochip,
  faCarBattery as fasCarBattery,
  faSolarPanel as fasSolarPanel,
  faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasNetworkWired, fasMicrochip, fasTrash, fasCarBattery, fasSolarPanel, fasGaugeHigh);

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbConfigProxy from "../components/devices/OpenwbConfigProxy.vue";

export default {
  name: "OpenwbHardwareInstallationView",
  components: {
    FontAwesomeIcon,
    OpenwbConfigProxy,
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
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/counter/get/hierarchy",
        "openWB/system/device/+/config",
        "openWB/system/device/+/component/+/config",
        "openWB/system/configurable/devices_components",
      ],
      selectedVendor: undefined,
      deviceToAdd: undefined,
      showDeviceRemoveModal: false,
      modalDevice: undefined,
      modalDeviceName: "",
      componentToAdd: [],
      showComponentRemoveModal: false,
      modalComponent: undefined,
      modalComponentName: "",
    };
  },
  computed: {
    installedDevices: {
      get() {
        return this.getWildcardTopics("openWB/system/device/+/config");
      },
    },
    installedComponents: {
      get() {
        return this.getWildcardTopics("openWB/system/device/+/component/+/config");
      },
    },
    vendorList: {
      get() {
        if (this.$store.state.mqtt["openWB/system/configurable/devices_components"] === undefined) {
          return [];
        }
        return Object.entries(this.$store.state.mqtt["openWB/system/configurable/devices_components"])
          .map(([groupKey, group]) => {
            return {
              label: group.group_name,
              options: Object.entries(group.vendors)
                .map(([vendorKey, vendor]) => {
                  return {
                    value: [groupKey, vendorKey],
                    text: vendor.vendor_name,
                  };
                })
                .sort((a, b) => a.text.localeCompare(b.text)),
            };
          })
          .sort((a, b) => -a.label.localeCompare(b.label)); // reverse order to have "openWB" at the top
      },
    },
    deviceList: {
      get() {
        if (this.selectedVendor === undefined) {
          return [];
        }
        let [groupKey, vendorKey] = this.selectedVendor;
        return Object.entries(
          this.$store.state.mqtt["openWB/system/configurable/devices_components"][groupKey].vendors[vendorKey].devices,
        )
          .map(([deviceKey, device]) => {
            return {
              value: [vendorKey, deviceKey],
              text: device.device_name,
            };
          })
          .sort((a, b) => a.text.localeCompare(b.text));
      },
    },
  },
  methods: {
    getComponentTypeClass(type) {
      if (type.match(/^(.+_)?counter(_.+)?$/)) {
        return "danger";
      }
      if (type.match(/^(.+_)?inverter(_.+)?$/)) {
        return "success";
      }
      if (type.match(/^(.+_)?bat(_.+)?$/)) {
        return "warning";
      }
      return "dark";
    },
    getComponentDefaultColor(type) {
      if (type.match(/^(.+_)?counter(_.+)?$/)) {
        return "#dc3545";
      }
      if (type.match(/^(.+_)?inverter(_.+)?$/)) {
        return "#28a745";
      }
      if (type.match(/^(.+_)?bat(_.+)?$/)) {
        return "#ffc107";
      }
      return undefined;
    },
    getComponentTypeIcon(type) {
      if (type.match(/^(.+_)?counter(_.+)?$/)) {
        return ["fas", "fa-gauge-high"];
      }
      if (type.match(/^(.+_)?inverter(_.+)?$/)) {
        return ["fas", "fa-solar-panel"];
      }
      if (type.match(/^(.+_)?bat(_.+)?$/)) {
        return ["fas", "fa-car-battery"];
      }
      return ["fas", "fa-microchip"];
    },
    getMyInstalledComponents(deviceId) {
      return this.getWildcardTopics("openWB/system/device/" + deviceId + "/component/+/config");
    },
    deviceHasConfiguredComponents(deviceId) {
      return Object.keys(this.getMyInstalledComponents(deviceId)).length > 0;
    },
    addDevice() {
      this.$emit("sendCommand", {
        command: "addDevice",
        data: {
          vendor: this.deviceToAdd[0],
          type: this.deviceToAdd[1],
        },
      });
    },
    removeDeviceModal(index, name, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalDevice = index;
      this.modalDeviceName = name;
      this.showDeviceRemoveModal = true;
    },
    removeDevice(event) {
      this.showDeviceRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeDevice",
          data: { id: this.modalDevice },
        });
      }
    },
    addComponent(deviceId, deviceVendor, deviceType, componentType) {
      this.$emit("sendCommand", {
        command: "addComponent",
        data: {
          deviceId: deviceId,
          deviceType: deviceType,
          deviceVendor: deviceVendor,
          type: componentType,
        },
      });
    },
    removeComponentModal(deviceId, componentId, componentType, componentName, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalComponent = {
        deviceId: deviceId,
        id: componentId,
        type: componentType,
      };
      this.modalComponentName = componentName;
      this.showComponentRemoveModal = true;
    },
    removeComponent(event) {
      this.showComponentRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeComponent",
          data: this.modalComponent,
        });
      }
    },
    getComponentList(vendorKey, deviceKey) {
      if (vendorKey === undefined || deviceKey === undefined) {
        return [];
      }
      let deviceComponents = [];
      Object.values(this.$store.state.mqtt["openWB/system/configurable/devices_components"]).every((group) => {
        if (group.vendors[vendorKey] !== undefined) {
          if (group.vendors[vendorKey].devices[deviceKey] !== undefined) {
            let components = Object.entries(group.vendors[vendorKey].devices[deviceKey].components).map(
              ([componentKey, component]) => {
                return {
                  value: componentKey,
                  text: component.component_name,
                };
              },
            );
            deviceComponents = components;
          }
          return false;
        }
        return true;
      });
      return deviceComponents;
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
