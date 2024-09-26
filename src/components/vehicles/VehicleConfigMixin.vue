<script>
export default {
	emits: ["update:configuration"],
	props: {
		vehicleId: { required: true, type: Number },
		vehicle: { required: true, type: Object },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
