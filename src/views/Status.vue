<template>
	<div class="status">
		<!-- all charge points -->
		<openwb-base-card
			v-if="
				numChargePointsInstalled > 1 &&
				$store.state.mqtt['openWB/general/extern'] === false
			"
			subtype="primary"
			:collapsible="true"
			:collapsed="true"
		>
			<template #header>
				<font-awesome-icon
					fixed-width
					:icon="['fas', 'charging-station']"
				/>
				Alle Ladepunkte
			</template>
			<openwb-base-text-input
				title="Leistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/get/power',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Zählerstand laden"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/get/imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Zählerstand entladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/get/exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-heading>Historie</openwb-base-heading>
			<openwb-base-text-input
				title="Heute geladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/get/daily_imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Heute entladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/get/daily_exported',
						3,
						3,
						0.001
					)
				"
			/>
		</openwb-base-card>
		<!-- individual charge points -->
		<openwb-base-card
			v-for="(
				installedChargePoint, installedChargePointKey
			) in installedChargePoints"
			:key="installedChargePointKey"
			:collapsible="true"
			:collapsed="true"
			subtype="primary"
		>
			<template #header>
				<font-awesome-icon
					fixed-width
					:icon="['fas', 'charging-station']"
				/>
				{{ installedChargePoint.name }} (ID:
				{{ getChargePointIndex(installedChargePointKey) }})
			</template>
			<openwb-base-alert
				:subtype="
					statusLevel[
						$store.state.mqtt[
							'openWB/chargepoint/' +
								getChargePointIndex(installedChargePointKey) +
								'/get/fault_state'
						]
					]
				"
			>
				<font-awesome-icon
					v-if="
						$store.state.mqtt[
							'openWB/chargepoint/' +
								getChargePointIndex(installedChargePointKey) +
								'/get/fault_state'
						] == 1
					"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt[
							'openWB/chargepoint/' +
								getChargePointIndex(installedChargePointKey) +
								'/get/fault_state'
						] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/chargepoint/" +
							getChargePointIndex(installedChargePointKey) +
							"/get/fault_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-alert subtype="info">
				Statusmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/chargepoint/" +
							getChargePointIndex(installedChargePointKey) +
							"/get/state_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-checkbox-input
				title="Fahrzeug angesteckt"
				disabled
				:model-value="
					$store.state.mqtt[
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/plug_state'
					] == 1
				"
			/>
			<openwb-base-checkbox-input
				title="Ladevorgang aktiv"
				disabled
				:model-value="
					$store.state.mqtt[
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/charge_state'
					] == 1
				"
			/>
			<openwb-base-text-input
				title="Zählerstand laden"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Zählerstand entladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Heute geladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/daily_imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Heute entladen"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/daily_exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Wirkleistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/power',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Ladestromvorgabe"
				readonly
				class="text-right text-monospace"
				step="0.01"
				unit="A"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/set/current',
						2
					)
				"
			/>
			<openwb-base-text-input
				title="Netzfrequenz"
				readonly
				class="text-right text-monospace"
				step="0.01"
				unit="Hz"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/frequency',
						2
					)
				"
			/>
			<openwb-base-heading>Werte pro Phase</openwb-base-heading>
			<openwb-base-text-input
				title="Spannung"
				readonly
				class="text-right text-monospace"
				unit="V"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/voltages',
						1
					)
				"
			/>
			<openwb-base-text-input
				title="Strom"
				readonly
				class="text-right text-monospace"
				unit="A"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/currents',
						2
					)
				"
			/>
			<openwb-base-text-input
				title="Wirkleistung"
				readonly
				class="text-right text-monospace"
				unit="kW"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/powers',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Leistungsfaktor"
				readonly
				class="text-right text-monospace"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/power_factors',
						2
					)
				"
			/>
			<openwb-base-heading>Phasen</openwb-base-heading>
			<openwb-base-text-input
				title="Vorgabe"
				readonly
				class="text-right text-monospace"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/set/phases_to_use'
					)
				"
			/>
			<openwb-base-text-input
				title="Aktuell"
				readonly
				class="text-right text-monospace"
				:model-value="
					formatNumberTopic(
						'openWB/chargepoint/' +
							getChargePointIndex(installedChargePointKey) +
							'/get/phases_in_use'
					)
				"
			/>
		</openwb-base-card>
		<!-- counters -->
		<openwb-base-card
			v-for="counter in counterConfigs"
			:key="counter.id"
			:title="counter.name + ' (ID: ' + counter.id + ')'"
			:collapsible="true"
			:collapsed="true"
			subtype="danger"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'gauge-high']" />
				{{ counter.name }} (ID: {{ counter.id }})
			</template>
			<openwb-base-alert
				:subtype="
					statusLevel[
						$store.state.mqtt[
							'openWB/counter/' + counter.id + '/get/fault_state'
						]
					]
				"
			>
				<font-awesome-icon
					v-if="
						$store.state.mqtt[
							'openWB/counter/' + counter.id + '/get/fault_state'
						] == 1
					"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt[
							'openWB/counter/' + counter.id + '/get/fault_state'
						] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/counter/" + counter.id + "/get/fault_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-alert
				v-if="
					$store.state.mqtt[
						'openWB/counter/' + counter.id + '/get/state_str'
					] != undefined
				"
				subtype="info"
			>
				Statusmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/counter/" + counter.id + "/get/state_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-heading>Zählerstände</openwb-base-heading>
			<openwb-base-text-input
				title="Export"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/counter/' + counter.id + '/get/exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Import"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/counter/' + counter.id + '/get/imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-heading>Saldierte Werte</openwb-base-heading>
			<openwb-base-text-input
				title="Wirkleistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic(
						'openWB/counter/' + counter.id + '/get/power',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Netzfrequenz"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="Hz"
				:model-value="
					formatNumberTopic(
						'openWB/counter/' + counter.id + '/get/frequency',
						3
					)
				"
			/>
			<openwb-base-heading>Werte pro Phase</openwb-base-heading>
			<openwb-base-text-input
				title="Spannung"
				readonly
				class="text-right text-monospace"
				unit="V"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/counter/' + counter.id + '/get/voltages',
						1
					)
				"
			/>
			<openwb-base-text-input
				title="Strom"
				readonly
				class="text-right text-monospace"
				unit="A"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/counter/' + counter.id + '/get/currents',
						2
					)
				"
			/>
			<openwb-base-text-input
				title="Wirkleistung"
				readonly
				class="text-right text-monospace"
				unit="kW"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/counter/' + counter.id + '/get/powers',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Leistungsfaktor"
				readonly
				class="text-right text-monospace"
				:model-value="
					formatPhaseArrayNumberTopic(
						'openWB/counter/' + counter.id + '/get/power_factors',
						2
					)
				"
			/>
		</openwb-base-card>
		<!-- all inverters -->
		<openwb-base-card
			v-if="
				numInvertersInstalled > 1 &&
				$store.state.mqtt['openWB/general/extern'] === false
			"
			subtype="success"
			:collapsible="true"
			:collapsed="true"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'solar-panel']" />
				Alle Wechselrichter
			</template>
			<openwb-base-text-input
				title="Zählerstand"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic('openWB/pv/get/exported', 3, 3, 0.001)
				"
			/>
			<openwb-base-text-input
				title="Leistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic('openWB/pv/get/power', 3, 3, 0.001)
				"
			/>
			<openwb-base-heading>Erträge</openwb-base-heading>
			<openwb-base-text-input
				title="Heute"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/pv/get/daily_exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Dieser Monat"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/pv/get/monthly_exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Dieses Jahr"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/pv/get/yearly_exported',
						3,
						3,
						0.001
					)
				"
			/>
		</openwb-base-card>
		<!-- individual inverters -->
		<openwb-base-card
			v-for="inverter in inverterConfigs"
			:key="inverter.id"
			:collapsible="true"
			:collapsed="true"
			subtype="success"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'solar-panel']" />
				{{ inverter.name }} (ID: {{ inverter.id }})
			</template>
			<openwb-base-alert
				:subtype="
					statusLevel[
						$store.state.mqtt[
							'openWB/pv/' + inverter.id + '/get/fault_state'
						]
					]
				"
			>
				<font-awesome-icon
					v-if="
						$store.state.mqtt[
							'openWB/pv/' + inverter.id + '/get/fault_state'
						] == 1
					"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt[
							'openWB/pv/' + inverter.id + '/get/fault_state'
						] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/pv/" + inverter.id + "/get/fault_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-text-input
				title="Zählerstand"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/pv/' + inverter.id + '/get/exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Leistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic(
						'openWB/pv/' + inverter.id + '/get/power',
						3,
						3,
						0.001
					)
				"
			/>
		</openwb-base-card>
		<!-- all batteries -->
		<openwb-base-card
			v-if="
				numBatteriesInstalled > 1 &&
				$store.state.mqtt['openWB/general/extern'] === false
			"
			subtype="warning"
			:collapsible="true"
			:collapsed="true"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'car-battery']" />
				Alle Speicher
			</template>
			<openwb-base-alert
				:subtype="
					statusLevel[$store.state.mqtt['openWB/bat/get/fault_state']]
				"
			>
				<font-awesome-icon
					v-if="$store.state.mqtt['openWB/bat/get/fault_state'] == 1"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt['openWB/bat/get/fault_state'] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{ $store.state.mqtt["openWB/bat/get/fault_str"] }}
			</openwb-base-alert>
			<openwb-base-heading>Zählerstände</openwb-base-heading>
			<openwb-base-text-input
				title="Ladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic('openWB/bat/get/imported', 3, 3, 0.001)
				"
			/>
			<openwb-base-text-input
				title="Entladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic('openWB/bat/get/exported', 3, 3, 0.001)
				"
			/>
			<openwb-base-heading>Tageswerte</openwb-base-heading>
			<openwb-base-text-input
				title="Ladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/bat/get/daily_imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Entladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/bat/get/daily_exported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-heading>Saldierte Werte</openwb-base-heading>
			<openwb-base-text-input
				title="Leistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic('openWB/bat/get/power', 3, 3, 0.001)
				"
			/>
			<openwb-base-number-input
				title="Ladestand"
				readonly
				class="text-right text-monospace"
				unit="%"
				:model-value="$store.state.mqtt['openWB/bat/get/soc']"
			/>
		</openwb-base-card>
		<!-- individual batteries -->
		<openwb-base-card
			v-for="battery in batteryConfigs"
			:key="battery.id"
			:collapsible="true"
			:collapsed="true"
			subtype="warning"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'car-battery']" />
				{{ battery.name }} (ID: {{ battery.id }})
			</template>
			<openwb-base-alert
				:subtype="
					statusLevel[
						$store.state.mqtt[
							'openWB/bat/' + battery.id + '/get/fault_state'
						]
					]
				"
			>
				<font-awesome-icon
					v-if="
						$store.state.mqtt[
							'openWB/bat/' + battery.id + '/get/fault_state'
						] == 1
					"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt[
							'openWB/bat/' + battery.id + '/get/fault_state'
						] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/bat/" + battery.id + "/get/fault_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-heading>Aktuelle Werte</openwb-base-heading>
			<openwb-base-text-input
				title="Leistung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kW"
				:model-value="
					formatNumberTopic(
						'openWB/bat/' + battery.id + '/get/power',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-number-input
				title="Ladestand"
				readonly
				class="text-right text-monospace"
				unit="%"
				:model-value="
					$store.state.mqtt['openWB/bat/' + battery.id + '/get/soc']
				"
			/>
			<openwb-base-heading>Zählerstände</openwb-base-heading>
			<openwb-base-text-input
				title="Ladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/bat/' + battery.id + '/get/imported',
						3,
						3,
						0.001
					)
				"
			/>
			<openwb-base-text-input
				title="Entladung"
				readonly
				class="text-right text-monospace"
				step="0.001"
				unit="kWh"
				:model-value="
					formatNumberTopic(
						'openWB/bat/' + battery.id + '/get/exported',
						3,
						3,
						0.001
					)
				"
			/>
		</openwb-base-card>
		<!-- vehicles -->
		<openwb-base-card
			v-for="(vehicleName, vehicleKey) of vehicleNames"
			:key="vehicleKey"
			:collapsible="true"
			:collapsed="true"
			subtype="info"
		>
			<template #header>
				<font-awesome-icon fixed-width :icon="['fas', 'car']" />
				{{ vehicleName }} (ID: {{ getVehicleIndex(vehicleKey) }})
			</template>
			<openwb-base-alert
				v-if="
					$store.state.mqtt[
						'openWB/vehicle/' +
							getVehicleIndex(vehicleKey) +
							'/get/fault_state'
					] !== undefined
				"
				:subtype="
					statusLevel[
						$store.state.mqtt[
							'openWB/vehicle/' +
								getVehicleIndex(vehicleKey) +
								'/get/fault_state'
						]
					]
				"
			>
				<font-awesome-icon
					v-if="
						$store.state.mqtt[
							'openWB/vehicle/' +
								getVehicleIndex(vehicleKey) +
								'/get/fault_state'
						] == 1
					"
					fixed-width
					:icon="['fas', 'exclamation-triangle']"
				/>
				<font-awesome-icon
					v-else-if="
						$store.state.mqtt[
							'openWB/vehicle/' +
								getVehicleIndex(vehicleKey) +
								'/get/fault_state'
						] == 2
					"
					fixed-width
					:icon="['fas', 'times-circle']"
				/>
				<font-awesome-icon
					v-else
					fixed-width
					:icon="['fas', 'check-circle']"
				/>
				Modulmeldung:<br />
				{{
					$store.state.mqtt[
						"openWB/vehicle/" +
							getVehicleIndex(vehicleKey) +
							"/get/fault_str"
					]
				}}
			</openwb-base-alert>
			<openwb-base-heading>Fahrzeugdaten</openwb-base-heading>
			<openwb-base-number-input
				title="Ladestand"
				readonly
				class="text-right text-monospace"
				unit="%"
				:model-value="
					$store.state.mqtt[
						'openWB/vehicle/' +
							getVehicleIndex(vehicleKey) +
							'/get/soc'
					]
				"
			/>
			<openwb-base-number-input
				title="Reichweite"
				readonly
				class="text-right text-monospace"
				unit="km"
				:model-value="
					Math.round(
						$store.state.mqtt[
							'openWB/vehicle/' +
								getVehicleIndex(vehicleKey) +
								'/get/range'
						]
					)
				"
			/>
			<openwb-base-text-input
				title="Letzter Zeitstempel"
				readonly
				class="text-right text-monospace"
				:model-value="
					$store.state.mqtt[
						'openWB/vehicle/' +
							getVehicleIndex(vehicleKey) +
							'/get/soc_timestamp'
					]
				"
			/>
		</openwb-base-card>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCheckCircle as fasCheckCircle,
	faExclamationTriangle as fasExclamationTriangle,
	faTimesCircle as fasTimesCircle,
	faCar as fasCar,
	faChargingStation as fasChargingStation,
	faCarBattery as fasCarBattery,
	faSolarPanel as fasSolarPanel,
	faGaugeHigh as fasGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasCheckCircle,
	fasExclamationTriangle,
	fasTimesCircle,
	fasCar,
	fasChargingStation,
	fasCarBattery,
	fasSolarPanel,
	fasGaugeHigh
);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbStatus",
	mixins: [ComponentState],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				// charge points total
				"openWB/chargepoint/get/power",
				"openWB/chargepoint/get/imported",
				"openWB/chargepoint/get/exported",
				"openWB/chargepoint/get/daily_imported",
				"openWB/chargepoint/get/daily_exported",
				// individual charge points
				"openWB/chargepoint/+/config",
				"openWB/chargepoint/+/get/+",
				"openWB/chargepoint/+/get/connected_vehicle/info",
				"openWB/chargepoint/+/set/+",
				// components
				"openWB/system/device/+/component/+/config",
				// counter
				"openWB/counter/+/get/+",
				// pv
				"openWB/pv/get/+",
				"openWB/pv/+/get/+",
				// batteries
				"openWB/bat/get/+",
				"openWB/bat/+/get/+",
				// vehicles
				"openWB/vehicle/+/name",
				"openWB/vehicle/+/get/+",
			],
			statusLevel: ["success", "warning", "danger"],
		};
	},
	computed: {
		installedChargePoints: {
			get() {
				let chargePoints = this.getWildcardTopics(
					"openWB/chargepoint/+/config"
				);
				let myObj = {};
				for (const [key, element] of Object.entries(chargePoints)) {
					if (
						element.type === "internal_openwb" ||
						this.$store.state.mqtt["openWB/general/extern"] ===
							false
					) {
						myObj[key] = element;
					}
				}
				return myObj;
			},
		},
		numChargePointsInstalled: {
			get() {
				return Object.keys(this.installedChargePoints).length;
			},
		},
		counterConfigs: {
			get() {
				if (this.$store.state.mqtt["openWB/general/extern"] === true) {
					return {};
				}
				return this.filterComponentsByType(
					this.getWildcardTopics(
						"openWB/system/device/+/component/+/config"
					),
					"counter"
				);
			},
		},
		numInvertersInstalled: {
			get() {
				return Object.keys(this.inverterConfigs).length;
			},
		},
		inverterConfigs: {
			get() {
				if (this.$store.state.mqtt["openWB/general/extern"] === true) {
					return {};
				}
				return this.filterComponentsByType(
					this.getWildcardTopics(
						"openWB/system/device/+/component/+/config"
					),
					"inverter"
				);
			},
		},
		numBatteriesInstalled: {
			get() {
				return Object.keys(this.batteryConfigs).length;
			},
		},
		batteryConfigs: {
			get() {
				if (this.$store.state.mqtt["openWB/general/extern"] === true) {
					return {};
				}
				return this.filterComponentsByType(
					this.getWildcardTopics(
						"openWB/system/device/+/component/+/config"
					),
					"bat"
				);
			},
		},
		vehicleNames: {
			get() {
				if (this.$store.state.mqtt["openWB/general/extern"] === true) {
					return {};
				}
				return this.getWildcardTopics("openWB/vehicle/+/name");
			},
		},
	},
	methods: {
		filterComponentsByType(components, type) {
			return Object.keys(components)
				.filter((key) => {
					return components[key].type.includes(type);
				})
				.reduce((obj, key) => {
					return {
						...obj,
						[key]: components[key],
					};
				}, {});
		},
		getChargePointIndex(key) {
			return parseInt(key.match(/(?:\/)(\d+)(?=\/)/)[1]);
		},
		getComponentIndex(key) {
			return parseInt(key.match(/(?:\/)(\d+)(?=\/)/)[1]);
		},
		getVehicleIndex(key) {
			return parseInt(key.match(/(?:\/)(\d+)(?=\/)/)[1]);
		},
	},
};
</script>

<style scoped>
.status {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.status .card {
	align-self: start;
}

@media (max-width: 768px) {
	.status {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 10px;
	}
}
</style>
