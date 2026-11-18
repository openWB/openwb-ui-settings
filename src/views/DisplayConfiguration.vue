<template>
  <div class="optionalComponents">
    <form name="optionalComponentsForm">
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
              {
                label: 'Immer an',
                value: 0,
              },
            ]"
            @update:model-value="updateState('openWB/optional/int_display/standby', $event)"
          >
            <template #help>
              Hier kann eine Zeitspanne angegeben werden, nach der das Display ausgeschaltet wird.
            </template>
          </openwb-base-range-input>
        </div>
        <div v-if="isSecondary">
          <hr />
          <openwb-base-select-input
            title="Display-Quelle"
            :model-value="displayMode"
            :disabled="displayMode === undefined"
            not-selected="Bitte auswählen"
            :options="[
              { value: 'primary', text: 'Display der primary openWB' },
              { value: 'local', text: 'Lokal konfiguriertes Display' },
            ]"
            @update:model-value="updateState('openWB/general/extern_display_mode', $event)"
          >
            <template #help>
              "Display der primary openWB" verwendet das Theme und die Konfiguration der primary openWB. "Lokal
              konfiguriertes Display" verwendet das auf dieser secondary openWB gespeicherte Theme und dessen
              Konfiguration. Die Auswahl gilt auch für externe Browser, unabhängig vom integrierten Display. Sie ändert
              nur die Display-Weiterleitung, nicht die Lade- oder Modbus-Steuerung.
            </template>
          </openwb-base-select-input>
          <openwb-base-alert
            v-if="!displayModeKnown"
            subtype="warning"
          >
            <template v-if="displayMode === undefined">
              Die Display-Quelle wurde noch nicht geladen oder wird von dieser Core-Version nicht bereitgestellt. Es
              wird kein Wert automatisch gesetzt. Der Backend-Standard ist "primary".
            </template>
            <template v-else>
              Unbekannte Display-Quelle: {{ displayMode }}. Bitte eine unterstützte Quelle auswählen. Der gespeicherte
              Wert wird nicht automatisch geändert.
            </template>
          </openwb-base-alert>
          <openwb-base-alert
            v-if="displayMode === 'primary'"
            subtype="info"
          >
            Theme und Display-Konfiguration werden auf der primary openWB eingestellt. Das lokal gespeicherte Theme
            bleibt für eine spätere lokale Anzeige erhalten. Lokale Theme-Änderungen werden nur mit der Display-Quelle
            "Lokal konfiguriertes Display" gespeichert.
          </openwb-base-alert>
          <openwb-base-alert
            v-if="displayMode === 'local'"
            subtype="info"
          >
            Die folgenden Theme-Einstellungen gelten für diese secondary openWB. Das Theme wird über den Host dieser
            secondary geladen. Ladedaten der primary stehen dadurch in Cards/Colors nicht automatisch zur Verfügung.
          </openwb-base-alert>
          <openwb-base-alert subtype="info">
            Lokale Anzeige erfordert eine Core-Version mit Unterstützung für lokales Rendering auf secondary openWB.
            Ältere Versionen zeigen weiterhin das Display der primary an.<br />
            Wurde der Display-Browser bereits zur primary weitergeleitet, muss er gegebenenfalls neu gestartet oder an
            der Display-Einstiegsseite der secondary openWB erneut geöffnet werden. Ein Neuladen der Seite auf der
            primary reicht nicht aus.
          </openwb-base-alert>
        </div>
        <div v-if="isPrimary">
          <hr />
          <openwb-base-button-group-input
            title="Ladepunkte auf secondary openWB"
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
              Hiermit kann festgelegt werden, ob an angebundenen secondary openWB alle oder nur die jeweils lokalen
              Ladepunkte im Display der primary angezeigt werden sollen. Diese Einstellung wählt keine lokale
              Display-Anzeige auf der secondary aus.
            </template>
          </openwb-base-button-group-input>
          <openwb-base-alert
            subtype="info"
            class="mb-3"
          >
            <p>
              Wenn die <strong>Benutzerverwaltung</strong> aktiviert ist, werden nur die Ladepunkte angezeigt, für
              welche dem jeweiligen Display-Benutzer auch Zugriffsrechte gegeben wurden. Ebenfalls ist es möglich, dass
              bestimmte Daten von Wechselrichtern, Fahrzeugen, etc. nicht angezeigt werden, wenn der Benutzer hierfür
              keine Berechtigung besitzt.
            </p>
            <p>
              Bei aktivierter Benutzerverwaltung wird empfohlen, die Anzeige auf "Alle" Ladepunkte zu setzen, damit es
              nicht zu Überschneidungen zwischen diesen Einschränkungen kommt.
            </p>
            <p>
              Das <strong>integrierte Display</strong> einer openWB series2 oder standalone verwendet automatisch den
              Benutzer "Display-Intern". Für <strong>externe openWB</strong> im Steuerungsmodus "secondary" werden
              automatisch Benutzer mit dem Namen "Display-<i>IP</i>", wobei <i>IP</i> für die jeweilige IP-Adresse der
              secondary openWB steht, angelegt.
            </p>
          </openwb-base-alert>
        </div>
        <div v-if="showThemeSettings">
          <hr />
          <div v-if="themeSettingsReady">
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
          <openwb-base-alert
            v-else
            subtype="warning"
          >
            Die Theme-Konfiguration, die verfügbaren Themes oder die Einstellungen zur Benutzerverwaltung sind noch
            nicht vollständig geladen. Speichern ist erst mit vollständiger Konfiguration möglich.
          </openwb-base-alert>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="optionalComponentsForm"
        :save-disabled="showThemeSettings && !themeSettingsReady"
        @save="$emit('save', mqttTopicsToPublish)"
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
      mqttTopics: [
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/optional/int_display/active", writeable: true },
        { topic: "openWB/optional/int_display/on_if_plugged_in", writeable: true }, // not yet implemented!
        { topic: "openWB/optional/int_display/only_local_charge_points", writeable: true },
        { topic: "openWB/optional/int_display/rotation", writeable: true },
        { topic: "openWB/optional/int_display/standby", writeable: true },
        { topic: "openWB/optional/int_display/theme", writeable: true },
        { topic: "openWB/system/configurable/display_themes", writeable: false },
        { topic: "openWB/system/security/user_management_active", writeable: false },
        // Publish the complete theme before enabling local rendering.
        { topic: "openWB/general/extern_display_mode", writeable: true },
      ],
    };
  },
  computed: {
    isPrimary() {
      return this.$store.state.mqtt["openWB/general/extern"] === false;
    },
    isSecondary() {
      return this.$store.state.mqtt["openWB/general/extern"] === true;
    },
    displayMode() {
      return this.$store.state.mqtt["openWB/general/extern_display_mode"];
    },
    displayModeKnown() {
      return ["primary", "local"].includes(this.displayMode);
    },
    showThemeSettings() {
      return this.isPrimary || (this.isSecondary && this.displayMode === "local");
    },
    themeConfigurationLoaded() {
      const theme = this.$store.state.mqtt["openWB/optional/int_display/theme"];
      return (
        typeof theme?.type === "string" &&
        theme.type.length > 0 &&
        theme.configuration !== null &&
        typeof theme.configuration === "object" &&
        !Array.isArray(theme.configuration)
      );
    },
    themeSettingsReady() {
      return (
        this.themeConfigurationLoaded &&
        Array.isArray(this.displayThemeList) &&
        typeof this.$store.state.mqtt["openWB/system/security/user_management_active"] === "boolean"
      );
    },
    mqttTopicsToPublish() {
      return this.mqttTopics
        .filter(({ topic, writeable }) => {
          if (!writeable || this.$store.state.mqtt[topic] === undefined) {
            return false;
          }
          if (topic === "openWB/general/extern_display_mode") {
            return this.displayModeKnown;
          }
          if (topic === "openWB/optional/int_display/theme") {
            return this.showThemeSettings;
          }
          return true;
        })
        .map(({ topic }) => topic);
    },
    displayThemeList() {
      return this.$store.state.mqtt["openWB/system/configurable/display_themes"];
    },
    displayThemeGroupList() {
      let groups = [
        { label: "openWB", options: [] },
        { label: "Community", options: [] },
      ];
      this.displayThemeList?.forEach((theme) => {
        if (
          theme.defaults.userManagementSupported !== true &&
          this.$store.state.mqtt["openWB/system/security/user_management_active"] === true
        ) {
          // skip themes that do not support user management if user management is active, as they would cause issues in this case
          return;
        }
        if (theme.official === true) {
          groups[0].options.push(theme);
        } else {
          groups[1].options.push(theme);
        }
      });
      return groups.filter((group) => group.options.length > 0);
    },
  },
  methods: {
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
