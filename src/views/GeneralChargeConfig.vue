<template>
	<div class="generalChargeConfig">
		<form name="generalChargeConfigForm">
			<openwb-base-card title="Allgemein">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Begrenzung der Schieflast"
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
								'openWB/general/chargemode_config/unbalanced_load'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/unbalanced_load',
								$event
							)
						"
					>
						<template #help>
							Wenn diese Option aktiviert ist, werden
							nicht-dreiphasige Ladevorgänge so geregelt, dass am
							Netzanschlusspunkt (EVU-Zähler) die eingestellte
							Grenze für die Schieflast nicht überschritten wird.
							Hierfür muss der EVU-Zähler einzelne Phasenströme
							bereitstellen!<br />
							Weiterhin müssen bei den Ladepunkten sowie
							Fahrzeugen sämtliche Angaben zur Anzahl
							angeschlossener/unterstützter Phasen und der
							Phasenrotation hinterlegt werden, damit der Regelung
							bekannt ist, welcher Ladevorgang welche Phase am
							Netzanschluss beeinflusst. siehe "Konfiguration -
							Ladepunkte -> elektrischer Anschluss - Phase 1" und
							"Konfiguration - Fahrzeuge -> Fahrzeug-Profile"
						</template>
					</openwb-base-button-group-input>
					<openwb-base-range-input
						v-if="
							$store.state.mqtt[
								'openWB/general/chargemode_config/unbalanced_load'
							]
						"
						title="Erlaubte Schieflast"
						:min="10"
						:max="32"
						:step="1"
						unit="A"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/unbalanced_load_limit'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/unbalanced_load_limit',
								$event
							)
						"
					>
						<template #help
							>Hiermit wird festgelegt, welche Schieflast am
							Netzanschlusspunkt erlaubt ist. Bei Überschreitung
							werden gezielt einzelne Ladevorgänge in der Leistung
							begrenzt.</template
						>
					</openwb-base-range-input>
					<openwb-base-button-group-input
						title="Phasenumschaltung wiederholt anstoßen"
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
								'openWB/general/chargemode_config/retry_failed_phase_switches'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/retry_failed_phase_switches',
								$event
							)
						"
					>
						<template #help>
							Wenn diese Option aktiviert ist, werden bis zu drei
							Umschaltversuche vorgenommen, wenn die vorgegebene
							und genutzte Phasenzahl nicht übereinstimmen. Wird
							die Option deaktiviert, wird nur eine Umschaltung
							durchgeführt.<br />
							Die gezählten Fehlversuche werden mit dem Abstecken
							zurückgesetzt.
						</template>
					</openwb-base-button-group-input>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="generalChargeConfigForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbGeneralChargeConfig",
	mixins: [ComponentState],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/retry_failed_phase_switches",
				"openWB/general/chargemode_config/unbalanced_load",
				"openWB/general/chargemode_config/unbalanced_load_limit",
			],
		};
	},
};
</script>
