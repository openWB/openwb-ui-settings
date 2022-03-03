<template>
	<div class="card-text card-text-heading">
		<slot />
		<span v-if="$slots.actions" class="actions">
			<slot name="actions" />
		</span>
	</div>
</template>

<script>
export default {
	name: "OpenwbHeading",
};
</script>

<style scoped>
.card-text-heading {
	font-size: 125%;
	font-weight: bold;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	display: flex;
	justify-content: space-between;
}

.card-text-heading .actions {
	font-weight: normal;
	font-size: 75%;
}
</style>
