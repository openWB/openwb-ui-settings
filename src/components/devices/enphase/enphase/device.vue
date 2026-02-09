<template>
  <div class="device-enphase">
    <openwb-base-heading> Einstellungen für Enphase Envoy / IQ Gateway </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.hostname"
      @update:model-value="updateConfiguration($event, 'configuration.hostname')"
    >
      <template #help>
        Bitte gib die IP-Adresse oder den Hostnamen des Enphase Envoy oder IQ Gateway an. Die Info findest Du in Deinem
        Router. Ab Werk ist der Hostname "envoy" oder "envoy.local".
      </template>
    </openwb-base-text-input>
    <openwb-base-select-input
      title="Version"
      required
      :options="[
        { value: 1, text: 'Firmware < 7.0' },
        { value: 2, text: 'Firmware ab 7.0' },
      ]"
      :model-value="device.configuration.version"
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Bitte wähle die Version des Enphase Envoy oder IQ Gateway aus. Die Version 1 ist für Geräte mit einer
        Firmware-Version unter 7.0, die Version 2 für Geräte mit einer Firmware-Version ab 7.0. Ein angebundener
        Speicher wird nur bei Version 2 unterstützt.
      </template>
    </openwb-base-select-input>
    <openwb-base-text-input
      v-if="device.configuration.version > 1"
      title="Benutzer"
      subtype="user"
      :model-value="device.configuration.user"
      required
      @update:model-value="updateConfiguration($event, 'configuration.user')"
    />
    <openwb-base-text-input
      v-if="device.configuration.version > 1"
      title="Kennwort"
      subtype="password"
      :model-value="device.configuration.password"
      required
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-text-input
      v-if="device.configuration.version > 1"
      title="Envoy Seriennummer"
      :model-value="device.configuration.serial"
      required
      @update:model-value="updateConfiguration($event, 'configuration.serial')"
    />
    <openwb-base-text-input
      v-if="device.configuration.version > 1"
      title="Token"
      subtype="password"
      :model-value="device.configuration.token"
      required
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    >
      <template #help>
        Wenn Benutzer, Kennwort und Seriennummer des Envoys angegeben werden, wird das Token automatisch beim Speichern
        abgerufen. Ebenfalls wird ein abgelaufenes Token (derzeit nach einem Jahr) automatisch erneuert.<br />
        Wenn Du ein Token manuell erstellen möchtest, kannst Du dies auf der
        <a
          href="https://developer.enphase.com/docs/quickstart.html"
          target="_blank"
          rel="noopener"
        >
          Enphase-Webseite
        </a>
        erledigen.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceEnphase",
  mixins: [DeviceConfigMixin],
};
</script>
