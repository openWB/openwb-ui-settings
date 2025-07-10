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
              Die ID-Tags müssen in den Einstellungen der Fahrzeuge diesen zugeordnet werden.<br />
              Es kann zuerst das Fahrzeug angesteckt und dann der ID-Tag erfasst werden oder andersherum. Im letzten
              Fall muss innerhalb von 5 Minuten ein Fahrzeug angesteckt werden, sonst wird der ID-Tag verworfen.<br />
              <span v-html="$store.state.text.rfidWiki" />
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
        "openWB/chargepoint/template/+/autolock/+",
        "openWB/system/configurable/chargepoints",
        "openWB/system/configurable/chargepoints_internal",
      ],
      tempIdTagList: {},
    };
  },
  computed: {
    idTagList() {
      return Object.values(this.updateIdTagList());
    },
    installedChargePoints: {
      get() {
        // only show internal chargepoint(s) when configured as external chargepoint
        let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
        let myObj = {};
        for (const [key, element] of Object.entries(chargePoints)) {
          if (element.type === "internal_openwb" || this.$store.state.mqtt["openWB/general/extern"] === false) {
            myObj[key] = element;
          }
        }
        return myObj;
      },
    },
    chargePointTemplates: {
      get() {
        return this.getWildcardTopics("openWB/chargepoint/template/+");
      },
    },
    chargePointTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.chargePointTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)/g)[0]);
          let name = this.$store.state.mqtt["openWB/chargepoint/template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
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
    addChargePoint() {
      this.$emit("sendCommand", {
        command: "addChargepoint",
        data: { type: this.chargePointToAdd },
      });
    },
    removeChargePointModal(chargePoint, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointIndex = parseInt(chargePoint.match(/(?:\/)(\d+)(?=\/)/)[1]);
      this.showChargePointModal = true;
    },
    removeChargePoint(chargePointIndex, event) {
      this.showChargePointModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargepoint",
          data: { id: chargePointIndex },
        });
      }
    },
    getChargePointList() {
      if (this.$store.state.mqtt["openWB/general/extern"] === false) {
        return this.$store.state.mqtt["openWB/system/configurable/chargepoints"];
      } else {
        return this.$store.state.mqtt["openWB/system/configurable/chargepoints_internal"];
      }
    },
    getChargePointName(chargePointIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"]
        ? this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"].name
        : "Ladepunkt " + chargePointIndex;
    },
    getChargePointTemplateName(chargePointTemplateIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/template/" + chargePointTemplateIndex]
        ? this.$store.state.mqtt["openWB/chargepoint/template/" + chargePointTemplateIndex].name
        : "Profil " + chargePointTemplateIndex;
    },
    addChargePointTemplate(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addChargepointTemplate",
        data: {},
      });
    },
    getChargePointTemplateIndex(chargePointTemplate) {
      // get trailing characters as index
      return parseInt(chargePointTemplate.match(/([^/]+)$/)[0]);
    },
    removeChargePointTemplateModal(chargePointTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.showChargePointTemplateModal = true;
    },
    removeChargePointTemplate(chargePointTemplateIndex, event) {
      this.showChargePointTemplateModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargepointTemplate",
          data: { id: chargePointTemplateIndex },
        });
      }
    },
    addChargePointTemplateAutolockPlan(chargePointTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      let chargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.$emit("sendCommand", {
        command: "addAutolockPlan",
        data: { template: chargePointTemplateIndex },
      });
    },
    removeChargePointTemplateAutolockPlanModal(chargePointTemplate, autolockPlan, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.modalChargePointTemplateAutolockPlanIndex = parseInt(autolockPlan.match(/([^/]+)$/)[0]);
      this.showChargePointTemplateAutolockPlanModal = true;
    },
    removeChargePointTemplateAutolockPlan(chargePointTemplateIndex, autolockPlanIndex, event) {
      this.showChargePointTemplateAutolockPlanModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeAutolockPlan",
          data: {
            template: chargePointTemplateIndex,
            plan: autolockPlanIndex,
          },
        });
      }
    },
    getChargePointTemplateAutolockPlanName(templateIndex, planIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/template/" + templateIndex + "/autolock/" + planIndex]
        ? this.$store.state.mqtt["openWB/chargepoint/template/" + templateIndex + "/autolock/" + planIndex].name
        : "Autolock Zeitplan " + templateIndex + "/" + planIndex;
    },
    getChargePointTemplateAutolockPlans(chargePointTemplate) {
      let chargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      let result = this.getWildcardTopics("openWB/chargepoint/template/" + chargePointTemplateIndex + "/autolock/+");
      return result;
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
