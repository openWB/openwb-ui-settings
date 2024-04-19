<template>
	<div>
		
		<div class="popup">
			<div class="popup-inner">
				<slot/>
				<openwb-base-card
						:title="'Achtung - Kann zu Datenverlust führen'"
						>
						<h2>Wählen Sie eine Option</h2>
						<openwb-base-click-button class="btn-block btn-warning" @buttonClicked="closePopup()">Neukonfiguration starten</openwb-base-click-button>
						<openwb-base-click-button class="btn-block btn-success">Bestehende Konfiguration beibehalten</openwb-base-click-button>
						<openwb-base-click-button class="btn-block btn-danger">Abbrechen</openwb-base-click-button>
					</openwb-base-card>
					
			</div>
		</div>	
	</div>
</template>

<script>
import DataManagement from "./DataManagement.vue";
import System from "./System.vue";
import GeneralConfig from "./GeneralConfig.vue";
import ChargePointInstallation from "./ChargePointInstallation.vue";
import HardwareInstallation from "./HardwareInstallation.vue";
import LoadManagementConfig from "./LoadManagementConfig.vue";
import VehicleConfig from "./VehicleConfig.vue";
import ComponentState from "../components/mixins/ComponentState.vue";
import InstallAssistant from "./InstallAssistant.vue"

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCaretLeft as fasCaretLeft,
	faCaretRight as fasCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(
	fasCaretLeft,
	fasCaretRight,
);

export default {
	name: "Popup",
	mixins: [ComponentState],
	emits: ["save", "reset", "default", "sendCommand", "close"],
	props: {
		showPopup: {
			type: Boolean,
		},
	},
	components: {
		FontAwesomeIcon,
		DataManagement,
		System,
		GeneralConfig,
		ChargePointInstallation,
		HardwareInstallation,
		LoadManagementConfig,
		VehicleConfig,
		InstallAssistant,
	},
	data() {
		return {
		};
	},
	methods: {
		closePopup () {
			this.$emit("close");
			console.info("HIER: ", this.$emit("close"));
		},
		startFresh () {
			this.$emit('closePopup', this.popupTrigger)
		},
		keepConfig () {
			this.$emit('closePopup', this.popupTrigger)
		},
		abort () {
			this.$emit('closePopup', this.popupTrigger)
		},
	}
};
</script>

<style scoped>
.page-help-text {
	border-right: 1px solid rgba(0,0,0,.125);
	border-bottom: 1px solid rgba(0,0,0,.125);
	background-color: rgba(0, 0, 0, 0.03);
}
.popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	background-color: rgba(0,0,0,0.2);

	display: flex;
	align-items: center;
	justify-content: center;
}
.popup-inner {
	background: #ff0000;
	padding: 100px;
}

</style>