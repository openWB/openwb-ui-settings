<template>
	<div class="card-text card-text-heading">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "Heading",
};
</script>

<style scoped>
.card-text-heading {
	font-size: 125%;
	font-weight: bold;
	margin-top: 1rem;
}
</style>
