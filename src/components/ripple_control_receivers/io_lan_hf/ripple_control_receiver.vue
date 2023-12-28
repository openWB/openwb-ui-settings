<template>
	<div class="ripple-control-receiver-io-lan-hf">
        <openwb-base-alert subtype="info">
			Wenn mindestens ein Kontakt offen ist, wird die Ladung gesperrt. Wenn beide Kontakte geschlossen sind, darf geladen werden.
		</openwb-base-alert>
		<openwb-base-text-input
            title="IP oder Hostname"
            subtype="host"
            required
            :model-value="rippleControlReceiver.configuration.ip_address"
            @update:model-value="
                updateConfiguration($event, 'configuration.ip_address')
            "
        />
        <openwb-base-number-input
            title="Port"
            required
            :model-value="rippleControlReceiver.configuration.port"
            @update:model-value="
                updateConfiguration($event, 'configuration.port')
            "
        />
        <openwb-base-number-input
            title="Modbus-ID"
            required
            :min="1"
            :max="255"
            :model-value="rippleControlReceiver.configuration.modbus_id"
            @update:model-value="
                updateConfiguration($event, 'configuration.modbus_id')
            "
        />
	</div>
</template>

<script>
export default {
	name: "RippleControlReceiverIoLanHf",
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
