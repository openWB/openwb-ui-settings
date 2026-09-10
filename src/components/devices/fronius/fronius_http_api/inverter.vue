<template>
  <div class="device-fronius-inverter">
    <openwb-base-heading> Einstellungen für Fronius Wechselrichter </openwb-base-heading>
    <openwb-base-checkbox-input
      title="Sekundärer Wechselrichter"
      :model-value="isSecondary"
      @update:model-value="toggleSecondary"
    >
      <template #help>
        Aktivieren, wenn dieser Wechselrichter nicht direkt als primärer Wechselrichter ausgelesen wird, sondern als
        sekundärer/companion Wechselrichter über die "SecondaryMeters" der PowerFlow-Antwort erfasst wird (z.B. bei
        mehreren per Fronius Solar Net / DATCOM verbundenen Wechselrichtern).
      </template>
    </openwb-base-checkbox-input>
    <openwb-base-number-input
      v-if="isSecondary"
      title="ID"
      :model-value="component.configuration.secondary_id"
      min="0"
      required
      @update:model-value="updateConfiguration($event, 'configuration.secondary_id')"
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
  name: "DeviceFroniusInverter",
  mixins: [ComponentConfigMixin],
  computed: {
    isSecondary() {
      const secondaryId = this.component.configuration.secondary_id;
      return secondaryId !== null && secondaryId !== undefined;
    },
    powerFlowUrl() {
      return `http://${this.device.configuration.ip_address}/solar_api/v1/GetPowerFlowRealtimeData.fcgi?Scope=System`;
    },
  },
  methods: {
    toggleSecondary(value) {
      this.updateConfiguration(value ? 1 : null, "configuration.secondary_id");
    },
  },
};
</script>
