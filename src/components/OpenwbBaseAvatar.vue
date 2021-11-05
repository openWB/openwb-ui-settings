<template>
	<div class="avatar">
		<slot>?</slot>
	</div>
</template>

<script>
export default {
	name: "Avatar",
};
</script>

<style scoped>
.avatar {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 2.5em;
	height: 2.5em;
	border-radius: 50%;
}
</style>
