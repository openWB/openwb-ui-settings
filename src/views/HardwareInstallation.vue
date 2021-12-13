<template>
	<div class="hardwareInstallation">
		<form name="hardwareInstallationForm">
			<openwb-base-alert subtype="info">
				Wenn neue Komponenten - insbesondere Zähler - konfiguriert
				wurden, ist auch das
				<router-link to="/LoadManagementConfiguration">
					Lastmanagement
				</router-link>
				zu prüfen!
			</openwb-base-alert>
			<openwb-base-card title="Systeme und Komponenten">
				<openwb-base-select-input
					class="mb-2"
					title="Verfügbare Systeme"
					notSelected="Bitte auswählen"
					:options="getDeviceList()"
					:model-value="deviceToAdd"
					@update:model-value="deviceToAdd = $event"
				>
					<template #append>
						<span class="col-1">
							<openwb-base-click-button
								:class="
									deviceToAdd === undefined
										? 'btn-outline-success'
										: 'btn-success clickable'
								"
								:disabled="deviceToAdd === undefined"
								@click="addDevice"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'plus']"
								/>
							</openwb-base-click-button>
						</span>
					</template>
					<template #help>
						Bitte ein System auswählen, das hinzugefügt werden soll.
					</template>
				</openwb-base-select-input>
				<openwb-base-card
					v-for="(
						installedDevice, installedDeviceKey
					) in installedDevices"
					:key="installedDevice.id"
					:collapsible="true"
					:collapsed="true"
					subtype="primary"
				>
					<template #header>
						<openwb-base-avatar class="bg-success">
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'network-wired']"
							/>
						</openwb-base-avatar>
						{{ installedDevice.name }}
					</template>
					<template #actions>
						<openwb-base-avatar
							class="bg-danger clickable"
							@click="removeDevice(installedDevice.id, $event)"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'trash']"
							/>
						</openwb-base-avatar>
					</template>
					<openwb-base-text-input
						title="Bezeichnung"
						subtype="text"
						:model-value="installedDevice.name"
						@update:model-value="
							updateState(installedDeviceKey, $event, 'name')
						"
					/>
					<hr />
					<openwb-config-proxy
						:deviceId="installedDevice.id"
						:deviceType="installedDevice.type"
						:configuration="installedDevice.configuration"
						@update:configuration="
							updateConfiguration(installedDeviceKey, $event)
						"
					/>
					<hr />
					<openwb-base-select-input
						class="mb-2"
						v-if="getComponentList(installedDevice.type).length"
						title="Verfügbare Komponenten"
						notSelected="Bitte auswählen"
						:options="getComponentList(installedDevice.type)"
						:model-value="componentToAdd[installedDevice.id]"
						@update:model-value="
							componentToAdd[installedDevice.id] = $event
						"
					>
						<template #append>
							<span class="col-1">
								<openwb-base-click-button
									:class="
										componentToAdd[installedDevice.id] ===
										undefined
											? 'btn-outline-success'
											: 'btn-success clickable'
									"
									:disabled="
										componentToAdd[installedDevice.id] ===
										undefined
									"
									@click="
										addComponent(
											installedDevice.id,
											installedDevice.type,
											componentToAdd[installedDevice.id]
										)
									"
								>
									<font-awesome-icon
										fixed-width
										:icon="['fas', 'plus']"
									/>
								</openwb-base-click-button>
							</span>
						</template>
						<template #help>
							Bitte eine Komponente auswählen, die hinzugefügt
							werden soll.
						</template>
					</openwb-base-select-input>
					<openwb-base-alert v-else subtype="info">
						Dieses System bietet keine Komponenten zur Installation
						an.
					</openwb-base-alert>
					<openwb-base-card
						v-for="(
							installedComponent, installedComponentKey
						) in getMyInstalledComponents(installedDevice.id)"
						:key="installedComponent.id"
						:collapsible="true"
						:collapsed="true"
						subtype="dark"
					>
						<template #header>
							<openwb-base-avatar class="bg-success">
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'microchip']"
								/>
							</openwb-base-avatar>
							{{ installedComponent.name }}
						</template>
						<template #actions>
							<openwb-base-avatar
								class="bg-danger clickable"
								@click="
									removeComponent(
										installedDevice.id,
										installedComponent.id,
										installedComponent.type,
										$event
									)
								"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'trash']"
								/>
							</openwb-base-avatar>
						</template>
						<openwb-base-text-input
							title="Bezeichnung"
							subtype="text"
							:model-value="installedComponent.name"
							@update:model-value="
								updateState(
									installedComponentKey,
									$event,
									'name'
								)
							"
						/>
						<hr />
						<openwb-config-proxy
							:deviceId="installedDevice.id"
							:deviceType="installedDevice.type"
							:componentId="installedComponent.id"
							:componentType="installedComponent.type"
							:configuration="installedComponent.configuration"
							@update:configuration="
								updateConfiguration(
									installedComponentKey,
									$event
								)
							"
						/>
					</openwb-base-card>
				</openwb-base-card>
			</openwb-base-card>

			<openwb-base-submit-buttons
				formName="hardwareInstallationForm"
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
	faNetworkWired as fasNetworkWired,
	faMicrochip as fasMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasNetworkWired, fasMicrochip, fasTrash);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import OpenwbConfigProxy from "@/components/OpenwbConfigProxy.vue";

