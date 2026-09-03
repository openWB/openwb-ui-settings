<template>
  <div class="device-growatt">
    <openwb-base-heading>Einstellungen für Growatt</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-select-input
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        { value: 'TL-X', text: 'TL-X / TL-XH / TL3-XH (inkl. MOD-XH mit Batterie)' },
        { value: 'SPH', text: 'SPH / SPA Hybrid mit Speicher' },
        { value: 'VPP', text: 'VPP-Protokoll (neuere Firmware, MOD/MIN/SPH/WIT)' },
      ]"
      :model-value="device.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Die Wahl der Registerkarte beeinflusst die Auslesung von Wechselrichter-, Zähler- und
        Speicherwerten. "TL-X" passt für die meisten MOD/MIN/TL-XH-Geräte inkl. Batterie am
        Wechselrichter selbst. "SPH/SPA" gilt für Hybridwechselrichter mit separatem
        Speicherblock (vorher als "MAX Series" genannt). "VPP" ist ein neueres, paralleles
        Protokoll auf denselben Geräten - falls unsicher, zuerst "TL-X" probieren, bei
        fehlenden/falschen Speicherwerten "VPP" testen.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceGrowatt",
  mixins: [DeviceConfigMixin],
};
</script>
