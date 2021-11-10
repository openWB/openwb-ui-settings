<template>
	<div class="chargepoint-installation">
		<openwb-base-card
			title="Ladepunkte"
			:collapsible="true"
			:collapsed="true"
		>
			<openwb-base-select-input
				class="mb-2"
				title="Verfügbare Ladepunkte"
				notSelected="Bitte auswählen"
				:options="getChargepointList()"
				:model-value="chargepointToAdd"
				@update:model-value="chargepointToAdd = $event"
			>
				<template #append>
					<span class="col-1">
						<openwb-base-click-button
							:class="
								chargepointToAdd === undefined
									? 'btn-outline-success'
									: 'btn-success'
							"
							:disabled="chargepointToAdd === undefined"
							@click="addChargepoint"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'plus']"
							/>
						</openwb-base-click-button>
					</span>
				</template>
				<template #help>
					Bitte einen Ladepunkt auswählen, der hinzugefügt werden
					soll.
				</template>
			</openwb-base-select-input>
			<openwb-base-card
				v-for="(
					installedChargepoint, installedChargepointKey
				) in installedChargepoints"
				:key="installedChargepointKey"
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
					{{ installedChargepoint.name }}
				</template>
				<template #actions>
					<openwb-base-avatar
						class="bg-danger"
						@click="
							removeChargepointModal(
								installedChargepointKey,
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
					:model-value="installedChargepoint.name"
					@update:model-value="
						updateState(installedChargepointKey, $event, 'name')
					"
				/>
				<openwb-base-select-input
					title="Ladepunkt-Vorlage"
					:options="chargepointTemplateList"
					:model-value="
						$store.state.mqtt[installedChargepointKey].template
					"
					@update:model-value="
						updateState(installedChargepointKey, $event, 'template')
					"
				/>
				<hr />
			</openwb-base-card>
		</openwb-base-card>
		<openwb-base-card
			title="Ladepunkt-Vorlagen"
			:collapsible="true"
			:collapsed="true"
		>
			<openwb-base-heading>ToDo...</openwb-base-heading>
		</openwb-base-card>

		<openwb-base-submit-buttons
			@save="$emit('save')"
			@reset="$emit('reset')"
			@defaults="$emit('defaults')"
		/>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPlus as fasPlus,
	faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash);

import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "ChargepointInstallation",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/chargepoint/+/config",
				"openWB/chargepoint/template/+/rfid_enabling",
				"openWB/chargepoint/template/+/valid_tags",
			],
			chargepointToAdd: undefined,
		};
	},
	computed: {
		installedChargepoints: {
			get() {
				return this.getWildcardTopics("openWB/chargepoint/+/config");
			},
		},
		chargepointTemplates: {
			get() {
				return this.getWildcardTopics(
					"openWB/chargepoint/template/+/rfid_enabling"
				);
			},
		},
		chargepointTemplateList: {
			get() {
				let myList = [];
				Object.keys(this.chargepointTemplates).forEach((key) => {
					console.log(key);
					let index = parseInt(key.match(/([0-9]+)/g)[0]);
					let name = index;
						// this.$store.state.mqtt[
						// 	"openWB/chargepoint/template/" + index + "/rfid_enabling"
						// ];
					console.log("index: " + index, "name: " + name);
					myList.push({ value: index, text: name });
				});
				return myList;
			},
		},
	},
	methods: {
		addChargepoint() {
			this.$emit("sendCommand", {
				command: "addChargepoint",
				data: {
					type: this.chargepointToAdd,
				},
			});
		},
		removeChargepointModal(vehicleIndex, event) {
			// prevent further processing of the click event
			event.stopPropagation();
			console.log("removeChargepointModal");
		},
		getChargepointList() {
			return this.$store.state.examples.availableChargepoints;
		},
	},
};
</script>

<style></style>
