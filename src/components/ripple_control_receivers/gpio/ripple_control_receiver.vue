<template>
	<div class="ripple-control-receiver-gpio">
        <openwb-base-alert subtype="info">
			Wenn ein Kontakt geschlossen ist, wird die Ladung gesperrt. Wenn beide Kontakte offen sind, darf geladen werden.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "RippleControlReceiverGpio",
	emits: ["update:configuration"],
	props: {
		rippleControlReceiver: { type: Object, required: true },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
