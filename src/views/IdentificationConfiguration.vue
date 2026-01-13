<template>
  <div class="optionalComponents">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Identifikation">
        <openwb-base-alert subtype="info">
          <p>
            Eine ausführliche Anleitung findest Du hier:
            <a
              href="https://wiki.openwb.de/doku.php?id=openwb:vc:2.1.9:software:einstell-konfig:einstellungen:identifikation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wiki-Beitrag zur Identifikation
            </a>
          </p>
          Die Identifikation kann zum Entsperren von Ladepunkten und/oder zur Zuordnung von Fahrzeugen genutzt werden
          und kann auf mehreren Wegen erfolgen:
          <ul>
            <li>Über einen RFID-Reader (optional in der openWB verbaut, z.B. anhand des Lieferscheins prüfen).</li>
            <li>
              Durch die automatische Fahrzeugerkennung der openWB Pro/ Pro+ (in den Einstellungen der openWB Pro
              aktivieren).
            </li>
            <li>Durch manuelle Eingabe einer ID an einer openWB mit Display.</li>
          </ul>
          <p>Bei openWB Pro/Pro+ werden RFID-Tags nur bei angestecktem Fahrzeug erfasst!</p>
          <p>
            Für die Erkennung kann auch ein Muster (mittels Wildcards) hinterlegt werden. Ein Fragezeichen (?)
            entspricht dabei einem Zeichen, ein Stern (*) beliebig vielen Zeichen. So ist bspw. die Erkennung von
            Fahrzeugen mit wechselnder ID (u.a. Fahrzeuge der VW Gruppe) möglich.<br />
            Es wird davon abgeraten, Muster für die Entsperrung von öffentlich zugänglichen Ladepunkten zu nutzen, um
            unbefugten Zugriff zu vermeiden.
          </p>
        </openwb-base-alert>
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
        />
        <openwb-base-alert
          v-if="$store.state.mqtt['openWB/general/extern'] === true"
          subtype="info"
          class="mt-3"
        >
          Weitere Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
        </openwb-base-alert>
        <openwb-base-textarea
          v-else-if="$store.state.mqtt['openWB/optional/rfid/active'] === true"
          title="Erkannte ID-Tags"
          readonly
          disabled
          :model-value="idTagList.join('\n')"
        />
      </openwb-base-card>
      <openwb-base-heading> Entsperren von Ladepunkten (gekoppelt an Ladepunkt-Profil) </openwb-base-heading>
      <openwb-base-card
        title="Ladepunkt-Profile"
        :collapsible="true"
        :collapsed="true"
      >
        <openwb-base-alert
          v-if="$store.state.mqtt['openWB/general/extern'] === true"
          subtype="info"
        >
          Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
          befindet.<br />
          Die Konfiguration zum Entsperren von Ladepunkten bitte auf der "primary" openWB durchführen.
        </openwb-base-alert>
        <openwb-base-alert
          v-else-if="$store.state.mqtt['openWB/optional/rfid/active'] === false"
          subtype="info"
        >
          Diese Einstellungen sind nur verfügbar, wenn Identifikation aktiviert ist.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-alert subtype="info">
            Hier zugeordnete ID-Tags entsperren beim Scannen das jeweilige Ladepunkt-Profil. Der ID-Tag kann an jedem
            Ladepunkt genutzt werden, dem das entsprechende Ladepunkt-Profil zugeordnet wurde.
          </openwb-base-alert>
          <div
            v-for="(chargePointTemplate, chargePointTemplateKey) in chargePointTemplates"
            :key="chargePointTemplateKey"
          >
            <hr v-if="getChargePointTemplateIndex(chargePointTemplateKey) != 0" />
            <openwb-base-heading class="mt-0">
              {{ chargePointTemplate.name }}
            </openwb-base-heading>
            <openwb-base-array-input
              v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true"
              title="Zugeordnete ID-Tags"
              :no-elements-message="'&quot;' + chargePointTemplate.name + '&quot; sind keine ID-Tags zugeordnet.'"
              pattern="^[^\s].*[^\s]$"
              :model-value="chargePointTemplate.valid_tags"
              @update:model-value="updateState(chargePointTemplateKey, $event, 'valid_tags')"
            />
            <openwb-base-button-group-input
              title="Sperre nach Abstecken"
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
              <template #help>
                Ist "Sperre nach Abstecken" aktiviert, wird der Ladepunkt mit Ladepunkt-Profil "{{
                  chargePointTemplate.name
                }}" nach Abstecken eines Fahrzeugs automatisch gesperrt. Ist die Funktion deaktiviert, bleibt der
                Ladepunkt entsperrt.
              </template>
            </openwb-base-button-group-input>
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-heading> Zuordnung von Fahrzeugen </openwb-base-heading>
      <openwb-base-card
        title="Fahrzeuge"
        subtype="info"
        :collapsible="true"
        :collapsed="true"
      >
        <openwb-base-alert
          v-if="$store.state.mqtt['openWB/general/extern'] === true"
          subtype="info"
        >
          Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
          befindet.<br />
          Die Konfiguration zur Fahrzeugzuordnung bitte auf der "primary" openWB durchführen.
        </openwb-base-alert>
        <openwb-base-alert
          v-else-if="$store.state.mqtt['openWB/optional/rfid/active'] === false"
          subtype="info"
        >
          Diese Einstellungen sind nur verfügbar, wenn Identifikation aktiviert ist.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-alert subtype="info">
            Hier zugeordnete ID-Tags weisen dem Ladepunkt beim Scannen automatisch das jeweilige Fahrzeug zu. Ist bei
            Scannen des ID-Tags noch kein Fahrzeug angeschlossen muss dies zeitnah erfolgen, da der ID-Tag nach 5
            Minuten verworfen wird.
          </openwb-base-alert>
          <div
            v-for="vehicleId in vehicleIndexes"
            :key="vehicleId"
          >
            <hr v-if="vehicleId != vehicleIndexes[0]" />
            <openwb-base-heading class="mt-0">
              {{ $store.state.mqtt["openWB/vehicle/" + vehicleId + "/name"] }}
            </openwb-base-heading>
            <openwb-base-array-input
              v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true"
              title="Zugeordnete ID-Tags"
              :no-elements-message="
                '&quot;' +
                $store.state.mqtt['openWB/vehicle/' + vehicleId + '/name'] +
                '&quot; sind keine ID-Tags zugeordnet.'
              "
              pattern="^[^\s].*[^\s]$"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/tag_id']"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/tag_id', $event)"
            />
            <openwb-base-button-group-input
              v-if="vehicleId != 0"
              title="Standard-Fahrzeug nach Abstecken zuordnen"
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
              :model-value="
                $store.state.mqtt[
                  'openWB/vehicle/template/charge_template/' +
                    $store.state.mqtt['openWB/vehicle/' + vehicleId + '/charge_template']
                ].load_default
              "
              @update:model-value="
                updateState(
                  'openWB/vehicle/template/charge_template/' +
                    $store.state.mqtt['openWB/vehicle/' + vehicleId + '/charge_template'],
                  $event,
                  'load_default',
                )
              "
            >
              <template #help>
                Ist diese Option aktiviert, wird am Ladepunkt nach Abstecken auf das Standard-Fahrzeug zurückgesetzt.
                Die Option ist im Lade-Profil "{{
                  $store.state.mqtt[
                    "openWB/vehicle/template/charge_template/" +
                      $store.state.mqtt["openWB/vehicle/" + vehicleId + "/charge_template"]
                  ].name
                }}" gespeichert.<br />
                "Standard-Fahrzeug nach Abstecken" ist für alle Fahrzeuge
                {{
                  $store.state.mqtt[
                    "openWB/vehicle/template/charge_template/" +
                      $store.state.mqtt["openWB/vehicle/" + vehicleId + "/charge_template"]
                  ].load_default === true
                    ? "aktiviert"
                    : "deaktiviert"
                }}
                , denen dieses Lade-Profil zugeordnet wurde.
              </template>
            </openwb-base-button-group-input>
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

export default {
  name: "IdentificationConfigView",
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/chargepoint/+/config",
        "openWB/chargepoint/+/get/rfid",
        "openWB/chargepoint/+/get/vehicle_id",
        "openWB/chargepoint/+/get/rfid_timestamp",
        "openWB/chargepoint/+/set/rfid",
        "openWB/optional/rfid/active",
        "openWB/chargepoint/template/+",
        "openWB/vehicle/template/charge_template/+",
        "openWB/vehicle/+/name",
        "openWB/vehicle/+/charge_template",
        "openWB/vehicle/+/tag_id",
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
    vehicleIndexes: {
      get() {
        return this.getWildcardIndexList("openWB/vehicle/+/name");
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
        this.getWildcardTopics("^openWB/chargepoint/[^+/]+/[gs]et/(rfid|vehicle_id)$", true),
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
    /* vehicle management */
    getVehicleName(id) {
      return this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        ? this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        : "Fahrzeug " + id;
    },
  },
};
</script>
