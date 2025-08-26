<template>
  <div class="io-device-eebus">
    <openwb-base-text-input
      title="SKI-Schlüssel"
      :model-value="ioDevice.configuration.ski"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Zertifikat gültig ab"
      :model-value="new Date(ioDevice.configuration.not_before * 1000).toLocaleString()"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Zertifikat gültig bis"
      :model-value="new Date(ioDevice.configuration.not_after * 1000).toLocaleString()"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Aussteller"
      :model-value="ioDevice.configuration.issuer"
      :readonly="true"
    />
    <openwb-base-text-input
      title="weitere Informationen"
      :model-value="ioDevice.configuration.subject"
      :readonly="true"
    />
     <openwb-base-button-input
      title="Zertifikat und SKI-Schlüssel"
      button-text="Zertifikat und SKI-Schlüssel generieren"
      subtype="success"
      @button-clicked="sendSystemCommand('createEebusCert', { io_device: ioDevice.id })"
    >
      <template #help>
        Zugangstoken wird abgerufen und gespeichert, damit das Backup durchgeführt werden kann. Zugangstoken werden nur
        lokal auf dieser openWB gespeichert.
      </template>
    </openwb-base-button-input>
    <openwb-base-alert subtype="danger">
      Vorhandene Zertifkate werden gelöscht. Der SKI-Schlüssel muss danach beim Netzbetreiber (VNB) neu eingetragen werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "IoDeviceEebus",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
