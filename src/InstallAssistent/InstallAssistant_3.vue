<template>
	<div>
		<openwb-base-card
			:title="currentPage + 1 + '. ' + pages[currentPage].title"
			:class="currentPage > 0 && !isLastPage ? 'p-0' : ''"
		>
			<template #footer>
				<div class="row justify-content-center mb-1">
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-warning"
							@buttonClicked="previousPage()"
						>
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'caret-left']"
							/>
							Zurück
						</openwb-base-click-button>
					</div>
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-success"
							@buttonClicked="nextPage()"
						>
							Weiter
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'caret-right']"
							/>
						</openwb-base-click-button>
					</div>
					<div class="col-md-4 d-flex py-1 justify-content-center">
						<openwb-base-click-button
							class="btn-block btn-danger"
							@buttonClicked="endAssistant()"
						>
							Assistent beenden
						</openwb-base-click-button>
					</div>
				</div>
			</template>
			<div class="row justify-content-center mb-1">
				<div class="page-help-text col-md-3 py-2">
					<p>
						Hier wird abgefragt, ob ihr System mit mehreren openWBs
						oder nur mit einer openWB betrieben wird. Eine openWB
						kann andere openWBs steuern, wobei für jeden Ladepunkt
						eine openWB benötigt wird.
					</p>
					<p>
						Beim ersten Konfigurieren reicht es meist aus das Feld
						Steuerungsmodus (primary oder secondary) anzuwählen.
					</p>
					<p>
						Eine openWB standalone hat keinen Ladepunkt (nur
						primary). Eine openWB Standard(+), custom, Duo und
						Buchse können als primary oder secondary betrieben
						werden. Eine openWB Pro und Satellit können nur als
						secondary (als ein Ladepunkt) angeschlossen werden. Eine
						openWB Duo kann zwei Ladepunkte bedienen.
					</p>
					<p>
						Die Steuerung über Modbus dient zur Fernsteuerung über
						ein Nicht-openWB-System und sollte nicht gewählt werden,
						wenn Sie nur openWBs besitzen und die openWB-Software
						zur Steuerung nutzen wollen.
					</p>
					<p class="font-weight-bold">
						Änderungen werden nur bei klicken auf speichern wirksam
					</p>
				</div>
				<div class="col py-2">
					<GeneralConfig
						formName="generalConfigForm"
						@save="$emit('save')"
						@reset="$emit('reset')"
						@defaults="$emit('defaults')"
					/>
				</div>
			</div>
		</openwb-base-card>
	</div>
</template>

<script>
import GeneralConfig from "../views/GeneralConfig.vue"
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCaretLeft, fasCaretRight);

export default {
	name: "InstallAssistant3",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand"],
	props: [],
	components: {
		FontAwesomeIcon,
		GeneralConfig,
	},
	data() {
		return {
			currentPage: 3,
			pages: [
				{ title: "Start" },
				{ title: "Datenverwaltung" },
				{ title: "System" },
				{ title: "Allgemein" },
				{ title: "Ladepunkte" },
				{ title: "Geräte und Komponenten" },
				{ title: "Ladepunkte" },
				{ title: "Lastmanagement" },
				{ title: "Fahrzeuge" },
				{ title: "Abgeschlossen" },
			],
		};
	},
	methods: {
		nextPage() {
			window.scrollTo(0, 0);
			if(this.$store.state.mqtt["openWB/general/extern"] !== true)
			{
				this.$router.push('InstallAssistant5');
			}
			else{
				this.$router.push('InstallAssistant4');
			}
		},
		previousPage() {
			window.scrollTo(0, 0);
			this.$router.push('InstallAssistant2');
		},
		endAssistant() {
			//First time access to InstallWizard if "Assistent beenden" is pressed -> Wizard will not show on Startup anymore!
			if (!this.$store.state.mqtt["openWB/system/installAssistantDone"]) {
				this.updateState("openWB/system/installAssistantDone", true);
				this.$root.doPublish(
					"openWB/set/system/installAssistantDone",
					true,
				);
			}
			this.$router.push("/Status");
		},
	},
};
</script>

<style scoped>
.page-help-text {
	border-right: 1px solid rgba(0, 0, 0, 0.125);
	border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	background-color: rgba(0, 0, 0, 0.03);
}
</style>
