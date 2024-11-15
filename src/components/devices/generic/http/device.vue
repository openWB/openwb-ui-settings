<template>
  <div class="device-http">
    <openwb-base-heading> Einstellungen für Http </openwb-base-heading>
    <openwb-base-text-input
      title="Server-URL"
      subtype="url"
      required
      :model-value="device.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Hier sind die Verbindungsangaben für den Http-Server einzutragen. Der Pfad für die einzelnen Daten wird in der
        Komponente hinterlegt.<br />
        Beispiel: http://mein.server:8080
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceHttp",
  mixins: [DeviceConfigMixin],
};
</script>
