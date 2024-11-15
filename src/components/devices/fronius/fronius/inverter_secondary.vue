<template>
  <div class="device-fronius-inverter-secondary">
    <openwb-base-heading> Einstellungen für einen sekundären Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="ID"
      :model-value="component.configuration.id"
      min="0"
      required
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    >
      <template #help>
        Die ID des sekundären Wechselrichters. Diese ist für jede Installation individuell und muss ermittelt werden.
        Dafür kann der folgende Link verwendet werden. Die ID kann den zurückgegebenen JSON entnommen werden.
        <a
          :href="powerFlowUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ powerFlowUrl }} </a
        ><br />
        Im Abschnitt "Body" -> "Data" -> "SecondaryMeters" werden die installierten Zähler angezeigt. Die ID ist die
        Zahl vor dem Doppelpunkt und den zugehörigen Daten.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusInverterSecondary",
  mixins: [ComponentConfigMixin],
  computed: {
    powerFlowUrl: {
      get() {
        return `http://${this.device.configuration.ip_address}/solar_api/v1/GetPowerFlowRealtimeData.fcgi?Scope=System`;
      },
    },
  },
};
</script>
