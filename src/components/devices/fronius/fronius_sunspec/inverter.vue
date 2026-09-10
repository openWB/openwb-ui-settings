<template>
  <div class="device-fronius-sunspec-inverter">
    <openwb-base-heading> Einstellungen für Fronius SunSpec Wechselrichter </openwb-base-heading>
    <openwb-base-select-input
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'PV-Erzeugung aus MPPT-Kanälen (Hybrid-Wechselrichter mit Speicher)' },
        { value: 1, text: 'AC-Leistung direkt (nicht-hybride Wechselrichter, z.B. Argeno)' },
      ]"
      :model-value="component.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Bei Hybrid-Wechselrichtern mit Speicher ist die AC-Leistung bereits mit dem Speicherfluss verrechnet, die reine
        PV-Erzeugung muss dann aus den DC-MPPT-Kanälen summiert werden. Bei nicht-hybriden Wechselrichtern kann die
        AC-Leistung direkt verwendet werden.
      </template>
    </openwb-base-select-input>
    <openwb-base-array-input
      v-if="component.configuration.version === 0"
      title="PV-MPPT-Kanäle"
      :model-value="component.configuration.pv_mppt_indices"
      :valid-elements="[1, 2, 3, 4, 5, 6, 7, 8]"
      no-elements-message="Keine PV-MPPT-Kanäle zugeordnet."
      @update:model-value="updateConfiguration($event, 'configuration.pv_mppt_indices')"
    >
      <template #help>
        Welche MPPT-Kanäle (siehe Kanalbezeichnung im Fronius-Webinterface bzw. per Modbus-Tool) die PV-Strings sind.
        Bei Hybrid-Geräten belegen Speicher-Lade-/Entladekanäle eigene, höhere Kanalnummern (siehe Speicher-Einstellung
        "MPPT-Kanal") -- welche Nummern tatsächlich PV vs. Speicher sind, unterscheidet sich zwischen Geräteserien und
        muss am Gerät geprüft werden.
      </template>
    </openwb-base-array-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusSunspecInverter",
  mixins: [ComponentConfigMixin],
};
</script>
