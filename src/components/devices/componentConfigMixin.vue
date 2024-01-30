<script>
import DeviceConfigMixin from "./deviceConfigMixin.vue";

export default {
	mixins: [DeviceConfigMixin],
	props: {
		component: { type: Object, required: true },
	},
};
</script>
