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
			<openwb-base-card title="Optional">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-heading>
						Strompreisbasiertes Laden
					</openwb-base-heading>
					<openwb-base-alert subtype="info">
						Bei Sofortladen wird nur geladen, wenn der Strompreis
						unter dem maximalen angegeben Strompreis liegt. Für
						Zielladen wird die Ladedauer ermittelt und dann zu den
						günstigsten Stunden geladen.
					</openwb-base-alert>
					<openwb-base-select-input
						class="mb-2"
						title="Anbieter"
						:options="electricityTariffList"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/et/config/provider'
							]
								? $store.state.mqtt[
										'openWB/optional/et/config/provider'
								  ].type
								: ''
						"
						@update:model-value="
							updateSelectedElectricityTariff($event)
						"
					/>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/et/config/provider'
							] &&
							$store.state.mqtt[
								'openWB/optional/et/config/provider'
							].type
						"
					>
						<openwb-electricity-tariff-proxy
							:electricityTariffType="
								$store.state.mqtt[
									'openWB/optional/et/config/provider'
								].type
							"
							:configuration="
								$store.state.mqtt[
									'openWB/optional/et/config/provider'
								].configuration
							"
							@update:configuration="
								updateConfiguration(
									'openWB/optional/et/config/provider',
									$event
								)
							"
						/>
						<openwb-base-heading>
								Einstellungen für strompreisbasiertes Laden
							</openwb-base-heading>
						<openwb-base-number-input
								title="Maximaler Strompreis für Sofortladen"
								min="-80"
								max="80"
								step="0.01"
								unit="ct/kWh"
								:model-value="
									$store.state.mqtt[
										'openWB/optional/et/config/max_price'
									] * 100000
								"
								@update:model-value="
									updateState(
										'openWB/optional/et/config/max_price',
										$event / 100000
									)
								"
							/>
					</div>
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
import OpenwbElectricityTariffProxy from "../components/electricity_tariffs/OpenwbElectricityTariffProxy.vue";

export default {
	name: "OpenwbGeneralChargeConfig",
	mixins: [ComponentState],
	components: {
		OpenwbElectricityTariffProxy,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/retry_failed_phase_switches",
				"openWB/general/chargemode_config/unbalanced_load",
				"openWB/general/chargemode_config/unbalanced_load_limit",
				"openWB/optional/et/config/provider",
				"openWB/optional/et/config/max_price",
				"openWB/system/configurable/electricity_tariffs",
			],
		};
	},
	computed: {
		electricityTariffList() {
			return this.$store.state.mqtt[
				"openWB/system/configurable/electricity_tariffs"
			];
		},
	},
	methods: {
		getElectricityTariffDefaultConfiguration(electricityTariffType) {
			const electricityTariffDefaults = this.electricityTariffList.find(
				(element) => element.value == electricityTariffType
			);
			if (
				Object.prototype.hasOwnProperty.call(
					electricityTariffDefaults,
					"defaults"
				)
			) {
				return { ...electricityTariffDefaults.defaults };
			}
			console.warn(
				"no default configuration found for electricity tariff type!",
				electricityTariffType
			);
			return {};
		},
		updateSelectedElectricityTariff($event) {
			this.updateState(
				"openWB/optional/et/config/provider",
				$event,
				"type"
			);
			this.updateState(
				"openWB/optional/et/config/provider",
				this.getElectricityTariffDefaultConfiguration($event)
			);
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
	},
};
</script>
