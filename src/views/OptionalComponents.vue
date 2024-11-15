<template>
  <div class="optionalComponents">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Identifikation">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Weitere Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
            befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
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
              Die Identifikation kann zum Entsperren von Ladepunkten und/oder zur Zuordnung von Fahrzeugen genutzt
              werden und kann auf mehreren Wegen erfolgen:
              <ul>
                <li>
                  Über einen in der openWB verbauten RFID-Reader (optional, z.B. anhand des Lieferscheins prüfen).
                </li>
                <li>
                  Durch die automatische Erkennung an einer openWB Pro (muss in den Einstellungen aktiviert werden).
                </li>
                <li>Durch manuelle Eingabe einer ID am Display einer openWB.</li>
              </ul>
            </template>
          </openwb-base-button-group-input>
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
                Solange diese Seite geöffnet ist, werden alle erfassten ID-Tags in dieser Liste aufgeführt.
              </template>
            </openwb-base-textarea>
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-card title="Display (intern oder extern)">
        <openwb-base-button-group-input
          title="Integriertes Display"
          :model-value="$store.state.mqtt['openWB/optional/int_display/active']"
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
          @update:model-value="updateState('openWB/optional/int_display/active', $event)"
        >
          <template #help>
            Je nach Bestellung kann die openWB mit oder ohne Display geliefert worden sein. Auch die Variante
            "Standalone" bietet beide Optionen. Bitte prüfe zuerst die Hardwareausstattung deiner openWB (z.B.
            Lieferschein).
          </template>
        </openwb-base-button-group-input>
        <div v-if="$store.state.mqtt['openWB/optional/int_display/active'] == true">
          <openwb-base-button-group-input
            title="Orientierung"
            :model-value="$store.state.mqtt['openWB/optional/int_display/rotation']"
            :buttons="[
              {
                buttonValue: 0,
                text: '0°',
              },
              {
                buttonValue: 90,
                text: '90°',
              },
              {
                buttonValue: 180,
                text: '180°',
              },
              {
                buttonValue: 270,
                text: '270°',
              },
            ]"
            @update:model-value="updateState('openWB/optional/int_display/rotation', $event)"
          >
            <template #help>
              Mit dieser Einstellung kann das Display im Uhrzeigersinn gedreht werden, falls erforderlich. Nach einer
              Änderung ist ein Neustart erforderlich!<br />
              Diese Einstellung erfordert ein Raspberry Pi Display. Für eine openWB series2 mit integriertem Display
              muss 0° ausgewählt werden, für eine Standalone mit Display 180°. Anzeigen, welche über HDMI angeschlossen
              sind, werden nicht unterstützt.
            </template>
          </openwb-base-button-group-input>
          <hr />
          <openwb-base-heading> Display Standby </openwb-base-heading>
          <openwb-base-range-input
            title="Ausschaltzeit"
            :min="0"
            :max="12"
            :step="1"
            :model-value="$store.state.mqtt['openWB/optional/int_display/standby']"
            unit="Sek"
            :labels="[
              {
                label: 'Immer an',
                value: 0,
              },
              {
                label: 5,
                value: 5,
              },
              {
                label: 10,
                value: 10,
              },
              {
                label: 15,
                value: 15,
              },
              {
                label: 30,
                value: 30,
              },
              {
                label: 45,
                value: 45,
              },
              {
                label: '1 Min',
                value: 60,
              },
              {
                label: '1,5 Min',
                value: 90,
              },
              {
                label: '2 Min',
                value: 120,
              },
              {
                label: '3 Min',
                value: 180,
              },
              {
                label: '4 Min',
                value: 240,
              },
              {
                label: '5 Min',
                value: 300,
              },
              {
                label: '10 Min',
                value: 600,
              },
            ]"
            @update:model-value="updateState('openWB/optional/int_display/standby', $event)"
          >
            <template #help>
              Hier kann eine Zeitspanne angegeben werden, nach der das Display ausgeschaltet wird.
            </template>
          </openwb-base-range-input>
        </div>
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <hr />
          <openwb-base-alert subtype="info">
            Weitere Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
            befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <hr />
          <openwb-base-button-group-input
            title="Ladepunkte auf externen openWB"
            :model-value="$store.state.mqtt['openWB/optional/int_display/only_local_charge_points']"
            :buttons="[
              {
                buttonValue: false,
                text: 'Alle',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Nur Lokale',
                class: 'btn-outline-success',
              },
            ]"
            @update:model-value="updateState('openWB/optional/int_display/only_local_charge_points', $event)"
          >
            <template #help>
              Hiermit kann festgelegt werden, ob an angebundenen externen openWB alle oder nur die jeweils lokalen
              Ladepunkte angezeigt werden sollen.
            </template>
          </openwb-base-button-group-input>
          <hr />
          <div v-if="$store.state.mqtt['openWB/optional/int_display/theme'] !== undefined">
            <openwb-base-select-input
              class="mb-2"
              title="Theme des Displays"
              :groups="displayThemeGroupList"
              :model-value="$store.state.mqtt['openWB/optional/int_display/theme'].type"
              @update:model-value="updateSelectedDisplayTheme($event)"
            >
              <template #help>
                Hier können unterschiedliche Display-Anzeigen, s.g. Themes, ausgewählt werden. Die Anzahl der Themes
                wird sich mit zukünftigen Releases erhöhen.
              </template>
            </openwb-base-select-input>
            <openwb-display-theme-proxy
              v-if="$store.state.mqtt['openWB/optional/int_display/theme'].type"
              :display-theme="$store.state.mqtt['openWB/optional/int_display/theme']"
              @update:configuration="updateConfiguration('openWB/optional/int_display/theme', $event)"
            />
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
        "openWB/optional/led/active",
        "ToDo/optional/led/instant_blocked",
        "ToDo/optional/led/pv_blocked",
        "ToDo/optional/led/scheduled_blocked",
        "ToDo/optional/led/standby_blocked",
        "ToDo/optional/led/stop_blocked",
        "ToDo/optional/led/instant",
        "ToDo/optional/led/pv",
        "ToDo/optional/led/scheduled",
        "ToDo/optional/led/standby",
        "ToDo/optional/led/stop",
        "openWB/optional/int_display/active",
        "openWB/optional/int_display/standby",
        "openWB/optional/int_display/rotation",
        "openWB/optional/int_display/on_if_plugged_in",
        "openWB/optional/int_display/pin_active",
        "openWB/optional/int_display/pin_code",
        "openWB/optional/int_display/theme",
        "openWB/optional/int_display/only_local_charge_points",
        "openWB/system/configurable/display_themes",
        "openWB/optional/et/active",
        "openWB/optional/et/config/provider",
        "openWB/optional/et/config/max_price",
      ],
      tempIdTagList: {},
    };
  },
  computed: {
    idTagList() {
      return Object.values(this.updateIdTagList());
    },
    displayThemeList() {
      return this.$store.state.mqtt["openWB/system/configurable/display_themes"];
    },
    displayThemeGroupList() {
      let groups = [
        { label: "openWB", options: [] },
        { label: "Community", options: [] },
      ];
      this.displayThemeList.forEach((theme) => {
        if (theme.official === true) {
          groups[0].options.push(theme);
        } else {
          groups[1].options.push(theme);
        }
      });
      return groups;
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
    getDisplayThemeDefaults(displayThemeType) {
      const displayThemeDefaults = this.displayThemeList.find((element) => element.value == displayThemeType);
      if (Object.prototype.hasOwnProperty.call(displayThemeDefaults, "defaults")) {
        return {
          ...JSON.parse(JSON.stringify(displayThemeDefaults.defaults)),
        };
      }
      console.warn("no default configuration found for display theme type!", displayThemeType);
      return {};
    },
    updateSelectedDisplayTheme($event) {
      this.updateState("openWB/optional/int_display/theme", this.getDisplayThemeDefaults($event));
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
