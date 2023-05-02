<template>
	<div class="dataProtection">
		<form name="dataProtectionForm">
			<openwb-base-card title="Fehlerbericht">
				<iframe
					src="dataprotection.html"
					width="100%"
					height="400px"
					class="bg-light"
				></iframe>
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
				<template #footer>
					<openwb-base-submit-buttons
						formName="dataProtectionForm"
						:hideReset="true"
						:hideDefaults="true"
						@save="$emit('save')"
					/>
				</template>
			</openwb-base-card>
		</form>
	</div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbDataProtection",
	mixins: [ComponentState],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
			],
		};
	},
};
</script>