export default {
	name: "HardwareInstallation",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
		OpenwbConfigProxy,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/counter/get/hierarchy",
				"openWB/system/device/+/config",
				"openWB/system/device/+/component/+/config",
				"openWB/system/configurable/devices_components",
			],
			deviceToAdd: undefined,
			componentToAdd: [],
		};
	},
	computed: {
		installedDevices: {
			get() {
				return this.getWildcardTopics("openWB/system/device/+/config");
			},
		},
		installedComponents: {
			get() {
				return this.getWildcardTopics(
					"openWB/system/device/+/component/+/config"
				);
			},
		},
	},
	methods: {
		getMyInstalledComponents(deviceId) {
			return this.getWildcardTopics(
				"openWB/system/device/" + deviceId + "/component/+/config"
			);
		},
		addDevice() {
			this.$emit("sendCommand", {
				command: "addDevice",
				data: {
					type: this.deviceToAdd,
				},
			});
		},
		removeDevice(index, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info("request removal of device '" + index + "'");
			this.$emit("sendCommand", {
				command: "removeDevice",
				data: { id: index },
			});
		},
		getDeviceList() {
			return this.$store.state.mqtt[
				"openWB/system/configurable/devices_components"
			];
		},
		addComponent(deviceId, deviceType, componentType) {
			this.$emit("sendCommand", {
				command: "addComponent",
				data: {
					deviceId: deviceId,
					deviceType: deviceType,
					type: componentType,
				},
			});
		},
		removeComponent(deviceId, componentId, componentType, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.info(
				"request removal of component '" +
					componentId +
					"' from device '" +
					deviceId +
					"' type '" +
					componentType +
					"'"
			);
			this.$emit("sendCommand", {
				command: "removeComponent",
				data: {
					deviceId: deviceId,
					id: componentId,
					type: componentType,
				},
			});
		},
		getComponentList(deviceType) {
			if (deviceType === undefined) {
				return [];
			}
			console.debug("finding components for '" + deviceType + "'");
			let myDevice = this.$store.state.mqtt[
				"openWB/system/configurable/devices_components"
			].find((device) => device.value === deviceType);
			return myDevice.component;
		},
		updateConfiguration(key, event) {
			console.debug("updateConfiguration", event);
			this.updateState(key, event.value, event.object);
		},
	},
};
</script>

<style scoped>
.clickable {
	cursor: pointer;
}
</style>
