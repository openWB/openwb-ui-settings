<template>
  <div class="web-theme-colors">
    <!-- Display background displayMode -->
    <openwb-base-button-group-input
      title="Farbschema"
      :buttons="[
        { buttonValue: 'dark', text: 'Dunkel' },
        { buttonValue: 'light', text: 'Hell' },
        { buttonValue: 'blue', text: 'Blau' },
      ]"
      :model-value="webTheme.configuration.displayMode"
      @update:model-value="updateConfiguration($event, 'configuration.displayMode')"
    >
      <template #help> Hintergrundfarbe </template>
    </openwb-base-button-group-input>
    <openwb-base-button-group-input
      title="Farbschema Smarthome-Geräte"
      :buttons="[
        { buttonValue: 'normal', text: 'Orange' },
        { buttonValue: 'standard', text: 'Grün/Violett' },
        { buttonValue: 'advanced', text: 'Bunt' },
      ]"
      :model-value="webTheme.configuration.smartHomeColors"
      @update:model-value="updateConfiguration($event, 'configuration.smartHomeColors')"
    >
      <template #help> Für die Smart-Home-Geräte stehen mehrere Schemata zur Verfügung. </template>
    </openwb-base-button-group-input>
    <openwb-base-range-input
      title="Zeitfenster Live-Graph"
      :min="15"
      :max="120"
      :step="15"
      unit="Min."
      :model-value="webTheme.configuration.liveGraphDuration / 60"
      @update:model-value="updateConfiguration($event * 60, 'configuration.liveGraphDuration')"
    >
      <template #help>
        Das Zeitfenster für den Live-Graphen wird auf die hier eingestellte Anzahl Minuten beschränkt.
      </template>
    </openwb-base-range-input>
    <openwb-base-button-group-input
      title="Grafik: Raster"
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
      :model-value="webTheme.configuration.showGrid"
      @update:model-value="updateConfiguration($event, 'configuration.showGrid')"
    >
      <template #help> Verwende ein Hintergrundraster in den Grafiken </template>
    </openwb-base-button-group-input>
    <openwb-base-button-group-input
      title="Anzahl Dezimalstellen"
      :buttons="[
        { buttonValue: 0, text: '3 kW' },
        { buttonValue: 1, text: '3.1 kW' },
        { buttonValue: 2, text: '3.14 kW' },
        { buttonValue: 3, text: '3.141 kW' },
        { buttonValue: 4, text: '3141 W' },
      ]"
      :model-value="webTheme.configuration.decimalPlaces"
      @update:model-value="updateConfiguration($event, 'configuration.decimalPlaces')"
    >
      <template #help> Alle kW- und kWh-Werte werden mit der gewählten Anzahl an Stellen angezeigt. </template>
    </openwb-base-button-group-input>
    <!-- variable bogenlänge showRelativeArcs -->
    <openwb-base-button-group-input
      title="Variable Bogenlänge"
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
      :model-value="webTheme.configuration.showRelativeArcs"
      @update:model-value="updateConfiguration($event, 'configuration.showRelativeArcs')"
    >
      <template #help>
        Im Graph 'Aktuelle Leistung' können die Bögen immer die volle Länge haben, oder entsprechend des aktuellen
        Gesamtleistung verkürzt dargestellt werden.
      </template>
    </openwb-base-button-group-input>
    <!-- Wechselrichter anzeigen showInverters -->
    <openwb-base-button-group-input
      title="Wechselrichter anzeigen"
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
      :model-value="webTheme.configuration.showInverters"
      @update:model-value="updateConfiguration($event, 'configuration.showInverters')"
    >
      <template #help> Zeige Details zu den einzelnen Wechselrichtern </template>
    </openwb-base-button-group-input>
    <!-- Fahrzeuge anzeigen showVehicles -->
    <openwb-base-button-group-input
      title="Fahrzeugliste anzeigen"
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
      :model-value="webTheme.configuration.showVehicles"
      @update:model-value="updateConfiguration($event, 'configuration.showVehicles')"
    >
      <template #help> Zeige alle Fahrzeuge mit Ladestand und Reichweite. </template>
    </openwb-base-button-group-input>
    <!-- Zähler anzeigen showCounters -->
    <openwb-base-button-group-input
      title="Zähler anzeigen"
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
      :model-value="webTheme.configuration.showCounters"
      @update:model-value="updateConfiguration($event, 'configuration.showCounters')"
    >
      <template #help> Zeige die Werte zusätzlich angelegter Zähler. </template>
    </openwb-base-button-group-input>
    <!-- Preise anzeigen showPrices -->
    <openwb-base-button-group-input
      title="Preistabelle anzeigen"
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
      :model-value="webTheme.configuration.showPrices"
      @update:model-value="updateConfiguration($event, 'configuration.showPrices')"
    >
      <template #help> Zeige den Verlauf des dynamischen Strompreises auf der Hauptseite. </template>
    </openwb-base-button-group-input>
    <!-- lower price bound -->
    <openwb-base-range-input
      title="Untere Markierung in der Preistabelle"
      :min="-25"
      :max="95"
      :step="0.1"
      unit="ct"
      :model-value="webTheme.configuration.lowerPriceBound"
      @update:model-value="updateConfiguration($event, 'configuration.lowerPriceBound')"
    >
      <template #help> Position der unteren Markierung festlegen. </template>
    </openwb-base-range-input>
    <!-- upper price bound -->
    <openwb-base-range-input
      title="Obere Markierung in der Preistabelle"
      :min="-25"
      :max="95"
      :step="0.1"
      unit="ct"
      :model-value="webTheme.configuration.upperPriceBound"
      @update:model-value="updateConfiguration($event, 'configuration.upperPriceBound')"
    >
      <template #help> Position der oberen Markierung festlegen. </template>
    </openwb-base-range-input>
    <openwb-base-button-group-input
      title="Alternatives Energie-Widget"
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
      :model-value="webTheme.configuration.alternativeEnergy"
      @update:model-value="updateConfiguration($event, 'configuration.alternativeEnergy')"
    >
      <template #help> Horizontale Darstellung der Energie-Werte. </template>
    </openwb-base-button-group-input>
    <!-- Anzeige Standard-Fahrzeug-->
    <openwb-base-button-group-input
      title="Standard-Fahrzeug anzeigen"
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
      :model-value="webTheme.configuration.showStandardVehicle"
      @update:model-value="updateConfiguration($event, 'configuration.showStandardVehicle')"
    >
      <template #help> Legt fest, ob das Standardfahrzeug in Listen und Auswahlmenus angezeigt wird.</template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import WebThemeConfigMixin from "../WebThemeConfigMixin.vue";

export default {
  name: "WebThemeColors",
  components: {},
  mixins: [WebThemeConfigMixin],
  data() {
    return {
      slideLabels: {
        daily_totals: "Tageswerte",
        history_chart: "Verlaufsdiagramm",
        flow_diagram: "Energiefluss",
      },
    };
  },
};
</script>
