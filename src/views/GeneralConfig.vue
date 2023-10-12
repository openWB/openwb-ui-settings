<template>
	<div class="generalConfig">
		<form name="generalConfigForm">
			<openwb-base-card title="Steuerungsmodus">
				<openwb-base-alert subtype="info">
					Wird für den Steuerungsmodus "primary" gewählt, übernimmt
					diese openWB die alleinige Regelung und steuert ggf.
					vorhandene weitere openWB (z.B. externe openWB im
					Steuermodus secondary, openWB Pro, Satellit u.a.) fern. Sie
					werden in den Ladepunkt-Einstellungen der primary-openWB
					hinzugefügt.
					<br /><br />
					Wird für den Steuerungsmodus "secondary" gewählt, übernimmt
					diese openWB keine Regelung und muss von einer anderen
					primary openWB ferngesteuert werden. Wichtig ist, dass in
					der secondary-openWB eine "interne openWB" mit der korrekten
					Bauart (= openWB-Hardwarevariante z.B. "Custom, Standard,
					Standard+, Duo, Buchse") konfiguriert ist. Bei einer Duo
					sind zwei "interne openWB" zu konfigurieren. Im
					"secondary"-Modus bleiben alle ausgeblendeten Einstellungen
					unbeachtet.<br />
					Eine bebilderte Anleitung zur Konfiguration der Ladepunkte
					findest Du auf der
					<a
						href="https://openwb.de/main/?page_id=1025"
						target="_blank"
						rel="noopener noreferrer"
					>
						Homepage </a
					>.
				</openwb-base-alert>
				<openwb-base-button-group-input
					title="Steuerungsmodus"
					:buttons="[
						{
							buttonValue: false,
							text: 'primary',
							class: 'btn-outline-danger',
						},
						{
							buttonValue: true,
							text: 'secondary',
							class: 'btn-outline-success',
						},
					]"
					:model-value="$store.state.mqtt['openWB/general/extern']"
					@update:model-value="
						updateState('openWB/general/extern', $event)
					"
				>
				</openwb-base-button-group-input>
			</openwb-base-card>
			<openwb-base-card title="Hardware">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Geschwindigkeit Regelintervall"
						:buttons="[
							{
								buttonValue: 10,
								text: 'Normal',
								class: 'btn-outline-success',
							},
							{
								buttonValue: 20,
								text: 'Langsam',
								class: 'btn-outline-warning',
							},
							{
								buttonValue: 60,
								text: 'Sehr Langsam',
								class: 'btn-outline-danger',
							},
						]"
						:model-value="
							$store.state.mqtt['openWB/general/control_interval']
						"
						@update:model-value="
							updateState(
								'openWB/general/control_interval',
								$event
							)
						"
					>
						<template #help>
							Sollten Probleme oder Fehlermeldungen auftauchen,
							stelle bitte zunächst das Regelintervall auf
							"Normal". Werden Module genutzt, welche z.B. eine
							Online-API zur Abfrage nutzen (höhere Latenzzeiten)
							oder möchte man weniger Regeleingriffe, so kann man
							das Regelintervall auf "Langsam" (20 Sekunden)
							herabsetzen. Die Einstellung „Sehr Langsam“ führt zu
							einer Regelzeit von 60 Sekunden.<br />
							<span class="text-danger">
								Nicht nur die Regelung der PV geführten Ladung,
								sondern auch die Ladestromänderung,
								beispielsweise “Stop“ etc., werden dann nur noch
								in diesem Intervall ausgeführt. Die Regelung
								wird insgesamt träger. Solange es keinen
								triftigen Grund gibt, sollte "Normal" gewählt
								werden.
							</span>
						</template>
					</openwb-base-button-group-input>
					<openwb-base-button-group-input
						title="Netzschutz"
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
						:model-value="
							$store.state.mqtt[
								'openWB/general/grid_protection_configured'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/grid_protection_configured',
								$event
							)
						"
					>
						<template #help>
							Diese Option ist standardmäßig aktiviert und sollte
							so belassen werden. Bei Unterschreitung einer
							kritischen Frequenz des Stromnetzes wird die Ladung
							nach einer zufälligen Zeit zwischen 1 und 90
							Sekunden pausiert. Der Lademodus wechselt auf
							"Stop". Sobald die Frequenz wieder in einem normalen
							Bereich ist wird automatisch der zuletzt gewählte
							Lademodus wieder aktiviert. Ebenso wird die Ladung
							bei Überschreiten von 51,8 Hz unterbrochen. Dies ist
							dann der Fall, wenn der Energieversorger
							Wartungsarbeiten am (Teil-)Netz durchführt und auf
							einen vorübergehenden Generator-Betrieb umschaltet.
							Die Erhöhung der Frequenz wird durchgeführt, um die
							PV Anlagen abzuschalten.<br />
							<span class="text-danger">
								Die Option ist nur aktiv, wenn der EVU-Zähler
								die Frequenz übermittelt.
							</span>
						</template>
					</openwb-base-button-group-input>
					<!-- <openwb-base-button-group-input
						title="Taster-Eingänge"
						:model-value="
							$store.state.mqtt[
								'openWB/general/external_buttons_hw'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/external_buttons_hw',
								$event
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
					>
						<template #help>
							Wenn diese Option aktiviert ist, können bis zu fünf
							Taster an die openWB angeschlossen werden. Die
							entsprechenden Kontakte sind auf der Add-On-Platine
							beschriftet.<br />
							Bei Installationen ohne die Zusatzplatine können
							folgende GPIOs benutzt werden, die durch die Taster
							auf Masse zu schalten sind:
							<ul>
								<li>Taster 1: Pin 32 / GPIO 12</li>
								<li>Taster 2: Pin 36 / GPIO 16</li>
								<li>Taster 3: Pin 31 / GPIO 6</li>
								<li>Taster 4: Pin 33 / GPIO 13</li>
								<li>Taster 5: Pin 40 / GPIO 21</li>
							</ul>
						</template>
					</openwb-base-button-group-input> -->
				</div>
			</openwb-base-card>
			<!-- <openwb-base-card title="Benachrichtigungen">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-select-input
						title="Anbieter"
						:model-value="
							$store.state.mqtt[
								'openWB/general/notifications/selected'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/notifications/selected',
								$event
							)
						"
						:options="[
							{ value: 'none', text: 'Kein Anbieter' },
							{ value: 'pushover', text: 'Pushover' },
						]"
					/>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/general/notifications/selected'
							] == 'pushover'
						"
					>
						<openwb-base-alert subtype="info">
							Zur Nutzung von Pushover muss ein Konto auf
							Pushover.net bestehen. Zudem muss im
							Pushover-Nutzerkonto eine Applikation openWB
							eingerichtet werden, um den benötigten API-Token/Key
							zu erhalten.<br />
							Wenn Pushover eingeschaltet ist, werden die
							Zählerstände aller konfigurierten Ladepunkte immer
							zum 1. des Monats gepusht.
						</openwb-base-alert>
						<openwb-base-text-input
							title="Einstellungen"
							subtype="json"
							disabled="disabled"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/configuration'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/configuration',
									$event
								)
							"
						>
							<template #help>Nur zur Info!</template>
						</openwb-base-text-input>
						<openwb-base-text-input
							title="Pushover User Key"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/configuration'
								].user
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/configuration',
									$event,
									'user'
								)
							"
							subtype="user"
						/>
						<openwb-base-text-input
							title="Pushover API-Token/Key"
							subtype="password"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/configuration'
								].key
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/configuration',
									$event,
									'key'
								)
							"
						/>
					</div>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/general/notifications/selected'
							] != 'none'
						"
					>
						<hr />
						<openwb-base-heading>
							Benachrichtigungen
						</openwb-base-heading>
						<openwb-base-button-group-input
							title="Beim Starten der Ladung"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/start_charging'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/start_charging',
									$event
								)
							"
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
						/>
						<openwb-base-button-group-input
							title="Beim Stoppen der Ladung"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/stop_charging'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/stop_charging',
									$event
								)
							"
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
						/>
						<openwb-base-button-group-input
							title="Beim Einstecken eines Fahrzeugs"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/plug'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/plug',
									$event
								)
							"
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
						/>
						<openwb-base-button-group-input
							title="Bei Triggern von Smart Home Aktionen"
							:model-value="
								$store.state.mqtt[
									'openWB/general/notifications/smart_home'
								]
							"
							@update:model-value="
								updateState(
									'openWB/general/notifications/smart_home',
									$event
								)
							"
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
						/>
					</div>
				</div>
			</openwb-base-card> -->
			<openwb-base-card title="Darstellung">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-heading class="mt-0">
						Hauptseite
					</openwb-base-heading>
					<div
						v-if="
							$store.state.mqtt['openWB/general/web_theme'] !==
							undefined
						"
					>
						<openwb-base-select-input
							class="mb-2"
							title="Theme"
							:options="webThemeList"
							:model-value="
								$store.state.mqtt['openWB/general/web_theme']
									.type
							"
							@update:model-value="updateSelectedWebTheme($event)"
						/>
						<openwb-web-theme-proxy
							v-if="
								$store.state.mqtt['openWB/general/web_theme']
									.type
							"
							:webThemeType="
								$store.state.mqtt['openWB/general/web_theme']
									.type
							"
							:configuration="
								$store.state.mqtt['openWB/general/web_theme']
									.configuration
							"
							@update:configuration="
								updateConfiguration(
									'openWB/general/web_theme',
									$event
								)
							"
						/>
					</div>
					<hr />
					<openwb-base-heading> Lade-Log </openwb-base-heading>
					<openwb-base-number-input
						title="Preis je kWh"
						:min="0"
						:step="0.0001"
						unit="€"
						:model-value="
							$store.state.mqtt['openWB/general/price_kwh']
						"
						@update:model-value="
							updateState('openWB/general/price_kwh', $event)
						"
					>
						<template #help>
							Dient zur Berechnung der Ladekosten im Lade-Log.<br />
							Es können bis zu 4 Nachkommastellen genutzt werden.
						</template>
					</openwb-base-number-input>
					<openwb-base-button-group-input
						title="Einheit für Entfernungen"
						:model-value="
							$store.state.mqtt['openWB/general/range_unit']
						"
						@update:model-value="
							updateState('openWB/general/range_unit', $event)
						"
						:buttons="[
							{ buttonValue: 'km', text: 'Kilometer' },
							{ buttonValue: 'mi', text: 'Meilen' },
						]"
					/>
				</div>
			</openwb-base-card>
			<openwb-base-submit-buttons
				formName="generalConfigForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbWebThemeProxy from "../components/web_themes/OpenwbWebThemeProxy.vue";

