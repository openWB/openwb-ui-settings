<template>
	<div class="chargeLog">
		<form name="chargeLogForm">
			<openwb-base-card title="Filter">
				<openwb-base-text-input
					title="Zeitraum"
					subtype="month"
					min="2018-01"
					max="2021-12"
					v-model="chargeLogDate"
				/>
				<openwb-base-card
					title="Erweiterte Optionen"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-textarea
						title="Filter Objekt"
						subtype="json"
						readonly
						v-model="chargeLogRequestData"
					/>
				</openwb-base-card>
				<template #footer>
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4 btn-success"
							@click="requestChargeLog()"
						>
							Filter anwenden
						</openwb-base-click-button>
					</div>
				</template>
			</openwb-base-card>
			<openwb-base-card title="Ladeprotokoll"></openwb-base-card>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "ChargeLog",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: ["openWB/general/extern"],
			chargeLogRequestData: {
				month: "12",
				year: "2021",
				filter: {
					chargepoint: {
						id: [],
					},
					vehicle: {
						id: [],
						rfid: [],
						chargemode: [],
						prio: [],
					},
				},
			},
		};
	},
	computed: {
		chargeLogDate: {
			get() {
				return (
					this.chargeLogRequestData.year +
					"-" +
					this.chargeLogRequestData.month
				);
			},
			set(newValue) {
				let splitDate = newValue.split("-");
				this.chargeLogRequestData.year = splitDate[0];
				this.chargeLogRequestData.month = splitDate[1];
			},
		},
	},
	methods: {
		requestChargeLog() {
			let myForm = document.forms["chargeLogForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				console.log(this.chargeLogRequestData);
				this.$emit("sendCommand", {
					command: "getChargeLog",
					data: this.chargeLogRequestData,
				});
			}
		},
	},
};
</script>
