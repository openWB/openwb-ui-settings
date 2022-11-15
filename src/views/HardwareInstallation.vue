<template>
	<!-- modal dialogs -->
	<openwb-base-modal-dialog
		:show="showDeviceRemoveModal"
		title="Gerät löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeDevice"
	>
		Wollen Sie das Gerät "{{ modalDeviceName }}" inklusive aller Komponenten
		wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<openwb-base-modal-dialog
		:show="showComponentRemoveModal"
		title="Komponente löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeComponent"
	>
		Wollen Sie die Komponente "{{ modalComponentName }}" wirklich entfernen?
		Dieser Vorgang kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<!-- main content -->
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
			<openwb-base-card title="Geräte und Komponenten">
				<openwb-base-select-input
					class="mb-2"
					title="Verfügbare Geräte"
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
								@buttonClicked="addDevice"
							>
								<font-awesome-icon
									fixed-width
									:icon="['fas', 'plus']"
								/>
							</openwb-base-click-button>
						</span>
					</template>
					<template #help>
						Bitte ein Gerät auswählen, das hinzugefügt werden
						soll.<br />
						Für jedes physische Gerät, das abgefragt wird, wird ein
						separates Gerät konfiguiert. Wenn mehrere Daten über ein
						Gerät ausgelesen werden können, z.B. EVU und
						Wechselrichter-Daten vom Wechselrichter, werden für
						dieses Gerät die entsprechenden Komponenten
						konfiguriert. Wenn die Daten lokal abefragt werden,
						liefert meist die IP-Adresse den Hinweis auf die
						richtige Konfiguration: Wenn EVU- und
						Wechselrichter-Daten über zwei verschiedene IP-Adressen
						abgefragt werden, müssen zwei Geräte mit jeweils einer
						Komponente konfiguriert werden. Werden die Daten über
						die gleiche IP-Adresse abgefragt, wird ein Gerät mit
						einer Zähler- und einer Wechselrichter-Komponente
						angelegt.<br />
						Wenn in 1.9 bei einem/mehreren Modulen der Hinweis "Die
						Einstellungen bitte im
						EVU-/Speicher-/Wechselrichter-Modul vornehmen" steht,
						muss ein Gerät mit den enstprechenden Komponenten
						konfiguiert werden.
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
							@click="
								removeDeviceModal(
									installedDevice.id,
									installedDevice.name,
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
									@buttonClicked="
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
							werden soll. Für jeden Datensatz, z.B.
							Wechselrichter- und Batteriedaten, muss eine
							Wechselrichter- und eine Batteriekomponente
							hinzugefügt werden.
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
									removeComponentModal(
										installedDevice.id,
										installedComponent.id,
										installedComponent.type,
										installedComponent.name,
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

import OpenwbConfigProxy from "@/components/devices/OpenwbConfigProxy.vue";

export default {
	name: "OpenwbHardwareInstallation",
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
			showDeviceRemoveModal: false,
			modalDevice: undefined,
			modalDeviceName: "",
			componentToAdd: [],
			showComponentRemoveModal: false,
			modalComponent: undefined,
			modalComponentName: "",
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
		removeDeviceModal(index, name, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalDevice = index;
			this.modalDeviceName = name;
			this.showDeviceRemoveModal = true;
		},
		removeDevice(event) {
			this.showDeviceRemoveModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of device '" + this.modalDevice + "'"
				);
				this.$emit("sendCommand", {
					command: "removeDevice",
					data: { id: this.modalDevice },
				});
			}
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
		removeComponentModal(
			deviceId,
			componentId,
			componentType,
			componentName,
			event
		) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.modalComponent = {
				deviceId: deviceId,
				id: componentId,
				type: componentType,
			};
			this.modalComponentName = componentName;
			this.showComponentRemoveModal = true;
		},
		removeComponent(event) {
			this.showComponentRemoveModal = false;
			if (event == "confirm") {
				console.info(
					"request removal of component '" +
						this.modalComponent.id +
						"' from device '" +
						this.modalComponent.deviceId +
						"' type '" +
						this.modalComponent.type +
						"'"
				);
				this.$emit("sendCommand", {
					command: "removeComponent",
					data: this.modalComponent,
				});
			}
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
			console.debug("updateConfiguration", key, event);
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
