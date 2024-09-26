<script>
export default {
	emits: ["update:configuration"],
	props: {
		webTheme: { type: Object, required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
