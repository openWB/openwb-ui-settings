<template>
  <div class="io-device-add-on">
    <OpenwbBaseAlert subtype="warning"> ToDo: Textfeld durch Select-Element ersetzen. </OpenwbBaseAlert>
    <openwb-base-text-input
      title="Installiert auf openWB"
      subtype="host"
      :model-value="ioDevice.configuration.host"
      @update:model-value="updateState('configuration.host', $event)"
    >
      <template #help>
        Bitte die openWB auswählen, auf der die Add-On-Platine installiert ist.<br />
        Es werden nur Ladepunkte der Typen "interne openWB" und "externe openWB" unterstützt.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "IoDeviceAddOn",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
