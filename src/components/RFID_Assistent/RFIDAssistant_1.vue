<template>
	<div class="optionalComponents">
		<form name="optionalComponentsForm">
			<openwb-base-card title="Identifikation von Fahrzeugen">
				<openwb-base-button-group-input
					title="Identifikation aktivieren"
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
						Die Identifikation von Fahrzeugen kann auf mehreren
						Wegen erfolgen:
						<ul>
							<li>
								Über einen in der openWB verbauten RFID-Reader
								(optional, z.B. anhand des Lieferscheins
								prüfen).
							</li>
							<li>
								Durch die automatische Erkennung an einer openWB
								Pro (muss in den Einstellungen aktiviert
								werden).
							</li>
							<li>
								Durch manuelle Eingabe einer ID am Display einer
								openWB.
							</li>
						</ul>
					</template>
				</openwb-base-button-group-input>
				<div
					v-if="
						$store.state.mqtt['openWB/optional/rfid/active'] ===
						true
					"
				>
					<openwb-base-alert subtype="info" class="mb-1">
						Die ID-Tags, die an dem jeweiligen Ladepunkt gültig
						sind, müssen in dem Ladepunkt-Profil hinterlegt werden.
						Die ID-Tags können auch in den Einstellungen der
						Fahrzeuge diesen zugeordnet werden.<br />
						Dadurch wird der Ladepunkt entsperrt und das diesem ID-Tag zugeordnete 
						Fahrzeug startet den Ladevorgang. Diese Option macht vor allem Sinn, wenn in 
						den Einstellungen der Fahrzeuge Sperren nach Abstecken aktiviert ist.
						Es kann zuerst das Fahrzeug angesteckt und dann der
						ID-Tag erfasst werden oder anders herum. Im letzten Fall
						muss innerhalb von 5 Minuten ein Fahrzeug angesteckt
						werden, sonst wird der ID-Tag verworfen. Das Fahrzeug
						wird erst nach dem Anstecken zugeordnet.<br />
						<span v-html="$store.state.text.rfidWiki" />
					</openwb-base-alert>
					<openwb-base-textarea
						title="Erkannte ID-Tags"
						readonly
						disabled
						:model-value="idTagList.join('\n')"
					>
						<template #help>
							Solange diese Seite geöffnet ist, werden alle
							erfassten ID-Tags in dieser Liste aufgeführt.
						</template>
					</openwb-base-textarea>
				</div>
			</openwb-base-card>
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
import ComponentState from "../mixins/ComponentState.vue";
import OpenwbDisplayThemeProxy from "../display_themes/OpenwbDisplayThemeProxy.vue";

export default {
	name: "RFIDAssistantPage1",
	mixins: [ComponentState],
	components: { OpenwbDisplayThemeProxy },
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/chargepoint/+/config",
				"openWB/chargepoint/+/get/rfid",
				"openWB/chargepoint/+/get/rfid_timestamp",
				"openWB/chargepoint/+/set/rfid",
				"openWB/optional/rfid/active",
			],
			tempIdTagList: {},
		};
	},
	computed: {
		idTagList() {
			return Object.values(this.updateIdTagList());
		},
	},
	methods: {
		getIdFromTopic(topic) {
			return topic
				.match(/(?:\/)([0-9]+)(?=\/)*/g)[0]
				.replace(/[^0-9]+/g, "");
		},
		updateIdTagList() {
			Object.entries(
				// get all id-tag topics/values
				this.getWildcardTopics(
					"^openWB/chargepoint/[^+/]+/[gs]et/rfid$",
					true,
				),
			).forEach((entry) => {
				if (entry[1] !== null) {
					this.tempIdTagList[entry[1]] = `${entry[1]} (${
						entry[0].includes("/set/") ? "zugewiesen" : "erfasst"
					} an ${this.getChargePointName(
						this.getIdFromTopic(entry[0]),
					)})`;
				}
			});
			return this.tempIdTagList;
		},
		getChargePointName(chargePointIndex) {
			return this.$store.state.mqtt[
				"openWB/chargepoint/" + chargePointIndex + "/config"
			]
				? this.$store.state.mqtt[
						"openWB/chargepoint/" + chargePointIndex + "/config"
					].name
				: "Ladepunkt " + chargePointIndex;
		},
	},
};
</script>
