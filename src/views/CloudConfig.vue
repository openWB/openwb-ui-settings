<template>
	<div class="support">
		<openwb-base-alert
			v-if="
				$store.state.mqtt[
					'openWB/system/dataprotection_acknowledged'
				] !== true
			"
			subtype="danger"
		>
			Sie müssen der
			<router-link to="/System/Dataprotection">
				Datenschutzerklärung
			</router-link>
			zustimmen, um die openWB Cloud nutzen zu können.
		</openwb-base-alert>
		<div v-else>
			<openwb-base-alert subtype="success">
				Sie haben der
				<router-link to="/System/Dataprotection">
					Datenschutzerklärung
				</router-link>
				zugestimmt und können die openWB Cloud nutzen.
			</openwb-base-alert>
			<openwb-base-card title="Neuen Zugang erstellen">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
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
					/>
					<openwb-base-text-input
						title="E-Mail"
						required
						subtype="email"
					/>
				</div>
				<template
					#footer
					v-if="
						$store.state.mqtt['openWB/general/extern'] === false &&
						$store.state.mqtt[
							'openWB/system/dataprotection_acknowledged'
						] === true
					"
				>
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4"
							:class="
								enableNewCloudButton
									? 'btn-success'
									: 'btn-outline-success'
							"
						>
							Absenden
						</openwb-base-click-button>
					</div>
				</template>
			</openwb-base-card>
			<openwb-base-card title="Vorhandenen Zugang einrichten">
				<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
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
					/>
					<openwb-base-text-input
						title="Passwort"
						required
						subtype="password"
					/>
				</div>
				<template
					#footer
					v-if="
						$store.state.mqtt['openWB/general/extern'] === false &&
						$store.state.mqtt[
							'openWB/system/dataprotection_acknowledged'
						] === true
					"
				>
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4"
							:class="
								enableNewCloudButton
									? 'btn-success'
									: 'btn-outline-success'
							"
						>
							Absenden
						</openwb-base-click-button>
					</div>
				</template>
			</openwb-base-card>
		</div>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "Support",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
				"openWB/system/cloud",
			],
			enableNewCloudButton: true,
		};
	},
};
</script>
