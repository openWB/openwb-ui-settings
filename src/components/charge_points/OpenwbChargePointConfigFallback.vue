<template>
	<div class="device-fallback">
		<openwb-base-alert
			v-if="Object.keys(chargePoint.configuration).length == 0"
			subtype="info"
		>
			Der Ladepunkt-Typ "{{ chargePoint.type }}" bietet keine
			Einstellungen.
		</openwb-base-alert>
		<div v-else>
			<openwb-base-alert subtype="warning">
				Es wurde keine Konfigurationsseite für den Ladepunkt-Typ "{{
					chargePoint.type
				}}" gefunden. Die Einstellungen können als JSON direkt
				bearbeitet werden.
			</openwb-base-alert>
			<openwb-base-textarea
				title="Konfiguration"
				subtype="json"
				:model-value="chargePoint.configuration"
				@update:model-value="
					updateConfiguration($event, 'configuration')
				"
			>
				<template #help>
					Bitte prüfen Sie, ob die Eingaben richtig interpretiert
					werden.
				</template>
			</openwb-base-textarea>
			<openwb-base-alert subtype="info">
				<pre>{{
					JSON.stringify(chargePoint.configuration, undefined, 2)
				}}</pre>
			</openwb-base-alert>
		</div>
	</div>
</template>

<script>
export default {
	name: "ChargePointConfigFallback",
	emits: ["update:configuration"],
	props: {
		chargePoint: { type: Object, required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
