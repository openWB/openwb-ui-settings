<template>
	<alert
		v-if="alertData"
		subtype="danger"
		class="command-alert alert-dismissible"
	>
		Bei der Verarbeitung des Befehls '<span class="font-weight-bold">
			{{ alertData.command }}</span
		>' mit den Parametern '<span class="font-weight-bold">{{
			alertData.data
		}}</span>
		' ist ein Fehler aufgetreten:<br />
		<span class="font-weight-bold">{{ alertData.error }}</span>
		<button type="button" class="close" aria-label="Close" @click="dismiss">
			<span aria-hidden="true">&times;</span>
		</button>
	</alert>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
	name: "CommandAlert",
	components: { Alert },
	emits: ["dismiss"],
	props: {
		alertData: { type: Object, default: undefined },
	},
	methods: {
		dismiss() {
			this.$emit("dismiss");
		},
	},
};
</script>
