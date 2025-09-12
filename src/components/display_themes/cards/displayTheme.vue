<template>
  <div class="display-theme-cards">
    <openwb-base-heading>Bediensperre</openwb-base-heading>
    <openwb-base-button-group-input
      title="Bedienung sperren"
      :model-value="displayTheme.configuration.lock_changes"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.lock_changes')"
    >
      <template #help>
        Die Bedienung wird automatisch nach der eingestellten Ausschaltzeit (siehe "Display Standby") wieder gesperrt.
      </template>
    </openwb-base-button-group-input>
    <openwb-base-text-input
      v-if="displayTheme.configuration.lock_changes"
      title="PIN zur Freigabe"
      subtype="password"
      required
      pattern="[0-9]{4,10}"
      :model-value="displayTheme.configuration.lock_changes_code"
      @update:model-value="updateConfiguration($event, 'configuration.lock_changes_code')"
    >
      <template #help> Der PIN muss aus 4 bis 10 Zahlen bestehen. </template>
    </openwb-base-text-input>
    <openwb-base-heading>Ansichten</openwb-base-heading>
    <openwb-base-button-group-input
      title="Übersicht anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_view"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="toggleView('dashboard')"
    />
    <openwb-base-button-group-input
      title="Energiefluss anzeigen"
      :model-value="displayTheme.configuration.enable_energy_flow_view"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="toggleView('energy_flow')"
    />
    <openwb-base-button-group-input
      title="Ladepunkte anzeigen"
      :model-value="displayTheme.configuration.enable_charge_points_view"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="toggleView('charge_points')"
    />
    <openwb-base-button-group-input
      v-if="displayTheme.configuration.enable_charge_points_view == true"
      title="Einfache Ansicht der Ladepunkte"
      :model-value="displayTheme.configuration.simple_charge_point_view"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.simple_charge_point_view')"
    />
    <openwb-base-button-group-input
      title="Status anzeigen"
      :model-value="displayTheme.configuration.enable_status_view"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="toggleView('status')"
    />
    <openwb-base-select-input
      title="Standardansicht"
      not-selected="Bitte auswählen"
      required
      :model-value="displayTheme.configuration.default_view"
      :options="enabledViews"
      @update:model-value="updateConfiguration($event, 'configuration.default_view')"
    >
      <template #help> Die Standardansicht wird beim Start sowie nach einiger Zeit ohne Bedienung angezeigt. </template>
    </openwb-base-select-input>
    <openwb-base-range-input
      title="Wechsel zur Standardansicht"
      :min="0"
      :max="6"
      :step="1"
      :model-value="displayTheme.configuration.default_view_timeout"
      :labels="[
        { value: 0, label: 'Aus' },
        { value: 60, label: '1 Min' },
        { value: 300, label: '5 Min' },
        { value: 600, label: '10 Min' },
        { value: 900, label: '15 Min' },
        { value: 1800, label: '30 Min' },
        { value: 3600, label: '60 Min' },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.default_view_timeout')"
    >
      <template #help> Nach dieser Zeit ohne Bedienung wird die Standardansicht angezeigt. </template>
    </openwb-base-range-input>
    <openwb-base-heading>
      Datenauswahl
      <template #help>
        Hier kann festgelegt werden, welche Daten in den Ansichten "Übersicht" und "Energiefluss" angezeigt werden.
      </template>
    </openwb-base-heading>
    <openwb-base-button-group-input
      title="EVU anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_grid"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_grid')"
    />
    <openwb-base-button-group-input
      title="Hausverbrauch anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_home_consumption"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_home_consumption')"
    />
    <openwb-base-button-group-input
      title="PV anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_inverter_sum"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_inverter_sum')"
    />
    <openwb-base-button-group-input
      title="Batteriespeicher anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_battery_sum"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_battery_sum')"
    />
    <openwb-base-button-group-input
      title="Ladepunkte anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_charge_point_sum"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_charge_point_sum')"
    />
    <openwb-base-button-group-input
      title="Fahrzeuge anzeigen"
      :model-value="displayTheme.configuration.enable_dashboard_card_vehicles"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_card_vehicles')"
    />
  </div>
</template>

<script>
import DisplayThemeConfigMixin from "../DisplayThemeConfigMixin.vue";

const availableViews = [
  { value: "dashboard", text: "Übersicht" },
  { value: "energy-flow", text: "Energiefluss" },
  { value: "charge-points", text: "Ladepunkte" },
  { value: "status", text: "Status" },
];

export default {
  name: "DisplayThemeCards",
  mixins: [DisplayThemeConfigMixin],
  computed: {
    enabledViews() {
      return availableViews.filter(
        (view) => this.displayTheme.configuration[`enable_${view.value.replace("-", "_")}_view`],
      );
    },
  },
  methods: {
    toggleView(view) {
      if (this.displayTheme.configuration.default_view === view) {
        this.updateConfiguration(undefined, "configuration.default_view");
      }
      this.updateConfiguration(
        !this.displayTheme.configuration[`enable_${view}_view`],
        `configuration.enable_${view}_view`,
      );
    },
  },
};
</script>
