<template>
	<div class="support">
		<form name="supportForm">
			<openwb-base-alert
				v-if="
					$store.state.mqtt[
						'openWB/system/dataprotection_acknowledged'
					] !== true
				"
				subtype="danger"
			>
				Sie müssen der
				<router-link to="/System/LegalSettings">
					Datenschutzerklärung
				</router-link>
				zustimmen, um einen Systembericht senden zu können.
			</openwb-base-alert>
			<div v-else>
				<openwb-base-alert subtype="success">
					Sie haben der
					<router-link to="/System/LegalSettings">
						Datenschutzerklärung
					</router-link>
					zugestimmt und können Systemberichte senden.
				</openwb-base-alert>
				<openwb-base-card title="Systembericht">
					<div
						v-if="
							$store.state.mqtt[
								'openWB/system/dataprotection_acknowledged'
							] === true
						"
					>
						<openwb-base-alert subtype="info">
							<ul>
								<li>
									Lesen Sie den Hilfetext, der durch Klick auf
									das
									<FontAwesomeIcon
										:icon="['far', 'question-circle']"
									/>
									angezeigt wird. Nehmen Sie das Wiki zur
									Hilfe.
								</li>
								<li>
									Vergewissern Sie sich, dass mindestens die
									aktuelle "Release" Version installiert ist.
								</li>
								<li>
									Stellen Sie beim Absenden des Berichtes die
									Fehlerkonditionen her. Lädt ein Fahrzeug
									nicht, sollte es angeschlossen und nicht
									voll geladen sein. Ist PV laden betroffen,
									sollte die Sonne auch scheinen. Der
									Systembericht muss dann versendet werden,
									wenn der Fehler aktuell vorliegt.
								</li>
								<li>
									Stellen Sie sicher, dass der Lademodus
									korrekt gewählt ist und im Falle von nicht
									ladenden Fahrzeugen, dass der Ladepunkt auch
									entsperrt wurde.
								</li>
								<li>
									Das Auslesen der Systemkonfiguration erfolgt
									direkt nach den Klick auf Absenden und kann
									einige Zeit in Anspruch nehmen. Sie erhalten
									ca. 15 bis 30 Minuten nach Versand des
									Systemberichtes von uns automatisch eine
									E-Mail mit der Ticketnummer unter der die
									Anfrage bei uns registriert wurde. Wir
									melden uns bei ihnen. Bitte kontrollieren
									Sie daher immer auch den Spam Ordner auf
									eingehende Nachrichten. Erhalten Sie
									trotzdem keine Ticketnummer, ist das
									Versenden des Systemberichtes
									fehlgeschlagen.
								</li>
							</ul>
						</openwb-base-alert>
						<openwb-base-text-input
							title="E-Mail"
							required
							subtype="email"
							v-model="sendDebugData.email"
						>
							<template #help>
								Deine E-Mail-Adresse, an die der Support Dir
								antwortet.
							</template>
						</openwb-base-text-input>
						<openwb-base-text-input
							title="openWB Seriennummer"
							required
							v-model="sendDebugData.serialNumber"
						>
							<template #help>
								Die Seriennummer der openWB finden Sie außen am
								Gehäuse - bei Älteren innen im Gehäuse. Sie
								können uns aber auch eine Bestellnummer oder
								Rechnungsnummer übermitteln. Das Gehäuse muss
								nicht extra geöffnet werden!
							</template>
						</openwb-base-text-input>
						<openwb-base-textarea
							title="Verwendete Komponenten"
							required
							minlength="3"
							maxlength="500"
							v-model="sendDebugData.installedComponents"
						>
							<template #help>
								Geben Sie hier möglichst detailliert an, welche
								Anlagenkomponenten (EVU, PV, Speicher)
								angebunden sind.
							</template>
						</openwb-base-textarea>
						<openwb-base-textarea
							title="Fahrzeuge"
							required
							minlength="3"
							maxlength="500"
							v-model="sendDebugData.vehicles"
						>
							<template #help>
								Geben Sie hier an, welche Fahrzeuge geladen
								werden (Hersteller, Modell, Baujahr).
							</template>
						</openwb-base-textarea>
						<openwb-base-textarea
							title="Problembeschreibung"
							required
							minlength="20"
							maxlength="500"
							v-model="sendDebugData.message"
						/>
					</div>
					<template
						#footer
						v-if="
							$store.state.mqtt[
								'openWB/system/dataprotection_acknowledged'
							] === true
						"
					>
						<div class="row justify-content-center">
							<openwb-base-click-button
								class="col-4"
								:class="
									enableSendDebugButton
										? 'btn-success'
										: 'btn-outline-success'
								"
								:disabled="!enableSendDebugButton"
								@buttonClicked="sendDebugMessage"
							>
								Absenden
							</openwb-base-click-button>
						</div>
					</template>
				</openwb-base-card>
				<openwb-base-alert
					v-if="!enableSendDebugButton"
					subtype="success"
				>
					Die Daten für den Fehlerbericht werden im Hintergrund
					zusammengestellt. Sie können diese Seite jetzt verlassen.
					<font-awesome-icon fixed-width :icon="['fas', 'check']" />
				</openwb-base-alert>
			</div>
		</form>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbSupportView",
	mixins: [ComponentState],
	emits: ["sendCommand"],
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/dataprotection_acknowledged",
				"openWB/system/serial_number",
				"openWB/system/device",
				"openWB/system/device/+/config",
				"openWB/system/device/+/component/+/config",
				"openWB/vehicle/+/name",
				"openWB/vehicle/+/info",
			],
			sendDebugData: {
				email: "",
				serialNumber: "",
				installedComponents: "",
				vehicles: "",
				message: "",
			},
			enableSendDebugButton: true,
		};
	},
	methods: {
		sendDebugMessage() {
			let myForm = document.forms["supportForm"];
			if (!myForm.reportValidity()) {
				console.warn("form invalid");
				return;
			} else {
				this.$emit("sendCommand", {
					command: "sendDebug",
					data: this.sendDebugData,
				});
				this.enableSendDebugButton = false;
			}
		},
	},
	computed: {
		getInstalledComponents() {
			let componentText = "";
			const devices = this.getWildcardTopics(
				"openWB/system/device/+/config",
			);
			for (const [, deviceConfig] of Object.entries(devices)) {
				const deviceId = deviceConfig.id;
				const deviceName = deviceConfig.name;
				componentText += `DID: ${deviceId}, ${deviceName}\n`;

				const components = this.getWildcardTopics(
					`openWB/system/device/${deviceId}/component/+/config`,
				);

				for (const [, componentConfig] of Object.entries(components)) {
					const componentId = componentConfig.id;
					const componentName = componentConfig.name;
					const componentType = componentConfig.type;
					const manufacturer =
						componentConfig.info?.manufacturer || "N/A";
					const model = componentConfig.info?.model || "N/A";
					componentText += `  CID: ${componentId}, ${componentName}, Type: ${componentType}, Manufacturer: ${manufacturer}, Model: ${model}\n`;
				}
				componentText += "\n"; // Add an extra newline between devices
			}
			return componentText.trim();
		},
		getSerialNumber() {
			const serial = this.getWildcardTopics(
				"openWB/system/serial_number",
			);
			const serialKey = Object.keys(serial);
			return serial[serialKey];
		},
		getVehicleDetails() {
			let vehicleText = "";
			const vehicles = this.getWildcardTopics("openWB/vehicle/+/name");
			console.log(vehicles);
			for (const [vehicleTopic, vehicleValue] of Object.entries(
				vehicles,
			)) {
				const vehicleId = vehicleTopic.split("/")[2];
				const vehicleName = vehicleValue;
				console.log(vehicleId);
				console.log(vehicleValue);
				vehicleText += `ID: ${vehicleId} Name:${vehicleName}\n`;
				console.log(vehicleText);

				const vehicleDetails = this.getWildcardTopics(
					`openWB/vehicle/${vehicleId}/info`,
				);

				for (const [, vehicleInfoValue] of Object.entries(
					vehicleDetails,
				)) {
					const make = vehicleInfoValue?.manufacturer || "N/A";
					const model = vehicleInfoValue?.model || "N/A";
					vehicleText += `   Manufacturer: ${make} Model:${model}\n`;
				}
				vehicleText += "\n";
			}
			return vehicleText.trim();
		},
	},
	watch: {
		getInstalledComponents: {
			handler(newValue) {
				this.sendDebugData.installedComponents = newValue;
			},
			immediate: true,
		},
		getSerialNumber: {
			handler(newValue) {
				this.sendDebugData.serialNumber = newValue;
			},
			immediate: true,
		},
		getVehicleDetails: {
			handler(newValue) {
				this.sendDebugData.vehicles = newValue;
			},
			immediate: true,
		},
	},
};
</script>
