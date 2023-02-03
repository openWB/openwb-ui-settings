<template>
	<div class="openwb-blocker">
		<openwb-base-modal-dialog
			:show="showModalBlocker"
			title="OpenWB ist noch nicht bereit"
			subtype="dark"
			:preventClose="true"
		>
			<p v-if="bootInProgress">
				Der Systemstart ist noch nicht abgeschlossen.
			</p>
			<p v-if="updateInProgress">
				Es wird eine Systemaktualisierung ausgeführt.
			</p>
			<p>Bitte warten...</p>
		</openwb-base-modal-dialog>
	</div>
</template>

<script>
import ComponentState from "./mixins/ComponentState.vue";

export default {
	name: "OpenwbPageBlocker",
	mixins: [ComponentState],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/boot_done",
				"openWB/system/update_in_progress",
			],
		};
	},
	computed: {
		bootInProgress() {
			if (
				this.$store.state.mqtt["openWB/system/boot_done"] == undefined
			) {
				return false;
			}
			return !this.$store.state.mqtt["openWB/system/boot_done"];
		},
		updateInProgress() {
			if (
				this.$store.state.mqtt["openWB/system/update_in_progress"] ==
				undefined
			) {
				return false;
			}
			return this.$store.state.mqtt["openWB/system/update_in_progress"];
		},
		showModalBlocker() {
			return this.bootInProgress || this.updateInProgress;
		},
	},
};
</script>

<style scoped></style>
