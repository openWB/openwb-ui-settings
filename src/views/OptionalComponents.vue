<template>
	<div class="optionalComponents">
		<form name="optionalComponentsForm">
			<openwb-base-card title="RFID">
				<openwb-base-button-group-input
					title="RFID aktivieren"
					:model-value="
						$store.state.mqtt['openWB/optional/rfid/active']
					"
					@update:model-value="
						updateState('openWB/optional/rfid/active', $event)
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
						Dies bedingt das Vorhandensein eines RFID-Readers in
						deiner openWB. Bitte prüfe zuerst die
						Hardwareausstattung deiner openWB (z.B. Lieferschein).
					</template>
				</openwb-base-button-group-input>
				<div
					v-if="
						$store.state.mqtt['openWB/optional/rfid/active'] ===
						true
					"
				>
					<openwb-base-alert subtype="info">
						Die RFID-Tags, die an dem jeweiligen Ladepunkt gültig
						sind, müssen in dem Ladepunkt-Profil hinterlegt werden.
						Der RFID-Tag muss in den Einstellungen des Fahrzeugs
						diesem zugeordnet werden.<br />
						Es kann zuerst angesteckt und dann der RFID-Tag gescannt
						werden oder zuerst der RFID-Tag gescannt werden. Dann
						muss innerhalb von 5 Minuten ein Auto angesteckt werden,
						sonst wird der RFID-Tag verworfen. Das Auto wird erst
						nach dem Anstecken zugeordnet.<br />
						<span v-html="$store.state.text.rfidWiki"></span>
					</openwb-base-alert>
				</div>
			</openwb-base-card>
			<!-- <openwb-base-card title="LED-Ausgänge">
				<openwb-base-button-group-input
					title="LED-Ausgänge aktivieren"
					:model-value="
						$store.state.mqtt['openWB/optional/led/active']
					"
					@update:model-value="
						updateState('openWB/optional/led/active', $event)
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
				<div
					v-if="
						$store.state.mqtt['openWB/optional/led/active'] === true
					"
				>
					<openwb-base-alert subtype="info">
						ToDo: Informationen zu den verwendeten GPOIs ergänzen!
					</openwb-base-alert>
					<hr />
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === true
						"
					>
						<openwb-base-alert subtype="info">
							Diese Einstellungen sind nicht verfügbar, solange
							sich diese openWB im Steuerungsmodus "secondary"
							befindet.<br />
							Das Verhalten der LEDs wird durch die übergeordnete
							openWB festgelegt.
						</openwb-base-alert>
					</div>
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
					>
						<openwb-base-heading>
							Ladung nicht freigegeben
						</openwb-base-heading>
						<openwb-base-select-input
							title="Sofortladen"
							:model-value="
								$store.state.mqtt[
									'ToDo/optional/led/instant_blocked'
								]
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/instant_blocked',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="PV-Laden"
							:model-value="
								$store.state.mqtt[
									'ToDo/optional/led/pv_blocked'
								]
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/pv_blocked',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Zielladen"
							:model-value="
								$store.state.mqtt[
									'ToDo/optional/led/scheduled_blocked'
								]
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/scheduled_blocked',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Standby"
							:model-value="
								$store.state.mqtt[
									'ToDo/optional/led/standby_blocked'
								]
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/standby_blocked',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Stop"
							:model-value="
								$store.state.mqtt[
									'ToDo/optional/led/stop_blocked'
								]
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/stop_blocked',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<hr />
						<openwb-base-heading>
							Ladung freigegeben
						</openwb-base-heading>
						<openwb-base-select-input
							title="Sofortladen"
							:model-value="
								$store.state.mqtt['ToDo/optional/led/instant']
							"
							@update:model-value="
								updateState('ToDo/optional/led/instant', $event)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="PV-Laden"
							:model-value="
								$store.state.mqtt['ToDo/optional/led/pv']
							"
							@update:model-value="
								updateState('ToDo/optional/led/pv', $event)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Zielladen"
							:model-value="
								$store.state.mqtt['ToDo/optional/led/scheduled']
							"
							@update:model-value="
								updateState(
									'ToDo/optional/led/scheduled',
									$event
								)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Standby"
							:model-value="
								$store.state.mqtt['ToDo/optional/led/standby']
							"
							@update:model-value="
								updateState('ToDo/optional/led/standby', $event)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
						<openwb-base-select-input
							title="Stop"
							:model-value="
								$store.state.mqtt['ToDo/optional/led/stop']
							"
							@update:model-value="
								updateState('ToDo/optional/led/stop', $event)
							"
							:options="[
								{
									value: ['off', 'off', 'off'],
									text: 'Alle aus',
								},
							]"
							:groups="[
								{
									label: 'Dauernd an',
									options: [
										{
											value: ['on', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'on', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'on'],
											text: 'LED 3',
										},
										{
											value: ['on', 'on', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['on', 'off', 'on'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'on', 'on'],
											text: 'LEDs 2+3',
										},
										{
											value: ['on', 'on', 'on'],
											text: 'alle',
										},
									],
								},
								{
									label: 'Blinkend',
									options: [
										{
											value: ['blink', 'off', 'off'],
											text: 'LED 1',
										},
										{
											value: ['off', 'blink', 'off'],
											text: 'LED 2',
										},
										{
											value: ['off', 'off', 'blink'],
											text: 'LED 3',
										},
										{
											value: ['blink', 'blink', 'off'],
											text: 'LEDs 1+2',
										},
										{
											value: ['blink', 'off', 'blink'],
											text: 'LEDs 1+3',
										},
										{
											value: ['off', 'blink', 'blink'],
											text: 'LEDs 2+3',
										},
										{
											value: ['blink', 'blink', 'blink'],
											text: 'alle',
										},
									],
								},
							]"
						/>
					</div>
				</div>
			</openwb-base-card> -->
			<openwb-base-card title="Display (intern oder extern)">
				<openwb-base-button-group-input
					title="Integriertes Display"
					:model-value="
						$store.state.mqtt['openWB/optional/int_display/active']
					"
					@update:model-value="
						updateState(
							'openWB/optional/int_display/active',
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
				>
					<template #help>
						Je nach Bestellung kann die openWB mit oder ohne Display
						geliefert worden sein. Auch die Variante "Standalone"
						bietet beide Optionen. Bitte prüfe zuerst die
						Hardwareausstattung deiner openWB (z.B. Lieferschein).
					</template>
				</openwb-base-button-group-input>
				<div
					v-if="
						$store.state.mqtt[
							'openWB/optional/int_display/active'
						] == true
					"
				>
					<openwb-base-button-group-input
						title="Orientierung"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/rotation'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/rotation',
								$event
							)
						"
						:buttons="[
							{
								buttonValue: 0,
								text: '0°',
							},
							{
								buttonValue: 90,
								text: '90°',
							},
							{
								buttonValue: 180,
								text: '180°',
							},
							{
								buttonValue: 270,
								text: '270°',
							},
						]"
					>
						<template #help>
							Mit dieser Einstellung kann das Display im
							Uhrzeigersinn gedreht werden, falls erforderlich.
							Nach einer Änderung ist ein Neustart
							erforderlich!<br />
							Diese Einstellung erfordert ein Raspberry Pi
							Display. Anzeigen, welche über HDMI angeschlossen
							sind, werden nicht unterstützt.
						</template>
					</openwb-base-button-group-input>
					<hr />
					<openwb-base-heading> Display Standby </openwb-base-heading>
					<openwb-base-range-input
						title="Ausschaltzeit"
						:min="0"
						:max="12"
						:step="1"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/standby'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/standby',
								$event
							)
						"
						unit="Sek"
						:labels="[
							{
								label: 'Immer an',
								value: 0,
							},
							{
								label: 5,
								value: 5,
							},
							{
								label: 10,
								value: 10,
							},
							{
								label: 15,
								value: 15,
							},
							{
								label: 30,
								value: 30,
							},
							{
								label: 45,
								value: 45,
							},
							{
								label: '1 Min',
								value: 60,
							},
							{
								label: '1,5 Min',
								value: 90,
							},
							{
								label: '2 Min',
								value: 120,
							},
							{
								label: '3 Min',
								value: 180,
							},
							{
								label: '4 Min',
								value: 240,
							},
							{
								label: '5 Min',
								value: 300,
							},
							{
								label: '10 Min',
								value: 600,
							},
						]"
					>
						<template #help>
							Hier kann eine Zeitspanne angegeben werden, nach der
							das Display ausgeschaltet wird.
						</template>
					</openwb-base-range-input>
					<!-- <openwb-base-button-group-input
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/standby'
							] != 0
						"
						title="Automatisch einschalten"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/on_if_plugged_in'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/on_if_plugged_in',
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
					>
						<template #help>
							Wird diese Funktion aktiviert, dann schaltet
							sich das Display automatisch ein, wenn ein
							Fahrzeug angesteckt wird.
						</template>
					</openwb-base-button-group-input> -->
				</div>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<!-- <hr />
					<openwb-base-select-input
						title="Art der Anzeige"
						:options="[
							{
								value: 'primary',
								text: 'Primary openWB',
							},
							{
								value: 'local',
								text: 'diese(r) Ladepunkt(e)',
							},
						]"
						:model-value="
							$store.state.mqtt[
								'openWB/general/extern_display_mode'
							]
						"
						@update:model-value="
							updateState(
								'openWB/general/extern_display_mode',
								$event
							)
						"
					>
						<template #help>
							Wird hier "Primary openWB" ausgewählt, dann ist die
							Darstellung identisch zum Display der regelnden
							openWB. Alle Anzeigen und Änderungen sind möglich.
							Je nach Einstellung in der primary openWB werden die
							angezeigten Ladepunkte auf den/die an dieser openWB
							vorhandenen Ladepunkte beschränkt.<br />
							Die Option "diese(r) Ladepunkt(e)" ermöglicht eine
							minimale Anzeige und Bedienung der an dieser openWB
							verfügbaren Ladepunkte.
						</template>
					</openwb-base-select-input> -->
					<hr />
					<openwb-base-alert subtype="info">
						Weitere Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<!-- <hr />
					<openwb-base-heading>PIN-Sperre</openwb-base-heading>
					<openwb-base-button-group-input
						title="Display mit PIN schützen"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/pin_active'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/pin_active',
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
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/pin_active'
							] == true
						"
					>
						<openwb-base-text-input
							title="PIN-Code"
							:model-value="
								$store.state.mqtt[
									'openWB/optional/int_display/pin_code'
								]
							"
							@update:model-value="
								updateState(
									'openWB/optional/int_display/pin_code',
									$event
								)
							"
							subtype="password"
							pattern="[0-9]{4}"
						>
							<template #help>
								Der PIN-Code muss vierstellig sein und darf nur
								Zahlen enthalten.
							</template>
						</openwb-base-text-input>
					</div> -->
					<hr />
					<openwb-base-button-group-input
						title="Ladepunkte auf externen openWB"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/only_local_charge_points'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/only_local_charge_points',
								$event
							)
						"
						:buttons="[
							{
								buttonValue: false,
								text: 'Alle',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'Nur Lokale',
								class: 'btn-outline-success',
							},
						]"
					>
						<template #help>
							Hiermit kann festgelegt werden, ob an angebundenen
							externen openWB alle oder nur die jeweils lokalen
							Ladepunkte angezeigt werden sollen.
						</template>
					</openwb-base-button-group-input>
					<hr />
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/theme'
							] !== undefined
						"
					>
						<openwb-base-select-input
							class="mb-2"
							title="Theme des Displays"
							:groups="displayThemeGroupList"
							:model-value="
								$store.state.mqtt[
									'openWB/optional/int_display/theme'
								].type
							"
							@update:model-value="
								updateSelectedDisplayTheme($event)
							"
						>
							<template #help>
								Hier können unterschiedliche Display-Anzeigen,
								s.g. Themes, ausgewählt werden. Die Anzahl der
								Themes wird sich mit zukünftigen Releases
								erhöhen.
							</template>
						</openwb-base-select-input>
						<openwb-display-theme-proxy
							v-if="
								$store.state.mqtt[
									'openWB/optional/int_display/theme'
								].type
							"
							:displayTheme="
								$store.state.mqtt[
									'openWB/optional/int_display/theme'
								]
							"
							@update:configuration="
								updateConfiguration(
									'openWB/optional/int_display/theme',
									$event
								)
							"
						/>
					</div>
				</div>
			</openwb-base-card>
			<!-- <openwb-base-card title="Variable Stromtarife">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<openwb-base-alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Steuerungsmodus "secondary" befindet.
					</openwb-base-alert>
				</div>
				<div v-else>
					<openwb-base-button-group-input
						title="Stromtarife aktivieren"
						:model-value="
							$store.state.mqtt['openWB/optional/et/active']
						"
						@update:model-value="
							updateState('openWB/optional/et/active', $event)
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
					<div
						v-if="
							$store.state.mqtt['openWB/optional/et/active'] ==
							true
						"
					>
						<openwb-base-text-input
							title="Anbieter"
							subtype="json"
							disabled="disabled"
							:model-value="
								$store.state.mqtt[
									'openWB/optional/et/config/provider'
								]
							"
							@update:model-value="
								updateState(
									'openWB/optional/et/config/provider',
									$event
								)
							"
						>
							<template #help>Nur zur Info.</template>
						</openwb-base-text-input>
						<openwb-base-range-input
							title="Maximaler Strompreis"
							:min="-30"
							:max="30"
							:step="0.1"
							:model-value="
								$store.state.mqtt[
									'openWB/optional/et/config/max_price'
								]
							"
							@update:model-value="
								updateState(
									'openWB/optional/et/config/max_price',
									$event
								)
							"
							unit="ct"
						/>
					</div>
				</div>
			</openwb-base-card> -->
			<openwb-base-submit-buttons
				formName="optionalComponentsForm"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbDisplayThemeProxy from "../components/display_themes/OpenwbDisplayThemeProxy.vue";

