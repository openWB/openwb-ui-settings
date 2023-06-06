<template>
	<!-- modal dialogs -->
	<openwb-base-modal-dialog
		:show="showCloudRemoveModal"
		title="Cloud Zugang löschen"
		subtype="danger"
		:buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
		@modal-result="removeCloud($event)"
	>
		Wollen Sie den vorhandenen Cloud Zugang wirklich entfernen? Dieser
		Vorgang kann nicht rückgängig gemacht werden!
	</openwb-base-modal-dialog>
	<!-- main content -->
	<div class="cloud-config">
		<openwb-base-alert subtype="danger">
			Für diese Version gibt es noch keine Weboberfläche in der Cloud!
			Wenn der Zugang eingerichtet wurde, können z. B. Daten mit einem
			MQTT-Client von dem MQTT-Broker web.openwb.de abgerufen werden.
			Ebenfalls kann ein Support-Tunnel aufgebaut werden. Weitere
			Funktionen sind in der Entwicklung.
		</openwb-base-alert>
		<openwb-base-alert
			v-if="
				$store.state.mqtt[
					'openWB/system/dataprotection_acknowledged'
				] !== true
			"
			subtype="danger"
		>
			Sie müssen der
			<router-link to="/System/DataProtection">
				Datenschutzerklärung
			</router-link>
			zustimmen, um die openWB Cloud nutzen zu können.
		</openwb-base-alert>
		<div v-else>
			<openwb-base-alert subtype="success">
				Sie haben der
				<router-link to="/System/DataProtection">
					Datenschutzerklärung
				</router-link>
				zugestimmt und können die openWB Cloud nutzen.
			</openwb-base-alert>
			<openwb-base-alert
				v-if="!enableRemoveCloudButton"
				subtype="warning"
			>
				Der Zugang wurde entfernt. Bitte starten Sie die openWB neu, um
				die Änderungen anzuwenden!
			</openwb-base-alert>
			<form v-if="!cloudBridgeKey" name="cloudConfigCreateForm">
				<openwb-base-card title="Neuen Zugang erstellen">
					<openwb-base-alert subtype="warning">
						Derzeit können keine neuen Zugänge für die openWB Cloud
						angelegt werden. Bitte nutzen Sie die in/an der openWB
						notierten Zugangsdaten im unteren Bereich dieser Seite.
						Wenn bei einer gekauften openWB keine Zugangsdaten
						vorhanden sind, schreiben Sie bitte eine Mail unter
						Angabe der Bestell- und/oder Seriennummer an
						<a
							href="mailto:support@openwb.de"
							subject="Cloud Zugangsdaten"
						>
							support@openwb.de
						</a>
						.
					</openwb-base-alert>
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === true
						"
					>
						<openwb-base-alert subtype="info">
							Diese openWB befindet sich im Modus "Nur Ladepunkt".
							Bitte richten Sie die openWB Cloud auf der regelnden
							openWB ein.
						</openwb-base-alert>
					</div>
					<div v-else>
						<openwb-base-text-input
							title="Benutzername"
							required
							subtype="user"
							pattern="[a-zA-Z]+"
							v-model="newCloudData.username"
							disabled
						/>
						<openwb-base-text-input
							title="E-Mail"
							required
							subtype="email"
							v-model="newCloudData.email"
							disabled
						/>
						<openwb-base-button-group-input
							disabled
							title="Zugang für Partner"
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
							v-model="newCloudData.partner"
						>
							<template #help>
								Wenn diese openWB über einen Partner erworben
								wurde, kann hier ein Support-Zugang für diesen
								freigegeben werden.
							</template>
						</openwb-base-button-group-input>
					</div>
					<template
						#footer
						v-if="
							$store.state.mqtt['openWB/general/extern'] ===
								false &&
							$store.state.mqtt[
								'openWB/system/dataprotection_acknowledged'
							] === true
						"
					>
						<div class="row justify-content-center">
							<!-- <openwb-base-click-button
								class="col-4"
								:class="
									enableNewCloudButton
										? 'btn-success'
										: 'btn-outline-success'
								"
								:disabled="!enableNewCloudButton"
								@buttonClicked="createCloud"
							>
								Zugang erstellen
							</openwb-base-click-button> -->
							<openwb-base-click-button
								class="col-4 btn-outline-success"
								disabled
							>
								Zugang erstellen
							</openwb-base-click-button>
						</div>
					</template>
				</openwb-base-card>
				<openwb-base-alert
					v-if="!enableNewCloudButton"
					subtype="info"
					class="mb-2"
				>
					Der neue Zugang wird eingerichtet. Dieser Vorgang kann bis
					zu einer Minute dauern. Bitte warten.
				</openwb-base-alert>
			</form>
			<form v-if="!cloudBridgeKey" name="cloudConfigConnectForm">
				<openwb-base-card title="Vorhandenen Zugang einrichten">
					<div
						v-if="
							$store.state.mqtt['openWB/general/extern'] === true
						"
					>
						<openwb-base-alert subtype="info">
							Diese openWB befindet sich im Modus "Nur Ladepunkt".
							Bitte richten Sie die openWB Cloud auf der regelnden
							openWB ein.
						</openwb-base-alert>
					</div>
					<div v-else>
						<openwb-base-text-input
							title="Benutzername"
							required
							subtype="user"
							v-model="connectCloudData.username"
						/>
						<openwb-base-text-input
							title="Passwort"
							required
							subtype="password"
							v-model="connectCloudData.password"
						/>
						<openwb-base-button-group-input
							title="Zugang für Partner"
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
							v-model="connectCloudData.partner"
						>
							<template #help>
								Wenn diese openWB über einen Partner erworben
								wurde, kann hier ein Support-Zugang für diesen
								freigegeben werden.
							</template>
						</openwb-base-button-group-input>
					</div>
					<template
						#footer
						v-if="
							$store.state.mqtt['openWB/general/extern'] ===
								false &&
							$store.state.mqtt[
								'openWB/system/dataprotection_acknowledged'
							] === true
						"
					>
						<div class="row justify-content-center">
							<openwb-base-click-button
								class="col-4"
								:class="
									enableCloudConnectButton
										? 'btn-success'
										: 'btn-outline-success'
								"
								:disabled="!enableCloudConnectButton"
								@buttonClicked="connectCloud"
							>
								Mit Cloud verbinden
							</openwb-base-click-button>
						</div>
					</template>
				</openwb-base-card>
			</form>
			<form v-if="cloudBridgeKey" name="cloudConfigured">
				<openwb-base-alert
					v-if="!enableCloudConnectButton || !enableNewCloudButton"
					subtype="warning"
				>
					Der Zugang wurde eingerichtet. Bitte starten Sie die openWB
					neu, um die Änderungen anzuwenden!
				</openwb-base-alert>
				<openwb-base-card title="Vorhandener Cloud Zugang">
					<openwb-base-heading>
						<span>
							Mit diesen Zugangsdaten können Sie sich in der
							<a href="https://web.openwb.de/">openWB Cloud </a>
							anmelden.
						</span>
					</openwb-base-heading>
					<openwb-base-text-input
						title="Benutzername"
						required
						subtype="user"
						v-model="cloudSettings.username"
						disabled
					/>
					<openwb-base-text-input
						title="Passwort"
						required
						subtype="password"
						v-model="cloudSettings.password"
						disabled
					/>
					<hr />
					<openwb-base-button-group-input
						title="Zugang für Partner"
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
						:model-value="cloudSettings.partner"
						@update:model-value="
							updateState(
								cloudBridgeKey,
								$event,
								'access.partner'
							)
						"
					>
						<template #help>
							Wenn diese openWB über einen Partner erworben wurde,
							kann hier ein Support-Zugang für diesen freigegeben
							werden.
						</template>
					</openwb-base-button-group-input>
					<template #footer>
						<div class="row justify-content-center">
							<openwb-base-click-button
								class="col-4"
								:class="
									enableRemoveCloudButton
										? 'btn-danger'
										: 'btn-outline-danger'
								"
								:disabled="!enableRemoveCloudButton"
								@buttonClicked="removeCloudModal($event)"
							>
								Zugang löschen
							</openwb-base-click-button>
						</div>
					</template>
				</openwb-base-card>
			</form>
			<openwb-base-submit-buttons
				v-if="cloudBridgeKey"
				formName="cloudConfigured"
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</div>
	</div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbCloudConfig",
	mixins: [ComponentState],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
				"openWB/system/mqtt/bridge/+",
			],
			enableNewCloudButton: true,
			newCloudData: {
				email: "",
				username: "",
				partner: false,
			},
			enableCloudConnectButton: true,
			connectCloudData: {
				username: "",
				password: "",
				partner: false,
			},
			enableRemoveCloudButton: true,
			showCloudRemoveModal: false,
		};
	},
	computed: {
		cloudBridge: {
			get() {
				let bridges = this.getWildcardTopics(
					"openWB/system/mqtt/bridge/+"
				);
				for (const [key, value] of Object.entries(bridges)) {
					if (!value.remote.is_openwb_cloud) {
						delete bridges[key];
					}
				}
				return bridges;
			},
		},
		cloudBridgeKey: {
			get() {
				for (const [key, value] of Object.entries(this.cloudBridge)) {
					if (value.remote.is_openwb_cloud) {
						return key;
					}
				}
				return undefined;
			},
		},
		cloudSettings: {
			get() {
				return {
					username:
						this.cloudBridge[this.cloudBridgeKey].remote.username,
					password:
						this.cloudBridge[this.cloudBridgeKey].remote.password,
					partner: this.cloudBridge[this.cloudBridgeKey].access
						? this.cloudBridge[this.cloudBridgeKey].access.partner
						: false,
				};
			},
		},
	},
	methods: {
		getMqttBridgeIndex(bridgeKey) {
			return parseInt(bridgeKey.match(/(?:\/)(\d+)$/)[1]);
		},
		createCloud() {
			if (document.forms.cloudConfigCreateForm.reportValidity()) {
				this.$emit("sendCommand", {
					command: "initCloud",
					data: this.newCloudData,
				});
				this.enableNewCloudButton = false;
			}
		},
		connectCloud() {
			if (document.forms.cloudConfigConnectForm.reportValidity()) {
				this.$emit("sendCommand", {
					command: "connectCloud",
					data: this.connectCloudData,
				});
				this.enableCloudConnectButton = false;
			}
		},
		removeCloudModal(event) {
			// prevent further processing of the click event
			event.stopPropagation();
			this.showCloudRemoveModal = true;
		},
		removeCloud(event) {
			this.showCloudRemoveModal = false;
			if (event == "confirm") {
				console.info("request removal of cloud");
				this.$emit("sendCommand", {
					command: "removeMqttBridge",
					data: {
						bridge: this.getMqttBridgeIndex(this.cloudBridgeKey),
					},
				});
				this.enableCloudConnectButton = true;
				// this.enableNewCloudButton = true;
			}
		},
	},
};
</script>
