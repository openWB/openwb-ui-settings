<template>
  <div class="device-solarmax-bat">
    <openwb-base-alert subtype="info">
      Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Batteriespeicher sind Teil eines Hybridsystems. Daher muss auch eine
      Komponente Wechselrichter angelegt werden.<br />
      Die aktive Speichersteuerung ist ab Solarmax Software Version 3.4.4 verfügbar. Zur Nutzung muss die Funktion
      "Connectivity+" durch den Solarmax Support (nicht openWB Support) freigeschaltet werden.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-button-group-input
      title="Speicherleistung steuerbar"
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
      :model-value="component.configuration.power_limit_controllable"
      @update:model-value="updateConfiguration($event, 'configuration.power_limit_controllable')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolarmaxBat",
  mixins: [ComponentConfigMixin],
};
</script>
