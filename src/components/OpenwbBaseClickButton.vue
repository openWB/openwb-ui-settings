<template>
	<button type="button" class="btn btn-block" @click="click">
		<slot>{{ title }}</slot>
	</button>
</template>

<script>
export default {
	name: "ClickButton",
	props: {
		title: String,
	},
	emits: ["buttonClicked"],
	methods: {
		click(event) {
			this.$emit("buttonClicked", event);
		},
	},
};
</script>

<style scoped>
button:not(:disabled) {
	cursor: pointer;
}
</style>
