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
      @update:model-value="updateConfiguration($event, 'configuration.enable_dashboard_view')"
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
      @update:model-value="updateConfiguration($event, 'configuration.enable_energy_flow_view')"
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
      @update:model-value="updateConfiguration($event, 'configuration.enable_charge_points_view')"
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
      @update:model-value="updateConfiguration($event, 'configuration.enable_status_view')"
    />
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

export default {
  name: "DisplayThemeCards",
  mixins: [DisplayThemeConfigMixin],
};
</script>
