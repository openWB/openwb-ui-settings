<template>
  <div class="device-kostal-piko-old">
    <openwb-base-heading> Einstellungen für Kostal Piko (alte Generation) </openwb-base-heading>
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="device.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Es wird eine komplette URL inklusive Protokoll erwartet. Normalerweise ist der Wechselrichter über "http://IP"
        zu erreichen.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="device.configuration.user"
      @update:model-value="updateConfiguration($event, 'configuration.user')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceKostalPikoOld",
  mixins: [DeviceConfigMixin],
};
</script>
