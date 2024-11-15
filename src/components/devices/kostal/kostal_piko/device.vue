<template>
  <div class="device-kostal-piko">
    <openwb-base-heading> Einstellungen für Kostal Piko </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Der Wechselrichter liefert Werte nur, solange er auch PV-Leistung liefert. Nachts geht er in den Standby. Die
      Hausanschlussüberwachung ist nur aktiv, wenn der Wechselrichter auch aktiv ist.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceKostalPiko",
  mixins: [DeviceConfigMixin],
};
</script>
