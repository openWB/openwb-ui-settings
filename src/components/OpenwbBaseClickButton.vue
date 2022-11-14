<template>
	<button type="button" class="btn btn-block" @click.prevent="click">
		<slot>{{ title }}</slot>
	</button>
</template>

<script>
export default {
	name: "OpenwbClickButton",
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
