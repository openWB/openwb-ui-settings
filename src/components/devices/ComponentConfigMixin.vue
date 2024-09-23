<script>
import DeviceConfigMixin from "./DeviceConfigMixin.vue";

export default {
	mixins: [DeviceConfigMixin],
	props: {
		component: { type: Object, required: true },
	},
};
</script>
