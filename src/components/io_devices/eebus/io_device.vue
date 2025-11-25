<template>
  <div class="io-device-eebus">
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="ioDevice.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-text-input
      title="SKI-Schlüssel des VNB"
      :model-value="ioDevice.configuration.remote_ski"
      @update:model-value="updateConfiguration($event, 'configuration.remote_ski')"
    />
    <openwb-base-button-input
      title="Zertifikat und SKI-Schlüssel"
      button-text="Zertifikat und SKI-Schlüssel generieren"
      subtype="warning"
      @button-clicked="sendSystemCommand('createEebusCert', { io_device: ioDevice.id })"
    >
      <template #help>
        Zugangstoken wird abgerufen und gespeichert, damit das Backup durchgeführt werden kann. Zugangstoken werden nur
        lokal auf dieser openWB gespeichert.
      </template>
    </openwb-base-button-input>
    <openwb-base-alert subtype="danger">
      Vorhandene Zertifikate werden gelöscht. Der SKI-Schlüssel muss danach beim Netzbetreiber (VNB) neu eingetragen
      werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="SKI-Schlüssel (zum Eintragen beim VNB)"
      :model-value="ioDevice.configuration.cert_info.client_ski"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Zertifikat gültig ab"
      :model-value="ioDevice.configuration.cert_info.not_before"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Zertifikat gültig bis"
      :model-value="ioDevice.configuration.cert_info.not_after"
      :readonly="true"
    />
    <openwb-base-text-input
      title="Aussteller"
      :model-value="ioDevice.configuration.cert_info.issuer"
      :readonly="true"
    />
    <openwb-base-text-input
      title="weitere Informationen"
      :model-value="ioDevice.configuration.cert_info.subject"
      :readonly="true"
    />
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "IoDeviceEebus",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
