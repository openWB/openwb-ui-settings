<template>
  <div class="ripple-control-receiver-fallback">
    <openwb-base-alert
      v-if="Object.keys(rippleControlReceiver.configuration).length == 0"
      subtype="info"
    >
      Das RSE-Modul "{{ rippleControlReceiver.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für das RSE-Modul "{{ rippleControlReceiver.name }}" gefunden. Die
        Einstellungen können als JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="rippleControlReceiver.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(rippleControlReceiver.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import RippleControlReceiverConfigMixin from "./RippleControlReceiverConfigMixin.vue";

export default {
  name: "RippleControlReceiverConfigFallback",
  mixins: [RippleControlReceiverConfigMixin],
};
</script>
