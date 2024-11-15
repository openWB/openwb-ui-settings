<template>
  <div class="device-huawei">
    <openwb-base-heading> Einstellungen für Huawei </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die Antwort der Huawei Wechselrichter benötigt sehr viel Zeit. Es wird empfohlen, dass Regelintervall der openWB
      auf "sehr langsam" zu stellen.
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
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Sind mehrere Huawei Wechselrichter als "Schwarm" verbunden, dann besitzt der Master vermutlich die ID "16". Über
        diese ID werden dann alle Daten in Summe zur Verfügung gestellt.<br />
        Die IDs 1 bis 15 sind für einzelne Wechselrichter reserviert.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceHuawei",
  mixins: [DeviceConfigMixin],
};
</script>
