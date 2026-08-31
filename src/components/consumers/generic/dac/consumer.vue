<template>
  <div class="consumer-generic-dac">
    <openwb-base-heading>Einstellungen für DAC-Verbraucher</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Der aktuelle Überschuss wird über Modbus an einen Digital-Analog-Wandler (DAC) übertragen. Es werden verschiedene
      Modelle unterstützt. Je nach Modell wird das an den DAC angeschlossene Gerät über ein Signal von 1-10V oder 4-20mA
      gesteuert. Falls erforderlich, kann auch der komplette Signalbereich (0-10V bzw. 0-20mA) genutzt werden, um die
      Leistung des Verbrauchers zu steuern. Hierzu bitte die Option "Signalbereich" von "Standard" auf "Komplett"
      ändern.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="consumer.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-select-input
      title="Modell"
      not-selected="Bitte auswählen"
      :options="modelOptions"
      :model-value="consumer.configuration.model"
      @update:model-value="updateConfiguration($event, 'configuration.model')"
    />
    <openwb-base-button-group-input
      title="Signalbereich"
      :buttons="[
        { text: 'Standard', buttonValue: false },
        { text: 'Komplett', buttonValue: true },
      ]"
      :model-value="consumer.configuration.full_signal_range"
      @update:model-value="updateConfiguration($event, 'configuration.full_signal_range')"
    >
      <template #help>
        Der Signalbereich kann je nach angeschlossenem Verbraucher angepasst werden. Standardmäßig wird der Bereich
        1-10V bzw. 4-20mA ("Live Zero") genutzt. Werte kleiner 1V bzw. 4mA signalisieren dem Verbraucher einen
        Verbindungsfehler. Falls erforderlich, kann auch der komplette Bereich 0-10V bzw. 0-20mA verwendet werden, um
        die Leistung des Verbrauchers zu steuern. Bitte beachte, dass dies je nach angeschlossenem Verbraucher zu einer
        anderen Leistungsregelung führt.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

const MODEL_OPTIONS = [
  { text: "N4Dac02", value: "N4Dac02" },
  { text: "DA02", value: "DA02" },
  { text: "M120T (Analogausgang 1)", value: "M120T-1" },
  { text: "M120T (Analogausgang 2)", value: "M120T-2" },
  { text: "AA02B", value: "AA02B" },
];

export default {
  name: "ConsumerGenericDac",
  mixins: [ConsumerConfigMixin],
  data() {
    return {
      modelOptions: MODEL_OPTIONS,
    };
  },
};
</script>
