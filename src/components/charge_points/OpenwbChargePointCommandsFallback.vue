<template>
	<div class="charge-point-commands-fallback">
		<openwb-base-alert subtype="secondary">
			Der Ladepunkt-Typ "{{ chargePoint.type }}" bietet keine Befehle an.
		</openwb-base-alert>
	</div>
</template>

<script>
export default {
	name: "ChargePointCommandsFallback",
	props: {
		chargePoint: { type: Object, required: true },
	},
};
</script>
