<template>
	<openwb-base-alert
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
		<pre class="font-weight-bold">{{ alertData.error }}</pre>
		<button type="button" class="close" aria-label="Close" @click="dismiss">
			<span aria-hidden="true">&times;</span>
		</button>
	</openwb-base-alert>
</template>

<script>
export default {
	name: "OpenwbCommandAlert",
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
