<template>
  <div class="optionalComponents">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Identifikation">
        <openwb-base-alert subtype="info">
          <p>
            Eine ausführliche Anleitung findest Du hier:
            <a
              :href="`https://wiki.openwb.de/doku.php?id=openwb:vc:${systemVersion}:software:einstell-konfig:einstellungen:identifikation`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wiki-Beitrag zur Identifikation
            </a>
          </p>
          Die Identifikation kann zum Entsperren von Ladepunkten und Verbrauchern sowie zur Zuordnung von Fahrzeugen
          genutzt werden und kann auf mehreren Wegen erfolgen:
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
              <font-awesome-icon
                :icon="['fas', 'car']"
                class="fa-border"
                size="xs"
                :style="{
                  backgroundColor: $store.state.mqtt['openWB/vehicle/' + vehicleId + '/color'],
                  color: getContrastColor($store.state.mqtt['openWB/vehicle/' + vehicleId + '/color']),
                }"
              />
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
      <template v-if="Object.keys(rfidConsumers).length > 0">
        <openwb-base-heading> Freischalten von Verbrauchern </openwb-base-heading>
        <openwb-base-card
          title="Verbraucher"
          subtype="purple"
          :collapsible="true"
          :collapsed="true"
        >
          <openwb-base-alert
            v-if="$store.state.mqtt['openWB/general/extern'] === true"
            subtype="info"
          >
            Die Verbraucher-Freischaltung bitte auf der "primary" openWB konfigurieren.
          </openwb-base-alert>
          <openwb-base-alert
            v-else-if="$store.state.mqtt['openWB/optional/rfid/active'] !== true"
            subtype="info"
          >
            Diese Einstellungen sind nur verfügbar, wenn Identifikation aktiviert ist.
          </openwb-base-alert>
          <div v-else>
            <openwb-base-alert subtype="info">
              Zugeordnete ID-Tags schalten den Verbraucher für den eingestellten Betriebsmodus frei. Die Freischaltung
              wird nach der eingestellten Wartezeit zurückgesetzt. RFID setzt die Verwendung des integrierten Zählers
              voraus.
            </openwb-base-alert>
            <div
              v-for="(consumer, topic) in rfidConsumers"
              :key="topic"
            >
              <openwb-base-heading>{{ consumer.name }}</openwb-base-heading>
              <openwb-base-array-input
                title="Zugeordnete ID-Tags"
                :no-elements-message="`&quot;${consumer.name}&quot; sind keine ID-Tags zugeordnet.`"
                pattern="^[^\s].*[^\s]$"
                :model-value="consumer.config.valid_tags ?? []"
                @update:model-value="updateState(topic, $event, 'valid_tags')"
              />
              <openwb-base-select-input
                title="RFID-Tag zurücksetzen"
                :options="[
                  { value: 'after_time', text: 'Nach Zeit ab Freischaltung' },
                  { value: 'after_power_end', text: 'Nach Zeit nach Ende der Leistungsaufnahme' },
                ]"
                :model-value="consumer.config.rfid_reset ?? 'after_time'"
                @update:model-value="updateState(topic, $event, 'rfid_reset')"
              >
                <template #help>
                  Nach Ende der Leistungsaufnahme: Die Wartezeit beginnt, sobald der zuvor laufende Verbraucher
                  höchstens noch Standby-Leistung (35 W pro Phase) aufnimmt. Nimmt er wieder Leistung auf, beginnt die
                  Wartezeit beim nächsten Ende erneut.
                </template>
              </openwb-base-select-input>
              <openwb-base-number-input
                title="Wartezeit bis zum Zurücksetzen"
                unit="min"
                :min="1"
                :model-value="(consumer.config.rfid_timeout ?? 300) / 60"
                @update:model-value="updateState(topic, $event * 60, 'rfid_timeout')"
              >
                <template #help>Nach dem Zurücksetzen ist erneut eine Freischaltung per RFID erforderlich.</template>
              </openwb-base-number-input>
            </div>
          </div>
        </openwb-base-card>
      </template>
      <openwb-base-submit-buttons
        form-name="optionalComponentsForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCar as fasCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCar);

import ComponentState from "../components/mixins/ComponentState.vue";
import SystemVersion from "../components/mixins/SystemVersion.vue";

export default {
  name: "IdentificationConfigView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState, SystemVersion],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/chargepoint/+/config", writeable: false },
        { topic: "openWB/chargepoint/+/get/rfid", writeable: false },
        { topic: "openWB/chargepoint/+/get/rfid_timestamp", writeable: false },
        { topic: "openWB/chargepoint/+/get/vehicle_id", writeable: false },
        { topic: "openWB/chargepoint/+/set/rfid", writeable: false },
        { topic: "openWB/chargepoint/template/+", writeable: true },
        { topic: "openWB/consumer/+/module", writeable: false },
        { topic: "openWB/consumer/+/extra_meter", writeable: false },
        { topic: "openWB/consumer/+/config", writeable: true },
        { topic: "openWB/consumer/+/get/rfid", writeable: false },
        { topic: "openWB/consumer/+/set/rfid", writeable: false },
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/optional/rfid/active", writeable: true },
        { topic: "openWB/vehicle/+/charge_template", writeable: false },
        { topic: "openWB/vehicle/+/color", writeable: false },
        { topic: "openWB/vehicle/+/name", writeable: false },
        { topic: "openWB/vehicle/+/tag_id", writeable: true },
        { topic: "openWB/vehicle/template/charge_template/+", writeable: true },
      ],
      tempIdTagList: {},
    };
  },
  computed: {
    rfidConsumers() {
      const modules = this.getWildcardTopics("openWB/consumer/+/module");
      return Object.fromEntries(
        Object.values(modules)
          .filter((consumer) => consumer.type === "mqtt")
          .map((consumer) => {
            const topic = `openWB/consumer/${consumer.id}/config`;
            return [topic, { ...consumer, config: this.$store.state.mqtt[topic] ?? {} }];
          })
          .filter(([, consumer]) => consumer.config.rfid_enabled),
      );
    },
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
      Object.entries(this.getWildcardTopics("^openWB/consumer/[^+/]+/[gs]et/rfid$", true)).forEach(([topic, tag]) => {
        if (tag !== null) {
          const id = this.getIdFromTopic(topic);
          const name = this.$store.state.mqtt[`openWB/consumer/${id}/module`]?.name ?? `Verbraucher ${id}`;
          this.tempIdTagList[tag] = `${tag} (${topic.includes("/set/") ? "zugewiesen" : "erfasst"} an ${name})`;
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
