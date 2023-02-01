<template>
	<div class="charge-point-commands-fallback">
		<openwb-base-alert subtype="secondary">
			Der Ladepunkt-Typ "{{ chargePointType }}" bietet keine Befehle an.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "ChargePointCommandsFallback",
	props: {
		configuration: { type: Object, required: true },
		chargePointId: { default: undefined },
		chargePointType: String,
	},
};
</script>
