<template>
  <div class="device-fallback">
    <openwb-base-alert
      v-if="Object.keys(device.configuration).length == 0"
      subtype="info"
    >
      Der Gerät-Typ "{{ device.type }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Geräte-Typ "{{ device.type }}" gefunden. Die Einstellungen können als
        JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="device.configuration"
        @update:model-value="updateFallbackConfiguration($event)"
      >
        <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(device.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeviceFallback",
  props: {
    device: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    updateFallbackConfiguration(value) {
      this.$emit("update:configuration", {
        value,
        object: "configuration",
        source: "fallback",
      });
    },
  },
};
</script>