export default {
	name: "OpenwbOptionalComponents",
	mixins: [ComponentState],
	components: { OpenwbDisplayThemeProxy },
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				// "openWB/general/extern_display_mode",
				"openWB/optional/rfid/active",
				"openWB/optional/led/active",
				"ToDo/optional/led/instant_blocked",
				"ToDo/optional/led/pv_blocked",
				"ToDo/optional/led/scheduled_blocked",
				"ToDo/optional/led/standby_blocked",
				"ToDo/optional/led/stop_blocked",
				"ToDo/optional/led/instant",
				"ToDo/optional/led/pv",
				"ToDo/optional/led/scheduled",
				"ToDo/optional/led/standby",
				"ToDo/optional/led/stop",
				"openWB/optional/int_display/active",
				"openWB/optional/int_display/standby",
				"openWB/optional/int_display/rotation",
				"openWB/optional/int_display/on_if_plugged_in",
				"openWB/optional/int_display/pin_active",
				"openWB/optional/int_display/pin_code",
				"openWB/optional/int_display/theme",
				"openWB/optional/int_display/only_local_charge_points",
				"openWB/system/configurable/display_themes",
				"openWB/optional/et/active",
				"openWB/optional/et/config/provider",
				"openWB/optional/et/config/max_price",
			],
		};
	},
	computed: {
		displayThemeList: {
			get() {
				return this.$store.state.mqtt[
					"openWB/system/configurable/display_themes"
				];
			},
		},
		displayThemeGroupList: {
			get() {
				let groups = [
					{ label: "openWB", options: [] },
					{ label: "Community", options: [] },
				];
				this.displayThemeList.forEach((theme) => {
					if (theme.official === true) {
						groups[0].options.push(theme);
					} else {
						groups[1].options.push(theme);
					}
				});
				return groups;
			},
		},
	},
	methods: {
		getDisplayThemeDefaults(displayThemeType) {
			const displayThemeDefaults = this.displayThemeList.find(
				(element) => element.value == displayThemeType
			);
			if (
				Object.prototype.hasOwnProperty.call(
					displayThemeDefaults,
					"defaults"
				)
			) {
				return {
					...JSON.parse(
						JSON.stringify(displayThemeDefaults.defaults)
					),
				};
			}
			console.warn(
				"no default configuration found for display theme type!",
				displayThemeType
			);
			return {};
		},
		updateSelectedDisplayTheme($event) {
			this.updateState(
				"openWB/optional/int_display/theme",
				this.getDisplayThemeDefaults($event)
			);
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", key, event);
			this.updateState(key, event.value, event.object);
		},
	},
};
</script>
