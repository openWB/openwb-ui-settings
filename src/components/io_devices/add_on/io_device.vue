<template>
  <div class="io-device-add-on">
    <openwb-base-alert subtype="warning">
      Die Kontakte der AddOn-Platine sind nicht galvanisch oder optisch getrennt. Es wird dringend empfohlen, mit
      Koppelrelais zu arbeiten.<br />
      Weiterhin muss für die Verwendung der Kontakte in einer openWB series2 eine weitere Kabeldurchführung in das
      Gehäuse gebohrt werden. Da es hierbei zu Undichtigkeiten kommen kann, ist dies nur von fachkundigen Personen
      durchzuführen.<br />
      Es wird keine Haftung für Schäden übernommen, die durch die direkte Beschaltung der Kontakte oder eine zusätzliche
      Bohrung im Gehäuse entstehen.<br />
      Es wird der Einsatz des Dimm- & Control-Kits empfohlen!
    </openwb-base-alert>
    <openwb-base-alert subtype="info">
      Die Ausgänge können über die folgenden Topics manuell per MQTT geschaltet werden:
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/device/{{ component.id }}/set/manual/LED1
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/device/{{ component.id }}/set/manual/LED2
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/device/{{ component.id }}/set/manual/LED3
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        Als Wert wird ein boolean als json-String oder 0/1 akzeptiert.<br />
        Beispiel:
        <span class="text-info">false</span>
      </ul>
    </openwb-base-alert>
    <openwb-base-select-input
      title="Installiert auf..."
      not-selected="Bitte auswählen"
      :empty-value="null"
      :options="[{ value: 'localhost', text: 'dieser openWB' }]"
      :groups="availableIoSources"
      :model-value="ioDevice.configuration.host"
      @update:model-value="updateConfiguration($event, 'configuration.host')"
    >
      <template #help>
        Bitte die Komponente auswählen, an der die Add-On-Platine installiert ist.<br />
        Unterstützt werden:<br />
        <ul>
          <li>openWB standalone (als primary oder Zusatzdisplay)</li>
          <li>openWB Ladepunkte als primary ("interne openWB") und secondary ("externe openWB")</li>
        </ul>
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";
import ComponentState from "../../mixins/ComponentState.vue";

export default {
  name: "IoDeviceAddOn",
  mixins: [ComponentState, OpenwbIoDeviceConfigMixin],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/chargepoint/+/config"],
    };
  },
  computed: {
    configuredChargePoints() {
      const chargePointConfigurations = this.getWildcardTopics("openWB/chargepoint/+/config");
      let chargePoints = [];
      for (const element of Object.values(chargePointConfigurations)) {
        if (["external_openwb"].includes(element.type)) {
          if (chargePoints.find((cp) => cp.value === element.configuration.ip_address)) {
            continue;
          }
          chargePoints.push({
            value: element.configuration.ip_address,
            text: element.name,
          });
        }
      }
      return chargePoints;
    },
    configuredDisplays() {
      // ToDo: Implement
      return [];
    },
    availableIoSources: {
      get() {
        return [
          {
            label: "Ladepunkte",
            options: this.configuredChargePoints,
          },
          {
            label: "Zusatzdisplays",
            options: this.configuredDisplays,
          },
        ].filter((group) => group.options.length > 0);
      },
    },
  },
};
</script>
