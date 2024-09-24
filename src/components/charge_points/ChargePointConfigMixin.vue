<script>
export default {
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
