<template>
	<div class="pvChargeConfig">
		<form name="pvChargeConfigForm">
			<openwb-base-card title="Regelparameter">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Regelmodus"
						:buttons="[
							{ buttonValue: 'export', text: 'Einspeisung' },
							{ buttonValue: 'import', text: 'Bezug' },
							{ buttonValue: 'balanced', text: 'Ausgewogen' },
							{ buttonValue: 'individual', text: 'Individuell' },
						]"
						v-model="controlMode"
					>
						<template #help>
							Der Regelbereich wird auf den gesamten Überschuss
							angewendet, bevor die PV-Regelung durchgeführt wird.
							D.h. der Regelbereich wird auf alle Einstellungen
							für das PV-Laden angewendet und nur einmal
							unabhängig von der Anzahl der angesteckten
							Fahrzeuge. Liegt der Überschuss im vorgegebenen
							Regelbereich, wird nicht nachgeregelt. Liegt der
							Überschuss außerhalb des Regelbereichs, wird in die
							Mitte des Regelbereichs nachgeregelt.<br />
							"Einspeisung" definiert einen Bereich mit minimaler
							Einspeisung (-230W, 0W), "Bezug" mit minimalem
							Netzbezug (0W, 230W), "Ausgewogen" mit ausgewogenem
							Netzbezug (-115W, 115W). Mit der Auswahl
							"individuell" kann ein eigener Regelbereich
							definiert werden.<br />
							Bei Speichervorrang erzeugt die Regelung bei Bedarf
							unabhängig vom eingestellten Regelmodus Einspeisung,
							damit der Speicher seine Ladeleistung erhöht.
						</template>
					</openwb-base-button-group-input>
					<openwb-base-number-input
						:disabled="controlMode !== 'individual'"
						:readonly="controlMode !== 'individual'"
						title="Minimum"
						:step="0.005"
						unit="kW"
						:model-value="
							Array.isArray(
								$store.state.mqtt[
									'openWB/general/chargemode_config/pv_charging/control_range'
								],
							)
								? $store.state.mqtt[
										'openWB/general/chargemode_config/pv_charging/control_range'
									][0] / 1000
								: undefined
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event * 1000,
								'0',
							)
						"
					>
						<template #help>
							Untere Grenze des Regelbereichs.
						</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						:disabled="controlMode !== 'individual'"
						:readonly="controlMode !== 'individual'"
						title="Maximum"
						:step="0.005"
						unit="kW"
						:model-value="
							Array.isArray(
								$store.state.mqtt[
									'openWB/general/chargemode_config/pv_charging/control_range'
								],
							)
								? $store.state.mqtt[
										'openWB/general/chargemode_config/pv_charging/control_range'
									][1] / 1000
								: undefined
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event * 1000,
								'1',
							)
						"
					>
						<template #help
							>Obere Grenze des Regelbereichs.</template
						>
					</openwb-base-number-input>
					<hr />
					<openwb-base-number-input
						title="Einschaltschwelle"
						:min="0"
						:step="0.05"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_threshold'
							] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_threshold',
								$event * 1000,
							)
						"
					>
						<template #help>
							Wird der Regelbereich in Richtung Einspeisung um
							diese Leistung überschritten, so wird der
							Ladevorgang gestartet.<br />
							Dieser Wert wird pro Phase genutzt und ist daher
							immer für eine Phase anzugeben.
						</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Einschaltverzögerung"
						:min="0"
						:step="1"
						unit="s"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_delay'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_delay',
								$event,
							)
						"
					>
						<template #help>
							Die Einschaltschwelle muss für die hier angegebene
							Zeit dauerhaft überschritten werden, bevor ein
							Ladevorgang gestartet wird.<br />
							Wenn ein Ladevorgang aktiv ist und auf PV-Laden
							umgeschaltet wird, wird weiter geladen, wenn die
							Abschaltschwelle nicht unterschritten wird.
						</template>
					</openwb-base-number-input>
					<hr />
					<openwb-base-number-input
						title="Abschaltschwelle"
						:step="0.05"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_threshold'
							] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_threshold',
								$event * 1000,
							)
						"
					>
						<template #help>
							Wird der Regelbereich in Richtung Netzbezug um diese
							Leistung überschritten, so wird der Ladevorgang
							beendet.<br />
							Dieser Wert ist unabhängig von der Anzahl genutzter
							Phasen.
						</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Abschaltverzögerung"
						:min="0"
						:step="1"
						unit="s"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_delay'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_delay',
								$event,
							)
						"
					>
						<template #help>
							Die Abschaltschwelle muss für die hier angegebene
							Zeit dauerhaft unterschritten werden, bevor ein
							Ladevorgang beendet wird.<br />
							Wenn ein Ladevorgang aktiv ist und auf PV-Laden
							umgeschaltet wird, wird die Ladung sofort beendet,
							wenn die Abschaltschwelle unterschritten wird.
						</template>
					</openwb-base-number-input>
					<hr />
					<openwb-base-number-input
						title="Regelpunkt Einspeisegrenze"
						:min="0"
						:step="0.05"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/feed_in_yield'
							] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/feed_in_yield',
								$event * 1000,
							)
						"
					>
						<template #help>
							Ein Wert größer 0kW bewirkt, dass weniger
							PV-Leistung zum Laden benutzt wird.<br />
							Die Nutzung dieser Option ergibt nur Sinn, wenn ein
							Wechselrichter mit separatem Smart-Meter am
							EVU-Punkt verbaut ist (nicht der originale Zähler
							des Versorgers!), welches eine dynamische Begrenzung
							der Einspeiseleistung am EVU-Punkt durch den
							PV-Wechselrichter bietet (bitte bei ev. Problemen
							immer vorab prüfen lassen).<br />
							Ist eine Einspeiseleistungsreduzierung verbaut (in
							vielen älteren, privaten Einspeiseverträgen z.B. als
							70% Regelung bekannt), wird mit Eingabe des Wertes
							"Regelpunkt Einspeisegrenze" ein
							eigenverbrauchsoptimiertes Fahrzeugladen mit
							PV-Überschussenergie möglich, die sonst abgeregelt
							werden würde (Nutzung der PV-Peaks).<br />
							Wird in einem "Ladeprofil" die Option
							"Einspeisegrenze beachten" eingeschaltet, so wird
							der Regelpunkt auf diesen Wert verschoben und die
							Ladung startet erst, wenn der hinterlegte Wert
							"Regelpunkt Einspeisegrenze" überschritten wird.<br />
							Zur optimalen Eigenverbrauchssteuerung sollte der
							Wert einige hundert Watt UNTER der im Wechselrichter
							hinterlegten EVU-Einspeiseleistungsgrenze liegen,
							damit openWB die Ladung freigibt, BEVOR der
							Wechselrichter begrenzt wird.
						</template>
					</openwb-base-number-input>
				</div>
			</openwb-base-card>
			<openwb-base-card title="Phasenumschaltung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Anzahl Phasen"
						:buttons="[
							{ buttonValue: 1, text: '1' },
							{ buttonValue: 3, text: 'Maximum' },
							{ buttonValue: 0, text: 'Automatik' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/phases_to_use'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/phases_to_use',
								$event,
							)
						"
					>
						<template #help>
							Hier kann eingestellt werden, ob Ladevorgänge im
							Modus "PV-Laden" mit nur einer Phase oder dem
							möglichen Maximum in Abhängigkeit der "Ladepunkt"-
							und "Fahrzeug"-Einstellungen durchgeführt werden. Im
							Modus "Automatik" entscheidet die Regelung, welche
							Einstellung genutzt wird, um den verfügbaren
							Überschuss in die Fahrzeuge zu laden. Voraussetzung
							ist die verbaute Umschaltmöglichkeit zwischen einer
							und drei Phasen (s.g. 1p3p).
						</template>
					</openwb-base-button-group-input>
					<openwb-base-range-input
						v-if="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/phases_to_use'
							] == 0
						"
						title="Verzögerung automat. Phasenumschaltung"
						:min="1"
						:max="15"
						:step="1"
						unit="Min."
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/phase_switch_delay'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/phase_switch_delay',
								$event,
							)
						"
					>
						<template #help>
							Um zu viele Umschaltungen zu vermeiden, wird Anhand
							dieses Wertes definiert, wann die Umschaltung
							erfolgen soll. Ist für durchgehend x Minuten die
							Maximalstromstärke erreicht, wird auf mehrphasige
							Ladung umgestellt. Ist die Ladung nur für ein
							Intervall unterhalb der Maximalstromstärke, beginnt
							das Intervall für die Umschaltung erneut. Ist die
							Ladung im mehrphasigen Modus für 16 - x Minuten auf
							der Minimalstromstärke, wird wieder auf einphasige
							Ladung gewechselt.
						</template>
					</openwb-base-range-input>
				</div>
			</openwb-base-card>
			<openwb-base-card title="Speicher-Beachtung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Laden mit Überschuss"
						:buttons="[
							{ buttonValue: 'ev_mode', text: 'Fahrzeuge' },
							{ buttonValue: 'bat_mode', text: 'Speicher' },
							{
								buttonValue: 'min_soc_bat_mode',
								text: 'Mindest-SoC des Speichers',
							},
						]"
						v-model="batMode"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/bat_mode'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/bat_mode',
								$event,
							)
						"
					>
						<template #help>
							Sofern ein Hausstromspeicher (im Folgenden
							"Speicher" genannt) im Energiesystem verbaut ist,
							kann dieser beim Fahrzeugladen mit berücksichtigt
							werden. Dies erfolgt passiv über die
							Berücksichtigung der Speicherleistungswerte und des
							Speicher-SoC. Eine aktive Speichersteuerung durch
							openWB ist aktuell mangels Speicherschnittstelle
							nicht möglich.<br /><br />
							Bei Auswahl "Fahrzeuge" wird der gesamte Überschuss
							in das EV geladen. Ist die maximale Ladeleistung der
							Fahrzeuge erreicht und es wird eingespeist, wird
							dieser Überschuss in den Speicher geladen.<br /><br />
							Bei Auswahl "Speicher" wird der gesamte Überschuss
							in den Speicher geladen. Ist die maximale
							Ladeleistung des Speichers erreicht und es wird
							eingespeist, wird dieser Überschuss unter Beachtung
							der Einschaltschwelle in die Fahrzeuge geladen.<br /><br />
							Bei Auswahl "Mindest-SoC des Speichers" wird der
							Überschuss bis zum Mindest-SoC in den Speicher
							geladen. Ist die maximale Ladeleistung des Speichers
							erreicht und es wird eingespeist, wird dieser
							Überschuss in die Fahrzeuge geladen. Wird der
							Mindest-SoC überschritten, wird der Überschuss ins
							Fahrzeug geladen.
						</template>
					</openwb-base-button-group-input>
					<div v-if="batMode === 'min_soc_bat_mode'">
						<openwb-base-number-input
							title="Ladeleistung für Speicher unterhalb des Mindest-SoC des Speichers [optional]"
							:min="0"
							:step="0.1"
							unit="kW"
							:model-value="
								$store.state.mqtt[
									'openWB/general/chargemode_config/pv_charging/ev_power_reserve'
								] / 1000
							"
							@update:model-value="
								updateState(
									'openWB/general/chargemode_config/pv_charging/ev_power_reserve',
									$event * 1000,
								)
							"
						>
							<template #help
								>ACHTUNG: Der hier eingestellte Wert darf die
								maximale Ladeleistung des Speichers nicht
								überschreiten.<br />
								Wird der Mindest-SoC des Speichers nicht
								erreicht, wird der Speicher mit der hier
								eingestellte Leistung geladen. Mit dem
								verbleibenden Überschuss werden die Fahrzeuge
								geladen.</template
							>
						</openwb-base-number-input>
						<openwb-base-range-input
							title="Mindest-SoC des Speichers"
							:min="0"
							:max="100"
							:step="1"
							unit="%"
							:required
							:model-value="
								$store.state.mqtt[
									'openWB/general/chargemode_config/pv_charging/min_bat_soc'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/chargemode_config/pv_charging/min_bat_soc',
									$event,
								)
							"
						>
							<template #help> </template>
						</openwb-base-range-input>
						<openwb-base-number-input
							title="Entladeleistung des Speichers oberhalb des Mindest-SoC des Speichers [optional]"
							:min="0"
							:step="0.1"
							unit="kW"
							:model-value="
								$store.state.mqtt[
									'openWB/general/chargemode_config/pv_charging/bat_power_discharge'
								] / 1000
							"
							@update:model-value="
								updateState(
									'openWB/general/chargemode_config/pv_charging/bat_power_discharge',
									$event * 1000,
								)
							"
						>
							<template #help
								>Wird der Mindest-SoC überschritten, wird der
								Überschuss ins Fahrzeug geladen und der Speicher
								mit der hier eingestellten Leistung in die
								Fahrzeuge entladen.</template
							>
						</openwb-base-number-input>
					</div>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="pvChargeConfigForm"
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
	name: "OpenwbPVChargeConfig",
	mixins: [ComponentState],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/chargemode_config/pv_charging/control_range",
				"openWB/general/chargemode_config/pv_charging/feed_in_yield",
				"openWB/general/chargemode_config/pv_charging/switch_on_threshold",
				"openWB/general/chargemode_config/pv_charging/switch_on_delay",
				"openWB/general/chargemode_config/pv_charging/switch_off_threshold",
				"openWB/general/chargemode_config/pv_charging/switch_off_delay",
				"openWB/general/chargemode_config/pv_charging/phases_to_use",
				"openWB/general/chargemode_config/pv_charging/phase_switch_delay",
				"openWB/general/chargemode_config/pv_charging/bat_mode",
				"openWB/general/chargemode_config/pv_charging/switch_on_soc",
				"openWB/general/chargemode_config/pv_charging/switch_off_soc",
				"openWB/general/chargemode_config/pv_charging/ev_power_reserve",
				"openWB/general/chargemode_config/pv_charging/bat_power_discharge",
				"openWB/general/chargemode_config/pv_charging/min_bat_soc",
			],
			calculatedControlMode: undefined,
		};
	},
	computed: {
		controlMode: {
			get() {
				if (this.calculatedControlMode !== undefined) {
					return this.calculatedControlMode;
				}
				const topic =
					"openWB/general/chargemode_config/pv_charging/control_range";
				let state = this.$store.state.mqtt[topic];
				var controlMode = "individual";
				if (typeof state != "undefined") {
					if (state[0] === -230 && state[1] === 0) {
						controlMode = "export";
					} else if (state[0] === 0 && state[1] === 230) {
						controlMode = "import";
					} else if (state[0] === -115 && state[1] === 115) {
						controlMode = "balanced";
					} else {
						controlMode = "individual";
					}
				}
				return controlMode;
			},
			set(newMode) {
				const topic =
					"openWB/general/chargemode_config/pv_charging/control_range";
				this.calculatedControlMode = newMode;
				switch (newMode) {
					case "export":
						this.updateState(topic, [-230, 0]);
						break;
					case "import":
						this.updateState(topic, [0, 230]);
						break;
					case "balanced":
						this.updateState(topic, [-115, 115]);
						break;
					case "individual":
						break;
				}
			},
		},
		batMode() {
			return this.$store.state.mqtt[
				"openWB/general/chargemode_config/pv_charging/bat_mode"
			];
		},
	},
	methods: {
		updateBatterySwitchOnSoc(event) {
			this.updateState(
				"openWB/general/chargemode_config/pv_charging/switch_on_soc",
				event,
			);
			if (
				event <=
				this.$store.state.mqtt[
					"openWB/general/chargemode_config/pv_charging/switch_off_soc"
				]
			) {
				this.updateState(
					"openWB/general/chargemode_config/pv_charging/switch_off_soc",
					Math.max(0, event - 5),
				);
			}
		},
		updateBatterySwitchOffSoc(event) {
			this.updateState(
				"openWB/general/chargemode_config/pv_charging/switch_off_soc",
				event,
			);
			if (
				event >=
				this.$store.state.mqtt[
					"openWB/general/chargemode_config/pv_charging/switch_on_soc"
				]
			) {
				this.updateState(
					"openWB/general/chargemode_config/pv_charging/switch_on_soc",
					event + 5,
				);
			}
		},
	},
	watch: {
		controlMode(newMode) {
			this.calculatedControlMode = newMode;
		},
	},
};
</script>
