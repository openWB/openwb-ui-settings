<template>
  <div class="grid-fee-fallback">
    <openwb-base-alert
      v-if="Object.keys(gridFee.configuration).length == 0"
      subtype="info"
    >
      Der Anbieter "{{ gridFee.name }}" bietet keine Einstellungen.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="warning">
        Es wurde keine Konfigurationsseite für den Anbieter "{{ gridFee.name }}" gefunden. Die Einstellungen können als
        JSON direkt bearbeitet werden.
      </openwb-base-alert>
      <openwb-base-textarea
        title="Konfiguration"
        subtype="json"
        :model-value="gridFee.configuration"
        @update:model-value="updateConfiguration($event, 'configuration')"
      >
        <template #help> Bitte prüfe, ob die Eingaben richtig interpretiert werden. </template>
      </openwb-base-textarea>
      <openwb-base-alert subtype="info">
        <pre>{{ JSON.stringify(gridFee.configuration, undefined, 2) }}</pre>
      </openwb-base-alert>
    </div>
  </div>
</template>

<script>
import GridFeeConfigMixin from "./GridFeeConfigMixin.vue";

export default {
  name: "GridFeeConfigFallback",
  mixins: [GridFeeConfigMixin],
};
</script>
