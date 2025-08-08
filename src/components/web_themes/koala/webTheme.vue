<template>
  <div class="web-theme-koala">
    <openwb-base-button-group-input
      title="Standard-Fahrzeug ausblenden"
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
      :model-value="webTheme.configuration.hide_standard_vehicle"
      @update:model-value="updateConfiguration($event, 'configuration.hide_standard_vehicle')"
    >
      <template #help>
        Legt fest, ob das Standardfahrzeug im Fahrzeugkarten- bzw. Ladepunkt-Fahrzeugauswahlmenü ausgeblendet wird.
      </template>
    </openwb-base-button-group-input>
    <hr />
    <openwb-base-range-input
      title="Zeitfenster Verlaufsdiagramm"
      :min="15"
      :max="120"
      :step="15"
      unit="Min."
      :model-value="webTheme.configuration.history_chart_range / 60"
      @update:model-value="updateConfiguration($event * 60, 'configuration.history_chart_range')"
    >
      <template #help>
        Das Zeitfenster für das Verlaufsdiagramm wird auf die hier eingestellte Anzahl Minuten beschränkt.
      </template>
    </openwb-base-range-input>
    <hr />
    <openwb-base-number-input
      title="Ladepunkt Kartenansicht Grenzwert"
      :min="0"
      :step="1"
      :model-value="webTheme.configuration.chargePoint_card_view_breakpoint"
      @update:model-value="updateConfiguration($event, 'configuration.chargePoint_card_view_breakpoint')"
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
      :model-value="webTheme.configuration.chargePoint_table_search_input_field"
      @update:model-value="updateConfiguration($event, 'configuration.chargePoint_table_search_input_field')"
    >
      <template #help>
        Legt fest, ob in der Tabellenansicht ein Suchfeld angezeigt wird. Mit diesem Suchfeld können die Felder
        „Ladepunkt“ und „Fahrzeug“ durchsucht werden.
      </template>
    </openwb-base-button-group-input>
    <hr />
    <openwb-base-number-input
      title="Fahrzeug Kartenansicht Grenzwert"
      :min="0"
      :step="1"
      :model-value="webTheme.configuration.vehicle_card_view_breakpoint"
      @update:model-value="updateConfiguration($event, 'configuration.vehicle_card_view_breakpoint')"
    >
      <template #help>
        Legt fest, bis zu wie vielen Fahrzeugen die Kartenansicht verwendet wird. Bei mehr Fahrzeugen wird automatisch
        zur Tabellenansicht gewechselt.
      </template>
    </openwb-base-number-input>
    <openwb-base-button-group-input
      title="Suchfeld in Fahrzeug Tabellenansicht"
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
      :model-value="webTheme.configuration.vehicle_table_search_input_field"
      @update:model-value="updateConfiguration($event, 'configuration.vehicle_table_search_input_field')"
    >
      <template #help>
        Legt fest, ob in der Tabellenansicht ein Suchfeld angezeigt wird. Mit diesem Suchfeld können die Felder
        „Fahrzeug“, „Hersteller“ und „Modell“ durchsucht werden.
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
