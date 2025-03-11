<template>
  <div class="web-theme-koala">
    <openwb-base-range-input
      title="Zeitfenster Verlaufsdiagramm"
      :min="15"
      :max="240"
      :step="15"
      unit="Min."
      :model-value="webTheme.configuration.history_chart_range / 60"
      @update:model-value="updateConfiguration($event * 60, 'configuration.history_chart_range')"
    >
      <template #help>
        Das Zeitfenster für das Verlaufsdiagramm wird auf die hier eingestellte Anzahl Minuten beschränkt.
      </template>
    </openwb-base-range-input>
  </div>
</template>

<script>
import WebThemeConfigMixin from "../WebThemeConfigMixin.vue";

export default {
  name: "WebThemeKoala",
  mixins: [WebThemeConfigMixin],
};
</script>
