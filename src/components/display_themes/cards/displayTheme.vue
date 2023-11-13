<template>
	<div class="display-theme-cards">
		<openwb-base-heading>
			Einstellungen für Display Theme {{ displayTheme.name }}
		</openwb-base-heading>
		<openwb-base-heading>Bediensperre</openwb-base-heading>
		<openwb-base-button-group-input
			title="Bedienung sperren"
			:model-value="displayTheme.configuration.lock_changes"
			@update:model-value="
				updateConfiguration($event, 'configuration.lock_changes')
			"
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
		/>
		<openwb-base-text-input
			v-if="displayTheme.configuration.lock_changes"
			title="PIN zur Freigabe"
			subtype="password"
			required
			pattern="[0-9]{4,10}"
			:model-value="displayTheme.configuration.lock_changes_code"
			@update:model-value="
				updateConfiguration($event, 'configuration.lock_changes_code')
			"
		>
			<template #help>
				Der PIN muss aus 4 bis 10 Zahlen bestehen.
			</template>
		</openwb-base-text-input>
		<openwb-base-heading>Ansicht "Übersicht"</openwb-base-heading>
		<openwb-base-button-group-input
			title="Übersicht anzeigen"
			:model-value="displayTheme.configuration.enable_dashboard_view"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_view'
				)
			"
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
		/>
		<openwb-base-button-group-input
			v-if="displayTheme.configuration.enable_dashboard_view"
			title="EVU anzeigen"
			:model-value="displayTheme.configuration.enable_dashboard_card_grid"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_card_grid'
				)
			"
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
		/>
		<openwb-base-button-group-input
			v-if="displayTheme.configuration.enable_dashboard_view"
			title="Hausverbrauch anzeigen"
			:model-value="
				displayTheme.configuration
					.enable_dashboard_card_home_consumption
			"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_card_home_consumption'
				)
			"
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
		/>
		<openwb-base-button-group-input
			v-if="displayTheme.configuration.enable_dashboard_view"
			title="Batteriespeicher anzeigen"
			:model-value="
				displayTheme.configuration.enable_dashboard_card_battery_sum
			"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_card_battery_sum'
				)
			"
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
		/>
		<openwb-base-button-group-input
			v-if="displayTheme.configuration.enable_dashboard_view"
			title="Ladepunkte anzeigen"
			:model-value="
				displayTheme.configuration
					.enable_dashboard_card_charge_point_sum
			"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_card_charge_point_sum'
				)
			"
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
		/>
		<openwb-base-button-group-input
			v-if="displayTheme.configuration.enable_dashboard_view"
			title="PV anzeigen"
			:model-value="
				displayTheme.configuration.enable_dashboard_card_inverter_sum
			"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_dashboard_card_inverter_sum'
				)
			"
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
		/>
		<openwb-base-heading>Ansicht "Ladepunkte"</openwb-base-heading>
		<openwb-base-button-group-input
			title="Ladepunkte anzeigen"
			:model-value="displayTheme.configuration.enable_charge_points_view"
			@update:model-value="
				updateConfiguration(
					$event,
					'configuration.enable_charge_points_view'
				)
			"
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
		/>
		<openwb-base-heading>Ansicht "Status"</openwb-base-heading>
		<openwb-base-button-group-input
			title="Status anzeigen"
			:model-value="displayTheme.configuration.enable_status_view"
			@update:model-value="
				updateConfiguration($event, 'configuration.enable_status_view')
			"
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
		/>
	</div>
</template>

<script>
export default {
	name: "DisplayThemeCards",
	emits: ["update:configuration"],
	props: {
		displayTheme: { type: Object, required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
