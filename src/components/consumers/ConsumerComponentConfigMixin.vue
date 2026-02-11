<script>
import ConsumerDeviceConfigMixin from "./ConsumerDeviceConfigMixin.vue";

export default {
  mixins: [ConsumerDeviceConfigMixin],
  props: {
    component: { type: Object, required: true },
  },
};
</script>