export default {
	name: "OpenwbGeneralConfig",
	mixins: [ComponentState],
	components: { OpenwbWebThemeProxy },
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/control_interval",
				"openWB/general/grid_protection_configured",
				"openWB/general/external_buttons_hw",
				"openWB/general/notifications/selected",
				"openWB/general/notifications/configuration",
				"openWB/general/notifications/start_charging",
				"openWB/general/notifications/stop_charging",
				"openWB/general/notifications/plug",
				"openWB/general/notifications/smart_home",
				"openWB/general/price_kwh",
				"openWB/general/range_unit",
				"openWB/general/web_theme",
				"openWB/system/configurable/web_themes",
			],
		};
	},
	computed: {
		webThemeList: {
			get() {
				return this.$store.state.mqtt[
					"openWB/system/configurable/web_themes"
				];
			},
		},
	},
	methods: {
		getWebThemeDefaultConfiguration(webThemeType) {
			const webThemeDefaults = this.webThemeList.find(
				(element) => element.value == webThemeType
			);
			if (
				Object.prototype.hasOwnProperty.call(
					webThemeDefaults,
					"defaults"
				)
			) {
				return {
					...JSON.parse(
						JSON.stringify(webThemeDefaults.defaults.configuration)
					),
				};
			}
			console.warn(
				"no default configuration found for web theme type!",
				webThemeType
			);
			return {};
		},
		updateSelectedWebTheme($event) {
			this.updateState("openWB/general/web_theme", $event, "type");
			this.updateState(
				"openWB/general/web_theme",
				this.getWebThemeDefaultConfiguration($event),
				"configuration"
			);
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
	},
};
</script>
