<template>
  <div class="optionalComponents">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Identifikation">
        <openwb-base-button-group-input
          title="Identifikation aktivieren"
          :model-value="$store.state.mqtt['openWB/optional/rfid/active']"
          :buttons="[
            {
              buttonValue: false,
              text: 'Aus',
              class: 'btn-outline-danger',
            },
            {
              buttonValue: true,
              text: 'An',
              class: 'btn-outline-success',
            },
          ]"
          @update:model-value="updateState('openWB/optional/rfid/active', $event)"
        >
          <template #help>
            Die Identifikation kann zum Entsperren von Ladepunkten und/oder zur Zuordnung von Fahrzeugen genutzt werden
            und kann auf mehreren Wegen erfolgen:
            <ul>
              <li>Über einen in der openWB verbauten RFID-Reader (optional, z.B. anhand des Lieferscheins prüfen).</li>
              <li>
                Durch die automatische Erkennung an einer openWB Pro (muss in den Einstellungen aktiviert werden).
              </li>
              <li>Durch manuelle Eingabe einer ID am Display einer openWB.</li>
            </ul>
          </template>
        </openwb-base-button-group-input>
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Weitere Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
            befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true">
            <openwb-base-alert
              subtype="info"
              class="mb-1"
            >
              Es kann zuerst das Fahrzeug angesteckt und dann der ID-Tag erfasst werden oder andersherum. Wird der ID-Tag
              zuerst gescannt, muss innerhalb von 5 Minuten ein Fahrzeug angesteckt werden, sonst wird der ID-Tag verworfen.
            </openwb-base-alert>
            <openwb-base-textarea
              title="Erkannte ID-Tags"
              readonly
              disabled
              :model-value="idTagList.join('\n')"
            >
              <template #help>
                Solange diese Seite geöffnet ist, werden alle erfassten ID-Tags in dieser Liste aufgeführt. Bei der
                openWB Pro/Pro+ nur bei angestecktem Fahrzeug.
              </template>
            </openwb-base-textarea>
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-heading class="mt-0"> Entsperren von Ladepunkten (gekoppelt an Ladepunkt-Profil) </openwb-base-heading>
      <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true">
        <openwb-base-card
          title="Ladepunkt-Profile"
          :collapsible="true"
          :collapsed="true"
        >
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <div
              v-for="(chargePointTemplate, chargePointTemplateKey) in chargePointTemplates"
              :key="chargePointTemplateKey"
            >            
              <openwb-base-heading>
              {{chargePointTemplate.name + ' (ID: ' + getChargePointTemplateIndex(chargePointTemplateKey) + ')'}}
              </openwb-base-heading>
              <openwb-base-button-group-input
                title="Identifikation aktivieren"
                :buttons="[
                  {
                    buttonValue: false,
                    text: 'Nein',
                    class: 'btn-outline-danger',
                  },
                  {
                    buttonValue: true,
                    text: 'Ja',
                    class: 'btn-outline-success',
                  },
                ]"
                :model-value="chargePointTemplate.disable_after_unplug"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'disable_after_unplug')"
              >
                <template #help> Sperrt den Ladepunkt nach Abstecken eines Fahrzeuges. </template>
              </openwb-base-button-group-input>
              <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true && !installAssistantActive">
                <openwb-base-array-input
                  v-if="chargePointTemplate.disable_after_unplug"
                  title="Zugeordnete ID-Tags"
                  no-elements-message="Keine ID-Tags zugeordnet."
                  :model-value="chargePointTemplate.valid_tags"
                  @update:model-value="updateState(chargePointTemplateKey, $event, 'valid_tags')"
                >
                  <template #help>
                    Die hier eingetragenen ID-Tags dienen ausschließlich zum Entsperren des Ladepunktes.
                  </template>
                </openwb-base-array-input>
              </div>
            </div>
          </div>
        </openwb-base-card>
      </div>
      <div v-else>
        <openwb-base-alert subtype="info">
          Diese Option ist nur verfügbar, wenn Identifikation aktiviert ist.
        </openwb-base-alert>
      </div>
      <openwb-base-heading class="mt-0"> Zuordnung von Fahrzeugen </openwb-base-heading>
      <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true">

        <openwb-base-card
          subtype="info"
          :collapsible="true"
          :collapsed="$route.params.section != 'vehicle'"
        >
          <template #header>
            Fahrzeuge
          </template>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
          
            <div
              v-for="vehicleId in vehicleIndexes"
              :key="vehicleId"
              :title="getVehicleName(vehicleId)"
              :collapsible="true"
              :collapsed="!($route.params.section == 'vehicle' && parseInt($route.params.section_index) == vehicleId)"
              subtype="info"
            >
              <openwb-base-heading>
                {{$store.state.mqtt['openWB/vehicle/' + vehicleId + '/name']}}
              </openwb-base-heading>
              <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true && !installAssistantActive">
                <openwb-base-array-input
                  title="Zugeordnete ID-Tags"
                  :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/tag_id']"
                  @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/tag_id', $event)"
                >
                  <template #help>
                    Die hier eingetragenen ID-Tags dienen ausschließlich der Fahrzeugzuordnung.
                  </template>
                </openwb-base-array-input>
              </div>
            </div>
          </div>
        </openwb-base-card>
      </div>
      <div v-else>
        <openwb-base-alert subtype="info">
          Diese Option ist nur verfügbar, wenn Identifikation aktiviert ist.
        </openwb-base-alert>
      </div>
      <openwb-base-submit-buttons
        form-name="optionalComponentsForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbDisplayThemeProxy from "../components/display_themes/OpenwbDisplayThemeProxy.vue";

