<template>
	<div class="vehicleConfig">
		<form id="myForm">
			<card title="Fahrzeuge" :collapsible="true" :collapsed="true">
				<template #actions>
					<avatar
						class="bg-success"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addVehicle"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<card
						v-for="id in vehicleIndexes"
						:key="id"
						:title="getVehicleName(id)"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="id !== 0">
							<avatar
								class="bg-danger"
								v-if="
									$store.state.mqtt[
										'openWB/general/extern'
									] === false
								"
								@click="deleteVehicle(id, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</avatar>
						</template>
						<text-input
							title="Bezeichnung"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' + id + '/name'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' + id + '/name',
									$event
								)
							"
							:disabled="id === 0"
						>
							<template #help v-if="id === 0">
								Das Standard-Fahrzeug kann nicht umbenannt
								werden.
							</template>
						</text-input>
						<select-input
							title="Fahrzeug-Vorlage"
							:options="evTemplateList"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' + id + '/ev_template'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' + id + '/ev_template',
									$event
								)
							"
						/>
						<select-input
							title="Ladeprofil-Vorlage"
							:options="chargeTemplateList"
							:model-value="
								$store.state.mqtt[
									'openWB/vehicle/' + id + '/charge_template'
								]
							"
							@update:model-value="
								updateState(
									'openWB/vehicle/' + id + '/charge_template',
									$event
								)
							"
						/>
					</card>
				</div>
			</card>
			<card
				title="Fahrzeug-Vorlagen"
				:collapsible="true"
				:collapsed="true"
			>
				<template #actions>
					<avatar
						class="bg-success"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addEvTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<card
						v-for="(template, key) in evTemplates"
						:key="key"
						:title="template.name ? template.name : key"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="!key.endsWith('/0')">
							<avatar
								class="bg-danger"
								v-if="
									$store.state.mqtt[
										'openWB/general/extern'
									] === false
								"
								@click="deleteEvTemplate(key, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</avatar>
						</template>
						<text-input
							title="Bezeichnung"
							:model-value="template.name"
							@update:model-value="
								updateState(key, $event, 'name')
							"
							:disabled="key.endsWith('/0')"
						>
							<template #help v-if="key.endsWith('/0')">
								Die Standard-Vorlage kann nicht umbenannt
								werden.
							</template>
						</text-input>
						<heading>Angaben zum Ladestrom</heading>
						<range-input
							title="Mindeststrom"
							:min="6"
							:max="16"
							:step="1"
							unit="A"
							:model-value="template.min_current"
							@update:model-value="
								updateState(key, $event, 'min_current')
							"
						>
						</range-input>
						<range-input
							title="Maximalstrom 1-phasig"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_one_phase"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_one_phase'
								)
							"
						>
						</range-input>
						<range-input
							title="Maximalstrom mehr-phasig"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="template.max_current_multi_phases"
							@update:model-value="
								updateState(
									key,
									$event,
									'max_current_multi_phases'
								)
							"
						>
						</range-input>
						<number-input
							title="Erlaubte Stromabweichung"
							:model-value="template.nominal_difference"
							@update:model-value="
								updateState(key, $event, 'nominal_difference')
							"
						>
						</number-input>
						<heading>Angaben zur Batterie</heading>
						<number-input
							title="Kapazität der Batterie"
							unit="kWh"
							:min="10"
							:step="1"
							:model-value="template.battery_capacity"
							@update:model-value="
								updateState(key, $event, 'battery_capacity')
							"
						>
						</number-input>
						<number-input
							title="Durchschnittsverbrauch"
							unit="kWh&nbsp;/&nbsp;100km"
							:min="0"
							:step="0.1"
							:model-value="template.average_consump"
							@update:model-value="
								updateState(key, $event, 'average_consump')
							"
						>
						</number-input>
						<heading>Angaben zur Handhabung von Phasen</heading>
						<button-group-input
							title="Unterstützte Phasen"
							:buttons="[
								{ buttonValue: 1, text: '1' },
								{ buttonValue: 2, text: '2' },
								{ buttonValue: 3, text: '3' },
							]"
							:model-value="template.max_phases"
							@update:model-value="
								updateState(key, $event, 'max_phases')
							"
						>
						</button-group-input>
						<button-group-input
							title="CP-Unterbrechung"
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
							:model-value="template.control_pilot_interruption"
							@update:model-value="
								updateState(
									key,
									$event,
									'control_pilot_interruption'
								)
							"
						>
						</button-group-input>
						<button-group-input
							title="Phasenumschaltung blockieren"
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
							:model-value="template.prevent_switch_stop"
							@update:model-value="
								updateState(key, $event, 'prevent_switch_stop')
							"
						>
						</button-group-input>
						<number-input
							title="Pause bei Phasenumschaltung"
							unit="s"
							:min="2"
							:step="1"
							:model-value="template.phase_switch_pause"
							@update:model-value="
								updateState(key, $event, 'phase_switch_pause')
							"
						>
						</number-input>
					</card>
				</div>
			</card>
			<card
				title="Ladeprofil-Vorlagen"
				:collapsible="true"
				:collapsed="true"
			>
				<template #actions>
					<avatar
						class="bg-success"
						v-if="
							$store.state.mqtt['openWB/general/extern'] === false
						"
						@click="addChargeTemplate"
					>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'plus']"
						/>
					</avatar>
				</template>
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
					<alert subtype="info">
						Diese Einstellungen sind nicht verfügbar, solange sich
						diese openWB im Modus "Nur Ladepunkt" befindet.
					</alert>
				</div>
				<div v-else>
					<card
						v-for="(template, key) in chargeTemplates"
						:key="key"
						:title="template.name ? template.name : key"
						:collapsible="true"
						:collapsed="true"
						subtype="primary"
					>
						<template #actions v-if="!key.endsWith('/0')">
							<avatar
								class="bg-danger"
								v-if="
									$store.state.mqtt[
										'openWB/general/extern'
									] === false
								"
								@click="deleteChargeTemplate(key, $event)"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</avatar>
						</template>
						<text-input
							title="Bezeichnung"
							:model-value="template.name"
							@update:model-value="
								updateState(key, $event, 'name')
							"
							:disabled="key.endsWith('/0')"
						>
							<template #help v-if="key.endsWith('/0')">
								Die Standard-Vorlage kann nicht umbenannt
								werden.
							</template>
						</text-input>
						<heading>Allgemeine Optionen</heading>
						<button-group-input
							title="Priorität"
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
							:model-value="template.prio"
							@update:model-value="
								updateState(key, $event, 'prio')
							"
						>
							<template #help>
								Fahrzeuge mit Priorität werden bevorzugt
								geladen. Erst wenn alle priorisierten Fahrzeuge
								die maximale Ladeleistung bekommen und noch
								zusätzlicher Überschuss vorhanden ist, werden
								auch Fahrzeuge ohne Priorität geladen.
							</template>
						</button-group-input>
						<button-group-input
							title="Automatische Sperre"
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
							:model-value="template.disable_after_unplug"
							@update:model-value="
								updateState(key, $event, 'disable_after_unplug')
							"
						>
							<template #help>
								Wird ein Fahrzeug mit diesem Profil abgesteckt,
								dann wird der betroffene Ladepunkt automatisch
								deaktiviert.
							</template>
						</button-group-input>
						<button-group-input
							title="Standard nach Abstecken"
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
							:model-value="template.load_default"
							@update:model-value="
								updateState(key, $event, 'load_default')
							"
						>
							<template #help>
								Falls diese Option aktiviert ist, wird der
								betroffene Ladepunkt nach dem Abstecken auf das
								Standard Ladeprofil zurückgesetzt.
							</template>
						</button-group-input>
						<hr />
						<heading>Sofortladen</heading>
						<range-input
							title="Ladestrom"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="
								template.chargemode.instant_charging.current
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.instant_charging.current'
								)
							"
						>
						</range-input>
						<button-group-input
							title="Begrenzung"
							:buttons="[
								{
									buttonValue: 'none',
									text: 'Aus',
								},
								{
									buttonValue: 'soc',
									text: 'SoC',
								},
								{
									buttonValue: 'amount',
									text: 'Energie',
								},
							]"
							:model-value="
								template.chargemode.instant_charging.limit
									.selected
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.instant_charging.limit.selected'
								)
							"
						>
							<template #help>
								Sofortladen kann entweder durch den Ladestand
								der Fahrzeugbatterie (SoC) oder eine
								Energiemenge in kWh begrenzt werden.
							</template>
						</button-group-input>
						<range-input
							title="SoC-Limit"
							:min="5"
							:max="100"
							:step="5"
							unit="%"
							:model-value="
								template.chargemode.instant_charging.limit.soc
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.instant_charging.limit.soc'
								)
							"
						>
							<template #help>
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</range-input>
						<number-input
							title="Energie-Limit"
							unit="kWh"
							:min="5"
							:step="5"
							:model-value="
								template.chargemode.instant_charging.limit
									.amount
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.instant_charging.limit.amount'
								)
							"
						>
						</number-input>
						<hr />
						<heading>PV-laden</heading>
						<range-input
							title="Mindeststrom"
							:min="0"
							:max="11"
							:step="1"
							unit="A"
							:labels="[
								{ label: 'Aus', value: 0 },
								{ label: 6, value: 6 },
								{ label: 7, value: 7 },
								{ label: 8, value: 8 },
								{ label: 9, value: 9 },
								{ label: 10, value: 10 },
								{ label: 11, value: 11 },
								{ label: 12, value: 12 },
								{ label: 13, value: 13 },
								{ label: 14, value: 14 },
								{ label: 15, value: 15 },
								{ label: 16, value: 16 },
							]"
							:model-value="
								template.chargemode.pv_charging.min_current
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.pv_charging.min_current'
								)
							"
						>
							<template #help>
								ToDo: Beschreibung ergänzen!
							</template>
						</range-input>
						<range-input
							title="SoC-Limit"
							:min="0"
							:max="20"
							:step="1"
							unit="%"
							:labels="[
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
								{ label: 100, value: 100 },
								{ label: 'Aus', value: 101 },
							]"
							:model-value="
								template.chargemode.pv_charging.max_soc
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.pv_charging.max_soc'
								)
							"
						>
							<template #help>
								Bei der Einstellung "100%" wird die Ladung mit
								Erreichen der 100% ebenfalls beendet. Dadurch
								erfolgt kein Balancing der Batteriezellen. Ist
								dies gewünscht, muss hier "Aus" gewählt werden,
								um die Ladung nicht zu beenden.<br />
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</range-input>
						<range-input
							title="Mindest-SoC"
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
								template.chargemode.pv_charging.min_soc
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.pv_charging.min_soc'
								)
							"
						>
							<template #help>
								Liegt der Ladestand (SoC) der Fahrzeugbatterie
								unter dem hier eingestellten Wert, dann wird bis
								zum Erreichen dieses Wertes mit dem
								eingestellten "Mindest-SoC-Strom" geladen.<br />
								Um diese Begrenzung nutzen zu können, muss ein
								SoC-Modul für das jeweilige Fahrzeug
								eingerichtet werden!
							</template>
						</range-input>
						<range-input
							title="Mindest-SoC-Strom"
							:min="6"
							:max="32"
							:step="1"
							unit="A"
							:model-value="
								template.chargemode.pv_charging.min_soc_current
							"
							@update:model-value="
								updateState(
									key,
									$event,
									'chargemode.pv_charging.min_soc_current'
								)
							"
						>
						</range-input>
						<hr />
						<heading>Zielladen</heading>
						<card
							v-for="(plan, planIndex) in template.chargemode
								.scheduled_charging"
							:key="planIndex"
							:title="plan.name"
							:collapsible="true"
							:collapsed="true"
						>
							<template #header v-if="plan.active == true">
								{{ plan.name }}
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'car-battery']"
								/>
								{{ plan.soc }}%
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'clock']"
								/>
								{{ plan.time }}
								<span v-if="plan.frequency.selected == 'once'">
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'calendar-day']"
									/>
									{{ formatDate(plan.frequency.once) }}
								</span>
								<span v-if="plan.frequency.selected == 'daily'">
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'calendar-alt']"
									/>
								</span>
								<span
									v-if="plan.frequency.selected == 'weekly'"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'calendar-week']"
									/>
								</span>
							</template>
							<text-input
								title="Bezeichnung"
								:model-value="
									template.chargemode.scheduled_charging[
										planIndex
									].name
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.name'
									)
								"
							>
							</text-input>
							<button-group-input
								title="Zeitpunkt aktiv"
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
									template.chargemode.scheduled_charging[
										planIndex
									].active
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.active'
									)
								"
							>
							</button-group-input>
							<text-input
								title="Uhrzeit"
								subtype="time"
								:model-value="
									template.chargemode.scheduled_charging[
										planIndex
									].time
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.time'
									)
								"
							>
							</text-input>
							<range-input
								title="Ziel-SoC"
								:min="5"
								:max="100"
								:step="5"
								unit="%"
								:model-value="
									template.chargemode.scheduled_charging[
										planIndex
									].soc
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.soc'
									)
								"
							>
							</range-input>
							<button-group-input
								title="Wiederholungen"
								:buttons="[
									{
										buttonValue: 'once',
										text: 'Einmalig',
										class: 'btn-outline-info',
									},
									{
										buttonValue: 'daily',
										text: 'Täglich',
										class: 'btn-outline-info',
									},
									{
										buttonValue: 'weekly',
										text: 'Wöchentlich',
										class: 'btn-outline-info',
									},
								]"
								:model-value="
									template.chargemode.scheduled_charging[
										planIndex
									].frequency.selected
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.frequency.selected'
									)
								"
							>
							</button-group-input>
							<text-input
								v-if="plan.frequency.selected == 'once'"
								title="Datum"
								subtype="date"
								:model-value="
									template.chargemode.scheduled_charging[
										planIndex
									].frequency.once
								"
								@update:model-value="
									updateState(
										key,
										$event,
										'chargemode.scheduled_charging.' +
											planIndex +
											'.frequency.once'
									)
								"
							>
							</text-input>
							<div v-if="plan.frequency.selected == 'weekly'">
								<button-group-input
									title="Montag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[0]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[0]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Dienstag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[1]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[1]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Mittwoch"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[2]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[2]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Donnerstag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[3]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[3]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Freitag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[4]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[4]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Samstag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[5]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[5]'
										)
									"
								>
								</button-group-input>
								<button-group-input
									title="Sonntag"
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
										template.chargemode.scheduled_charging[
											planIndex
										].frequency.weekly[6]
									"
									@update:model-value="
										updateState(
											key,
											$event,
											'chargemode.scheduled_charging.' +
												planIndex +
												'.frequency.weekly[6]'
										)
									"
								>
								</button-group-input>
							</div>
						</card>
						<hr />
						<heading>Laden nach Zeitplan</heading>
					</card>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPlus as fasPlus,
	faTrash as fasTrash,
	faCalendarDay as fasCalendarDay,
	faCalendarAlt as fasCalendarAlt,
	faCalendarWeek as fasCalendarWeek,
	faClock as fasClock,
	faCarBattery as fasCarBattery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasPlus,
	fasTrash,
	fasCalendarDay,
	fasCalendarAlt,
	fasCalendarWeek,
	fasClock,
	fasCarBattery
);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import Card from "@/components/Card.vue";
import Alert from "@/components/Alert.vue";
import Heading from "@/components/Heading.vue";
import TextInput from "@/components/TextInput.vue";
import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
import RangeInput from "@/components/RangeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import ClickButton from "@/components/ClickButton.vue";
import Avatar from "@/components/Avatar.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "VehicleConfig",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		Card,
		Alert,
		Heading,
		TextInput,
		NumberInput,
		// TextareaInput,
		RangeInput,
		SelectInput,
		ButtonGroupInput,
		// ClickButton,
		Avatar,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/vehicle/template/ev_template/+",
				"openWB/vehicle/template/charge_template/+",
				"openWB/vehicle/+/name",
				"openWB/vehicle/+/charge_template",
				"openWB/vehicle/+/ev_template",
			],
		};
	},
	computed: {
		vehicleIndexes: {
			get() {
				return this.getWildcardIndexList("openWB/vehicle/+/name");
			},
		},
		evTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/vehicle/template/ev_template/+"
				);
			},
		},
		evTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.evTemplates).forEach((key) => {
					let index = parseInt(key.match(/([0-9]+)$/g)[0]);
					let name =
						this.$store.state.mqtt[
							"openWB/vehicle/template/ev_template/" + index
						].name;
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
		chargeTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/vehicle/template/charge_template/+"
				);
			},
		},
		chargeTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.chargeTemplates).forEach((key) => {
					let index = parseInt(key.match(/([0-9]+)$/g)[0]);
					let name =
						this.$store.state.mqtt[
							"openWB/vehicle/template/charge_template/" + index
						].name;
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
	},
	methods: {
		addChargeTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new charge template...");
			this.$emit("sendCommand", {
				command: "addChargeTemplate",
				data: {},
			});
		},
		deleteChargeTemplate(key, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("request removal of charge template '" + key + "'");
			// get trailing characters as index
			let index = key.match(/([^/]+)$/)[0];
			this.$emit("sendCommand", {
				command: "removeChargeTemplate",
				data: { id: index },
			});
		},
		addEvTemplate(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new ev template...");
			this.$emit("sendCommand", {
				command: "addEVTemplate",
				data: {},
			});
		},
		deleteEvTemplate(key, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("request removal of ev template '" + key + "'");
			// get trailing characters as index
			let index = key.match(/([^/]+)$/)[0];
			this.$emit("sendCommand", {
				command: "removeEVTemplate",
				data: { id: index },
			});
		},
		addVehicle(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("requesting new vehicle...");
			this.$emit("sendCommand", {
				command: "addVehicle",
				data: {},
			});
		},
		deleteVehicle(index, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("request removal of vehicle '" + index + "'");
			this.$emit("sendCommand", {
				command: "removeVehicle",
				data: { id: index },
			});
		},
		getVehicleName(id) {
			return this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
				? this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
				: "Fahrzeug " + id;
		},
		formatDate(dateString) {
			let d = new Date(dateString);
			return d.toLocaleDateString(undefined, {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});
		},
	},
};
</script>
