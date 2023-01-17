<template>
	<div class="pvChargeConfig">
		<form name="pvChargeConfigForm">
			<openwb-base-card title="Regelparameter">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Regelmodus"
						:buttons="[
							{ buttonValue: 'export', text: 'Einspeisung' },
							{ buttonValue: 'import', text: 'Bezug' },
							{ buttonValue: 'individual', text: 'Individuell' },
						]"
						:model-value="calculateControlMode()"
						@update:model-value="setControlMode($event)"
					>
						<template #help>
							Mit dieser Einstellung wird der angestrebte
							Regelbereich festgelegt. "Einspeisung" und "Bezug"
							definieren einen Bereich mit minimaler Einspeisung
							(-230W, 0W) bzw. minimalem Netzbezug (0W, 230W). Mit
							der Auswahl "individuell" kann ein eigener
							Regelbereich definiert werden.
						</template>
					</openwb-base-button-group-input>
					<openwb-base-number-input
						v-if="calculateControlMode() === 'individual'"
						title="Minimum"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/control_range'
							][0] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event * 1000,
								'0'
							)
						"
					>
						<template #help>
							Untere Grenze des Regelbereichs.
						</template>
					</openwb-base-number-input>
					<openwb-base-number-input
						v-if="calculateControlMode() === 'individual'"
						title="Maximum"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/control_range'
							][1] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/control_range',
								$event * 1000,
								'1'
							)
						"
					>
						<template #help
							>Obere Grenze des Regelbereichs.</template
						>
					</openwb-base-number-input>
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
								$event * 1000
							)
						"
					>
						<template #help>
							Hier ist die vorgeschriebene Einspeisegrenze
							anzugeben. Wird die Option "Einspeisegrenze
							beachten" für ein Ladeprofil eingeschaltet, dann
							wird der Regelpunkt auf diesen Wert verschoben. Die
							Ladung startet demnach erst, wenn der hier
							hinterlegte Wert an Einspeisung erreicht wird. Der
							hier eingetragene Wert sollte zur optimalen
							Eigenverbrauchssteuerung einige hundert Watt unter
							der im Wechselrichter hinterlegten Einspeisegrenze
							liegen, damit openWB die Ladung freigibt, bevor der
							Wechselrichter begrenzt wird.<br />
							Die Nutzung dieser Option ergibt nur Sinn, wenn ein
							Wechselrichter mit Smart-Meter verbaut ist, welches
							eine dynamische Begrenzung der Einspeiseleistung
							bietet.
						</template>
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
								$event * 1000
							)
						"
					>
						<template #help>
							Ist in Abhängigkeit von dem gesetzten Regelbereich
							mehr als die hier hinterlegte Leistung (pro Phase)
							verfügbar, dann wird der Ladevorgang gestartet.
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
								$event
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
						:min="0"
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
								$event * 1000
							)
						"
					>
						<template #help>
							Wird der Regelbereich um diese Leistung
							unterschritten, so wird der Ladevorgang beendet oder
							(falls möglich) auf eine einphasige Ladung
							umgeschaltet.
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
								$event
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
				</div>
			</openwb-base-card>
			<openwb-base-card title="Phasenumschaltung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
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
								$event
							)
						"
					>
						<template #help>
							Hier kann eingestellt werden, ob Ladevorgänge im
							Modus "PV-Laden" mit nur einer Phase oder dem
							möglichen Maximum in Abhängigkeit vom Ladepunkt und
							Fahrzeug durchgeführt werden. Im Modus "Automatik"
							entscheidet die Regelung, welche Einstellung genutzt
							wird, um den verfügbaren Überschuss in die Fahrzeuge
							zu laden.
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
								$event
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
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Priorisierung"
						:buttons="[
							{ buttonValue: false, text: 'Fahrzeuge' },
							{ buttonValue: true, text: 'Speicher' },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/bat_prio'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/bat_prio',
								$event
							)
						"
					>
						<template #help>
							Bei der Auswahl "Fahrzeuge" wird auch eventuell
							vorhandene Ladeleistung eines Speichers für die
							verfügbare Ladeleistung berücksichtigt. Im Modus
							"Speicher" hingegen wird dieser nicht in seiner
							Ladeleistung begrenzt.<br />
							Beide Modi lassen sich mit den zusätzlichen
							Einstellungen an die eigenen Bedürfnisse anpassen,
							sodass auch ein Mischbetrieb möglich ist.
						</template>
					</openwb-base-button-group-input>
					<openwb-base-range-input
						title="Einschalt-SoC"
						:min="0"
						:max="19"
						:step="1"
						unit="%"
						:labels="[
							{ label: 'Aus', value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_on_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_on_soc',
								$event
							)
						"
					>
						<template #help
							>Wenn der Einschalt-SoC erreicht wird, wird der
							Speicher im Modus PV-Laden bis zum Ausschalt-SoC
							entladen.</template
						>
					</openwb-base-range-input>
					<openwb-base-range-input
						title="Ausschalt-SoC"
						:min="0"
						:max="19"
						:step="1"
						unit="%"
						:labels="[
							{ label: 'Aus', value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/switch_off_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/switch_off_soc',
								$event
							)
						"
					>
						<template #help
							>Wenn der Einschalt-SoC erreicht wird, wird der
							Speicher im Modus PV-Laden bis zum Ausschalt-SoC
							entladen.</template
						>
					</openwb-base-range-input>
					<openwb-base-number-input
						title="Reservierte Ladeleistung"
						:min="0"
						:step="0.1"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/charging_power_reserve'
							] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/charging_power_reserve',
								$event * 1000
							)
						"
					>
						<template #help
							>Diese Speicher-Leistung wird von der Regelung auch
							bei EV-Vorrang nicht zum Laden verwendet und bleibt
							immer dem Speicher vorbehalten.</template
						>
					</openwb-base-number-input>
					<openwb-base-number-input
						title="Erlaubte Entladeleistung"
						:min="0"
						:step="0.1"
						unit="kW"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/rundown_power'
							] / 1000
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/rundown_power',
								$event * 1000
							)
						"
					>
						<template #help
							>Die erlaubte Entladeleistung wird von der Regelung
							bei Speicher-Vorrang zum Laden der Fahrzeuge
							verwendet, solange der Speicher-Soc über dem
							minimalen Entlade-SoC liegt.</template
						>
					</openwb-base-number-input>
					<openwb-base-range-input
						title="Minimaler Entlade-SoC"
						:min="0"
						:max="20"
						:step="1"
						unit="%"
						:labels="[
							{ label: 0, value: 0 },
							{ label: 5, value: 5 },
							{ label: 10, value: 10 },
							{ label: 15, value: 15 },
							{ label: 20, value: 20 },
							{ label: 25, value: 25 },
							{ label: 30, value: 30 },
							{ label: 35, value: 35 },
							{ label: 40, value: 40 },
							{ label: 45, value: 45 },
							{ label: 50, value: 50 },
							{ label: 55, value: 55 },
							{ label: 60, value: 60 },
							{ label: 65, value: 65 },
							{ label: 70, value: 70 },
							{ label: 75, value: 75 },
							{ label: 80, value: 80 },
							{ label: 85, value: 85 },
							{ label: 90, value: 90 },
							{ label: 95, value: 95 },
							{ label: 'Aus', value: 100 },
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/chargemode_config/pv_charging/rundown_soc'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/chargemode_config/pv_charging/rundown_soc',
								$event
							)
						"
					>
						<template #help>
							Ein vorhandener Speicher wird im Modus PV-Laden mit
							der erlaubten Entladeleistung höchstens bis zu dem
							hier eingestellten Ladestand entladen.
						</template>
					</openwb-base-range-input>
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
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "OpenwbPVChargeConfig",
	mixins: [ComponentStateMixin],
	methods: {
		calculateControlMode() {
			const topic =
				"openWB/general/chargemode_config/pv_charging/control_range";
			let state = this.$store.state.mqtt[topic];
			// console.log(typeof state);
			if (typeof state != "undefined") {
				if (state[0] === -230 && state[1] === 0) {
					return "export";
				}
				if (state[0] === 0 && state[1] === 230) {
					return "import";
				}
				return "individual";
			}
		},
		setControlMode(newMode) {
			const topic =
				"openWB/general/chargemode_config/pv_charging/control_range";
			console.debug("set controlMode", newMode);
			switch (newMode) {
				case "export":
					this.updateState(topic, [-230, 0]);
					break;
				case "import":
					this.updateState(topic, [0, 230]);
					break;
				case "individual":
					this.updateState(topic, [-230, 230]);
					break;
			}
		},
	},
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
				"openWB/general/chargemode_config/pv_charging/bat_prio",
				"openWB/general/chargemode_config/pv_charging/switch_on_soc",
				"openWB/general/chargemode_config/pv_charging/switch_off_soc",
				"openWB/general/chargemode_config/pv_charging/charging_power_reserve",
				"openWB/general/chargemode_config/pv_charging/rundown_power",
				"openWB/general/chargemode_config/pv_charging/rundown_soc",
			],
		};
	},
};
</script>
