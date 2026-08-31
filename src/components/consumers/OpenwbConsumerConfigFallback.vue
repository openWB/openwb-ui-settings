<template>
  <div class="consumer-config-fallback">
    <openwb-base-alert
      v-if="Object.keys(consumer.configuration).length == 0"
      subtype="info"
    >
      Der Verbraucher-Typ "{{ consumer.type }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Verbraucher-Typ "{{ consumer.type }}" gefunden. Die Einstellungen
        können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="consumer.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(consumer.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import ConsumerConfigMixin from "./ConsumerConfigMixin.vue";

export default {
  name: "OpenwbConsumerConfigFallback",
  mixins: [ConsumerConfigMixin],
};
</script>
