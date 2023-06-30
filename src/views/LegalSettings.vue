<template>
	<div class="dataProtection">
		<form name="dataProtectionForm">
			<openwb-base-card title="Nutzungsbedingungen &amp; Datenschutzerklärung">
				<iframe
					src="dataProtection-usageTerms.html"
					width="100%"
					height="400px"
					class="bg-light"
				></iframe>
				<hr />
				<openwb-base-button-group-input
					title="Nutzungsbedingungen"
					:buttons="[
						{
							buttonValue: false,
							text: 'Ablehnen',
							class: 'btn-outline-danger',
						},
						{
							buttonValue: true,
							text: 'Akzeptieren',
							class: 'btn-outline-success',
						},
					]"
					:model-value="
						$store.state.mqtt[
							'openWB/system/usage_terms_acknowledged'
						]
					"
					@update:model-value="
						updateState(
							'openWB/system/usage_terms_acknowledged',
							$event
						)
					"
				/>
				<openwb-base-alert
					v-if="!$store.state.mqtt[
							'openWB/system/usage_terms_acknowledged'
						]"
					subtype="danger"
				>
					Sie müssen die Nutzungsbedingungen akzeptieren, bevor openWB
					eingesetzt werden kann.
				</openwb-base-alert>
				<openwb-base-button-group-input
					title="Datenschutzerklärung"
					:buttons="[
						{
							buttonValue: false,
							text: 'Ablehnen',
							class: 'btn-outline-danger',
						},
						{
							buttonValue: true,
							text: 'Akzeptieren',
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
				<openwb-base-alert
					v-if="!$store.state.mqtt[
							'openWB/system/dataprotection_acknowledged'
						]"
					subtype="warning"
				>
					Wenn sie nicht einwilligen, wird eine ggf. konfigurierte
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
				"openWB/system/dataprotection_acknowledged",
				// "openWB/system/usage_terms_acknowledged", // already done in app.vue
			],
		};
	},
};
</script>
