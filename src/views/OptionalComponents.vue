<template>
	<div class="optionalComponents">
		<form id="myForm">
			<card title="RFID"> </card>
			<card title="LED-Ausgänge"> </card>
			<card title="Display (intern oder extern)"> </card>
			<card title="Loadsharing"> </card>
			<card title="Variable Stromtarife"> </card>
			<submit-buttons
				@save="$emit('save')"
				@reset="$emit('reset')"
				@defaults="$emit('defaults')"
			/>
		</form>
	</div>
</template>

<script>
import Card from "@/components/Card.vue";
// import Alert from "@/components/Alert.vue";
// import Heading from "@/components/Heading.vue";
// import TextInput from "@/components/TextInput.vue";
// import NumberInput from "@/components/NumberInput.vue";
// import TextareaInput from "@/components/TextareaInput.vue";
// import RangeInput from "@/components/RangeInput.vue";
// import SelectInput from "@/components/SelectInput.vue";
// import ButtonGroupInput from "@/components/ButtonGroupInput.vue";
// import CheckboxInput from "@/components/CheckboxInput.vue";
// import SortableList from "@/components/SortableList.vue";
import SubmitButtons from "@/components/SubmitButtons.vue";

export default {
	name: "OptionalComponents",
	components: {
		Card,
		// Alert,
		// Heading,
		// TextInput,
		// NumberInput,
		// TextareaInput,
		// RangeInput,
		// SelectInput,
		// ButtonGroupInput,
		// CheckboxInput,
		// SortableList,
		SubmitButtons,
	},
	emits: ["reset", "defaults", "save"],
	methods: {
		updateState(topic, value) {
			console.debug(topic, typeof value, value);
			this.$store.commit({
				type: "updateTopic",
				topic: topic,
				payload: value,
			});
		},
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/Uptime",
				"openWB/system/Version",
			],
		};
	},
	beforeMount() {
		console.debug("testing-store before mount");
		this.$root.doSubscribe(this.mqttTopicsToSubscribe);
	},
	unmounted() {
		console.debug("testing-store unmounted");
		this.$root.doUnsubscribe(this.mqttTopicsToSubscribe);
	},
};
</script>
