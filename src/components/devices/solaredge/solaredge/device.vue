<template>
  <div class="device-solaredge">
    <openwb-base-heading> Einstellungen für SolarEdge </openwb-base-heading>
    <openwb-base-alert subtype="info">
      ModbusTCP muss im Wechselrichter aktiviert werden und der Wechselrichter per LAN angebunden sein.<br />
      SolarEdge lässt nur eine ModbusTCP-Verbindung zu. Wenn Sie mit einem weiteren Smarthome-System, wie z.B. ioBroker
      oder openHAB, den SolarEdge-Wechselrichter abfragen, kann dies die Abfrage durch die openWB stören oder
      verhindern.
    </openwb-base-alert>
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
    >
      <template #help>
        Je nach Produktionsdatum und Softwareversion ist 502 oder 1502 ab Werk eingestellt. Bitte im Wechselrichter
        überprüfen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSolarEdge",
  mixins: [DeviceConfigMixin],
};
</script>
