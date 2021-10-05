<template>
	<div class="generalConfig">
		<form id="myForm">
			<card title="openWB">
				<button-group-input
					title="openWB ist nur ein Ladepunkt"
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
					:model-value="$store.state.mqtt['openWB/general/extern']"
					@update:model-value="
						updateState('openWB/general/extern', $event)
					"
				>
					<template #help>
						Wird hier Ja gewählt ist diese openWB nur ein Ladepunkt
						und übernimmt keine eigene Regelung. Hier ist Ja zu
						wählen wenn, bereits eine openWB vorhanden ist und diese
						nur ein weiterer Ladepunkt der vorhandenen openWB sein
						soll.
						<span class="text-danger">
							Alle in dieser openWB getätigten Einstellungen
							werden nicht beachtet.
						</span>
						An der Haupt openWB wird als Ladepunkt "externe openWB"
						gewählt und die IP Adresse eingetragen.
					</template>
				</button-group-input>
				<select-input
					v-if="$store.state.mqtt['openWB/general/extern'] === true"
					title="Display-Theme"
					:options="[
						{
							value: 'local',
							text: 'Normal',
						},
						{
							value: 'main',
							text: 'Anzeige der übergeordneten openWB',
						},
					]"
					:model-value="
						$store.state.mqtt['openWB/general/extern_display_mode']
					"
					@update:model-value="
						updateState(
							'openWB/general/extern_display_mode',
							$event
						)
					"
				>
					<template #help>
						Das Theme "Normal" zeigt lediglich die Ladeleistung des
						Ladepunktes an. Änderungen sind nicht möglich.<br />
						Wird hier "Anzeige der übergeordneten openWB"
						ausgewählt, dann ist die Darstellung identisch zum
						Display der regelnden openWB. Alle Anzeigen und
						Änderungen sind möglich.
					</template>
				</select-input>
			</card>
			<card title="Hardware">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<button-group-input
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
							Sollten Probleme, oder Fehlermeldungen, auftauchen,
							zunächst das Regelintervall auf "Normal" stellen.
							Werden Module genutzt, welche z.B. eine Online API
							zur Abfrage nutzen, oder möchte man weniger regeln,
							kann man das Regelintervall auf "Langsam" (20
							Sekunden) herabsetzen. Die Einstellungen „Sehr
							Langsam“ führt zu einer Regelzeit von 60
							Sekunden.<br />
							<span class="text-danger">
								Nicht nur die Regelung der PV geführten Ladung,
								sondern auch Ladestromänderung, beispielsweise
								“Stop“ etc., werden dann nur noch in diesem
								Intervall ausgeführt. Die Regelung wird
								insgesamt träger. Ebenso können eingestellte
								Verzögerungen um den Faktor der Änderung
								langsamer ausgeführt werden. Solange es keinen
								triftiten Grund gibt sollte immer Normal gewählt
								werden.
							</span>
						</template>
					</button-group-input>
					<button-group-input
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
							einen vorübergehenden Generatorbetrieb umschaltet.
							Die Erhöhung der Frequenz wird durchgeführt, um die
							PV Anlagen abzuschalten.<br />
							<span class="text-danger">
								Die Option ist nur aktiv, wenn der Ladepunkt die
								Frequenz übermittelt. Jede openWB Series1/2
								unterstützt dies.
							</span>
						</template>
					</button-group-input>
					<button-group-input
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
					</button-group-input>
				</div>
			</card>
			<card title="Benachrichtigungen">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<select-input
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
						<alert subtype="info">
							Zur Nutzung von Pushover muss ein Konto auf
							Pushover.net bestehen. Zudem muss im
							Pushover-Nutzerkonto eine Applikation openWB
							eingerichtet werden, um den benötigten API-Token/Key
							zu erhalten.<br />
							Wenn Pushover eingeschaltet ist, werden die
							Zählerstände aller konfigurierten Ladepunkte immer
							zum 1. des Monats gepusht.
						</alert>
						<text-input
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
						</text-input>
						<text-input
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
						<text-input
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
						<heading>Benachrichtigungen</heading>
						<button-group-input
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
						<button-group-input
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
						<button-group-input
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
						<button-group-input
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
			</card>
			<card title="Ladelog">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<number-input
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
							Dient zur Berechnung der Ladekosten im Ladelog.<br />
							Es können bis zu 4 Nachkommastellen genutzt werden.
						</template>
					</number-input>
					<button-group-input
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
			</card>
			<submit-buttons
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "GeneralConfig",
	mixins: [ComponentStateMixin],
	components: {
		Card,
		Alert,
		Heading,
		TextInput,
		NumberInput,
		// TextareaInput,
		// RangeInput,
		SelectInput,
		ButtonGroupInput,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/extern_display_mode",
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
			],
		};
	},
};
</script>
