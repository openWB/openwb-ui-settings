<template>
	<div class="dataprotection">
		<openwb-base-card title="Fehlerbericht">
			<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
				<openwb-base-alert subtype="info">
					Diese openWB befindet sich im Modus "Nur Ladepunkt". Bitte
					senden Sie den Fehlerbericht von der regelnden openWB.
				</openwb-base-alert>
			</div>
			<div v-else>
				<iframe
					:src="publicPath + 'dataprotection.html'"
					width="100%"
					height="400px"
					class="bg-light"
				/>
				<hr />
				<openwb-base-button-group-input
					title="Akzeptieren"
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
					:model-value="
						$store.state.mqtt[
							'openWB/system/dataprotection_acknowledged'
						]
					"
					@update:model-value="
						updateState(
							'openWB/system/dataprotection_acknowledged',
							$event
						)
					"
				/>
				<openwb-base-alert subtype="warning">
					Wenn sie nicht einwilligen wird eine ggf. konfigurierte
					Cloud Anbindung gelöscht. Die openWB arbeitet autark wie
					gewohnt weiter. Fernzugriff und Remote Support sind dann
					nicht mehr möglich!
				</openwb-base-alert>
			</div>
		</openwb-base-card>
		<openwb-base-submit-buttons
			@save="$emit('save')"
			@reset="$emit('reset')"
			@defaults="$emit('defaults')"
		/>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "Dataprotection",
	mixins: [ComponentStateMixin],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
			],
		};
	},
	computed: {
		publicPath() {
			return this.$root.publicPath;
		},
	},
};
</script>
