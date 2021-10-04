<template>
	<div class="optionalComponents">
		<form id="myForm">
			<card title="RFID">
				<button-group-input
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
							icon: 'fas fa-times',
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
						$store.state.mqtt['openWB/optional/rfid/active'] ===
						true
					"
				>
					<alert subtype="info">
						ToDo: Hilfetext und Konfiguration
					</alert>
				</div>
			</card>
			<card title="LED-Ausgänge">
				<button-group-input
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
							icon: 'fas fa-times',
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
					<alert subtype="info">
						ToDo: Informationen zu den verwendeten GPOIs ergänzen!
					</alert>
					<hr />
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === true
						"
					>
						<alert subtype="info">
							Diese Einstellungen sind nicht verfügbar, solange
							sich diese openWB im Modus "Nur Ladepunkt"
							befindet.<br />
							Das Verhalten der LEDs wird durch die übergeordnete
							openWB festgelegt.
						</alert>
					</div>
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
					>
						<heading>Ladung nicht freigegeben</heading>
						<select-input
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
						<select-input
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
						<select-input
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
						<select-input
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
						<select-input
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
						<heading>Ladung freigegeben</heading>
						<select-input
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
						<select-input
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
						<select-input
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
						<select-input
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
						<select-input
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
			</card>
			<card title="Display (intern oder extern)">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<button-group-input
						title="Integriertes Display"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/active'
							]
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
					/>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/active'
							] == true
						"
					>
						<hr />
						<heading>Display Standby</heading>
						<range-input
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
						/>
						<button-group-input
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
						</button-group-input>
					</div>
					<hr />
					<heading>PIN-Sperre</heading>
					<button-group-input
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
						<text-input
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
						</text-input>
					</div>
					<hr />
					<select-input
						title="Theme des Displays"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/int_display/theme'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/int_display/theme',
								$event
							)
						"
						:options="[
							{
								value: 'cards',
								text: 'Cards',
							},
							{
								value: 'gauges',
								text: 'Gauges',
							},
							{
								value: 'slave',
								text: 'Nur Ladeleistung (keine Bedienung möglich)',
							},
						]"
					/>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/theme'
							] == 'cards'
						"
					>
						<alert subtype="info">
							ToDo: Optionen für das Cards-Theme...
						</alert>
					</div>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/theme'
							] == 'gauges'
						"
					>
						<alert subtype="info">
							ToDo: Optionen für das Gauges-Theme...
						</alert>
					</div>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/int_display/theme'
							] == 'slave'
						"
					>
						<alert subtype="info">
							Das Theme "Nur Ladeleistung" bietet keine Optionen.
						</alert>
					</div>
				</div>
			</card>
			<card title="Loadsharing">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<button-group-input
						title="Loadsharing aktivieren"
						:model-value="
							$store.state.mqtt[
								'openWB/optional/load_sharing/active'
							]
						"
						@update:model-value="
							updateState(
								'openWB/optional/load_sharing/active',
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
							Wenn Ladepunkt 1 und 2 sich eine Zuleitung teilen,
							diese Option aktivieren. Sie stellt in jedem
							Lademodus sicher, dass nicht mehr als die
							eingestellte Stromstärke je Phase in der Summe von
							Ladepunkt 1 und 2 genutzt werden.<br />
							<span class="text-danger">
								Bei der OpenWB Duo muss diese Option aktiviert
								werden!
							</span>
						</template>
					</button-group-input>
					<div
						v-if="
							$store.state.mqtt[
								'openWB/optional/load_sharing/active'
							] == true
						"
					>
						<range-input
							title="Maximaler Strom"
							:min="16"
							:max="32"
							:step="1"
							:model-value="
								$store.state.mqtt[
									'openWB/optional/load_sharing/max_current'
								]
							"
							@update:model-value="
								updateState(
									'openWB/optional/load_sharing/max_current',
									$event
								)
							"
							unit="A"
						>
							<template #help>
								<p class="text-danger">
									Der richtige Anschluss ist zu gewährleisten!
								</p>
								<div class="row">
									<div class="col-md-4">Ladepunkt 1:</div>
									<div class="col">
										<ul>
											<li>Zuleitung Phase 1 = Phase 1</li>
											<li>Zuleitung Phase 2 = Phase 2</li>
											<li>Zuleitung Phase 3 = Phase 3</li>
										</ul>
									</div>
								</div>
								<div class="row">
									<div class="col-md-4">Ladepunkt 2:</div>
									<div class="col">
										<ul>
											<li>
												Zuleitung Phase 1 =
												<span class="text-danger">
													Phase 2
												</span>
											</li>
											<li>
												Zuleitung Phase 2 =
												<span class="text-danger">
													Phase 3
												</span>
											</li>
											<li>
												Zuleitung Phase 3 =
												<span class="text-danger">
													Phase 1
												</span>
											</li>
										</ul>
									</div>
								</div>
								<p>
									Durch das Drehen der Phasen ist
									sichergestellt, dass 2 einphasige Autos mit
									voller Geschwindigkeit laden können.
								</p>
							</template>
						</range-input>
					</div>
				</div>
			</card>
			<card title="Variable Stromtarife">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<button-group-input
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
						<text-input
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
						</text-input>
						<range-input
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
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "OptionalComponents",
	mixins: [ComponentStateMixin],
	components: {
		Card,
		Alert,
		Heading,
		TextInput,
		// NumberInput,
		// TextareaInput,
		RangeInput,
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
				"openWB/optional/int_display/on_if_plugged_in",
				"openWB/optional/int_display/pin_active",
				"openWB/optional/int_display/pin_code",
				"openWB/optional/int_display/theme",
				"openWB/optional/load_sharing/active",
				"openWB/optional/load_sharing/max_current",
				"openWB/optional/et/active",
				"openWB/optional/et/config/provider",
				"openWB/optional/et/config/max_price",
			],
		};
	},
};
</script>