export default {
  name: "OpenwbOptionalComponentsView",
  components: { OpenwbDisplayThemeProxy },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/chargepoint/+/config",
        "openWB/chargepoint/+/get/rfid",
        "openWB/chargepoint/+/get/rfid_timestamp",
        "openWB/chargepoint/+/set/rfid",
        "openWB/optional/rfid/active",
        "openWB/chargepoint/+/config",
        "openWB/chargepoint/template/+",

        "openWB/optional/dc_charging",
        "openWB/optional/et/provider",
        "openWB/vehicle/template/ev_template/+",
        "openWB/vehicle/template/charge_template/+",
        "openWB/vehicle/template/charge_template/+/chargemode/scheduled_charging/plans/+",
        "openWB/vehicle/template/charge_template/+/time_charging/plans/+",
        "openWB/vehicle/+/name",
        "openWB/vehicle/+/info",
        "openWB/vehicle/+/charge_template",
        "openWB/vehicle/+/ev_template",
        "openWB/vehicle/+/tag_id",
        "openWB/system/configurable/soc_modules",
        "openWB/vehicle/+/soc_module/general_config",
        "openWB/vehicle/+/soc_module/config",
      ],
      tempIdTagList: {},
    };
  },
  computed: {
    idTagList() {
      return Object.values(this.updateIdTagList());
    },
    chargePointTemplates: {
      get() {
        return this.getWildcardTopics("openWB/chargepoint/template/+");
      },
    },
    
    dcChargingEnabled: {
      get() {
        return this.$store.state.mqtt["openWB/optional/dc_charging"];
      },
    },
    vehicleIndexes: {
      get() {
        return this.getWildcardIndexList("openWB/vehicle/+/name");
      },
    },
    evTemplates: {
      get() {
        return this.getWildcardTopics("openWB/vehicle/template/ev_template/+");
      },
    },
    evTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.evTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)$/g)[0]);
          let name = this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
      },
    },
    chargeTemplates: {
      get() {
        return this.getWildcardTopics("openWB/vehicle/template/charge_template/+");
      },
    },
    chargeTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.chargeTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)$/g)[0]);
          let name = this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
      },
    },
    socModuleList: {
      get() {
        return this.$store.state.mqtt["openWB/system/configurable/soc_modules"];
      },
    },
  },
  methods: {
    getIdFromTopic(topic) {
      return topic.match(/(?:\/)([0-9]+)(?=\/)*/g)[0].replace(/[^0-9]+/g, "");
    },
    updateIdTagList() {
      Object.entries(
        // get all id-tag topics/values
        this.getWildcardTopics("^openWB/chargepoint/[^+/]+/[gs]et/rfid$", true),
      ).forEach((entry) => {
        if (entry[1] !== null) {
          this.tempIdTagList[entry[1]] = `${entry[1]} (${
            entry[0].includes("/set/") ? "zugewiesen" : "erfasst"
          } an ${this.getChargePointName(this.getIdFromTopic(entry[0]))})`;
        }
      });
      return this.tempIdTagList;
    },
    getChargePointName(chargePointIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"]
        ? this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"].name
        : "Ladepunkt " + chargePointIndex;
    },
    getChargePointTemplateIndex(chargePointTemplate) {
      // get trailing characters as index
      return parseInt(chargePointTemplate.match(/([^/]+)$/)[0]);
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },

    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
    /* vehicle management */
    addVehicle(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addVehicle",
        data: {},
      });
    },
    removeVehicleModal(event, vehicleIndex) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalVehicleIndex = vehicleIndex;
      this.showVehicleModal = true;
    },
    removeVehicle(event, vehicleIndex) {
      this.showVehicleModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeVehicle",
          data: { id: vehicleIndex },
        });
      }
    },
    getVehicleName(id) {
      return this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        ? this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        : "Fahrzeug " + id;
    },
    getSocDefaultConfiguration(socType) {
      const socDefaults = this.socModuleList.find((element) => element.value == socType);
      if (Object.prototype.hasOwnProperty.call(socDefaults, "defaults")) {
        return { ...JSON.parse(JSON.stringify(socDefaults.defaults)) };
      }
      console.warn("no default configuration found for soc type!", socType);
      return {};
    },
    updateSelectedSocModule(vehicleId, $event) {
      this.updateState("openWB/vehicle/" + vehicleId + "/soc_module/config", $event, "type");
      this.updateState("openWB/vehicle/" + vehicleId + "/soc_module/config", this.getSocDefaultConfiguration($event));
    },
    /* ev template management */
    addEvTemplate(event, keyToCopy) {
      // prevent further processing of the click event
      event.stopPropagation();
      let data = {};
      // if keyToCopy is set, parse the id from the key
      if (keyToCopy && keyToCopy.match(/([^/]+)$/)) {
        data.copy = parseInt(keyToCopy.match(/([^/]+)$/)[0]);
      }
      // emit the command to add an ev template
      this.$emit("sendCommand", {
        command: "addEvTemplate",
        data: data,
      });
    },
    removeEvTemplateModal(event, evTemplate) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalEvTemplateIndex = parseInt(evTemplate.match(/([^/]+)$/)[0]);
      this.showEvTemplateModal = true;
    },
    removeEvTemplate(event, evTemplateIndex) {
      this.showEvTemplateModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeEvTemplate",
          data: { id: evTemplateIndex },
        });
      }
    },
    getEvTemplateName(id) {
      return this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + id]
        ? this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + id].name
        : "Fahrzeug-Profil " + id;
    },
    /* charge template management */
    addChargeTemplate(event, keyToCopy) {
      // prevent further processing of the click event
      event.stopPropagation();
      let data = {};
      // if keyToCopy is set, parse the id from the key
      if (keyToCopy && keyToCopy.match(/([^/]+)$/)) {
        data.copy = parseInt(keyToCopy.match(/([^/]+)$/)[0]);
      }
      // emit the command to add a charge template
      this.$emit("sendCommand", {
        command: "addChargeTemplate",
        data: data,
      });
    },
    removeChargeTemplateModal(event, chargeTemplateId) {
      this.modalChargeTemplateIndex = chargeTemplateId;
      this.showChargeTemplateModal = true;
    },
    removeChargeTemplate(event, chargeTemplateIndex) {
      this.showChargeTemplateModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargeTemplate",
          data: { id: chargeTemplateIndex },
        });
      }
    },
    getChargeTemplateName(id) {
      return this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + id]
        ? this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + id].name
        : "Lade-Profil " + id;
    },
    /* charge template schedule plan management */
    addChargeTemplateSchedulePlan(templateId) {
      this.$emit("sendCommand", {
        command: "addChargeTemplateSchedulePlan",
        data: { template: templateId },
      });
    },
    /* charge template time charging plan management */
    addChargeTemplateTimeChargingPlan(templateId) {
      this.$emit("sendCommand", {
        command: "addChargeTemplateTimeChargingPlan",
        data: { template: templateId },
      });
    },
  },
};
</script>
