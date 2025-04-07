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
    <openwb-base-number-input
      title="Kartenansicht Grenzwert"
      :min="1"
      :step="1"
      :model-value="webTheme.configuration.card_view_breakpoint"
      @update:model-value="updateConfiguration($event, 'configuration.card_view_breakpoint')"
    >
      <template #help>
        Legt fest, bis zu wie vielen Ladepunkten die Kartenansicht verwendet wird. Bei mehr Ladepunkten wird automatisch
        zur Tabellenansicht gewechselt.
      </template>
    </openwb-base-number-input>
    <openwb-base-button-group-input
      title="Suchfeld in Ladepunkt Tabellenansicht"
      :buttons="[
        {
          buttonValue: false,
          text: 'Nein',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'Ja',
          class: 'btn-outline-success',
        },
      ]"
      :model-value="webTheme.configuration.table_search_input_field"
      @update:model-value="updateConfiguration($event, 'configuration.table_search_input_field')"
    >
      <template #help>
        Legt fest, ob in der Tabellenansicht ein Suchfeld angezeigt wird, mit dem nach Ladepunkten gesucht werden kann.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import WebThemeConfigMixin from "../WebThemeConfigMixin.vue";

export default {
  name: "WebThemeKoala",
  mixins: [WebThemeConfigMixin],
};
</script>
